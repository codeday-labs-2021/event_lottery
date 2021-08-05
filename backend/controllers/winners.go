package controllers

import (
	"encoding/xml"
	"fmt"
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	twilio "github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
	"gorm.io/gorm"
	"math/rand"
	"os"
	"strings"
	"time"
)

type TwiML struct {
	XMLName xml.Name `xml:"Response"`
	Message string   `xml:",omitempty"`
}

// Delete from attendee if absent and permanently add penalty for user
func RemoveAttendee(c *fiber.Ctx) error {
	id := c.Params("id")
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var attendee models.Attendee
	database.Connection.Where("phone_number = ? AND occurrence_id = ?", data["phoneNumber"], id).First(&attendee)
	database.Connection.Delete(&attendee)

	var user models.User
	database.Connection.Where("phone_number = ?", data["phoneNumber"]).First(&user)
	user.Penalty += 1
	database.Connection.Save(&user)

	return c.JSON(user)
}

// Takes response and updates database
func ReceiveSMS(c *fiber.Ctx) error {
	response := c.FormValue("Body")
	phone := c.FormValue("From")
	var answer string
	var winner models.Winner
	database.Connection.Where("phone_number = ? AND accept_time = ? AND decline_time = ?", phone[1:], "0", "0").First(&winner)

	if winner.ID == 0 {
		answer = "Sorry, either you already confirmed/declined the invitation or your invitation was revoked due to a late response."
	} else {
		if strings.ToLower(response) == "yes" {
			winner.AcceptTime = time.Now().UnixNano() / int64(time.Millisecond)
			attendee := models.Attendee{
				PhoneNumber:  winner.PhoneNumber,
				OccurrenceID: winner.OccurrenceID,
				WinnerID:     int(winner.ID),
			}
			database.Connection.Create(&attendee)
		} else if strings.ToLower(response) == "no" {
			winner.DeclineTime = time.Now().UnixNano() / int64(time.Millisecond)
		}
		answer = "Thanks for your response!"
		database.Connection.Save(&winner)
	}

	twiml := TwiML{Message: answer}
	x, err := xml.Marshal(twiml)
	if err != nil {
		return err
	}
	c.Set("Content-type", "application/xml")
	return c.Send(x)
}

func CreateWinner(winner models.User, id int) models.Winner {
	lotteryWinner := models.Winner{
		PhoneNumber:  winner.PhoneNumber,
		OccurrenceID: id,
		CreateTime:   time.Now().UnixNano() / int64(time.Millisecond),
		ExpireTime:   time.Now().UnixNano()/int64(time.Millisecond) + 259200000,
	}
	database.Connection.Create(&lotteryWinner)

	go func() {
		DurationOfTime := time.Duration(259200000) * time.Millisecond
		time.AfterFunc(DurationOfTime, func() {
			var updateWinner models.Winner
			database.Connection.Find(&updateWinner, lotteryWinner.ID)
			if updateWinner.AcceptTime == 0 && updateWinner.DeclineTime == 0 {
				updateWinner.DeclineTime = time.Now().UnixNano() / int64(time.Millisecond)
				database.Connection.Save(&updateWinner)
			}
		})
	}()
	time.Sleep(100 * time.Millisecond)

	return lotteryWinner
}

// Update winners via SMS
func SendSMS(winner models.User, eventName string, location string, startDate string, startTime string, endDate string, endTime string) {
	client := twilio.NewRestClient(os.Getenv("TWILIO_SID"), os.Getenv("TWILIO_TOKEN"))

	params := &openapi.CreateMessageParams{}
	params.SetTo(winner.PhoneNumber)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	str := fmt.Sprintf("Congratulations %s, you won the lottery for %s! Event details below:\nBegins: %s at %s\nEnds: %s at %s\nLocation: %s\n\n"+
		"If you plan on attending reply YES, if not reply NO.\nNOTE: You will have exactly 3 days to respond, after 3 days you will be assumed to have declined the invitation.",
		winner.FirstName, eventName, startDate, startTime, endDate, endTime, location)
	params.SetBody(str)

	_, err := client.ApiV2010.CreateMessage(params)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("SMS sent successfully!")
	}
}

// Removes the winner from slice
func RemoveAll(ticket_hopper []string, phoneNumber string) []string {
	var new_ticket_hopper []string
	for _, v := range ticket_hopper {
		if v != phoneNumber {
			new_ticket_hopper = append(new_ticket_hopper, v)
		}
	}
	return new_ticket_hopper
}

// Only 1/3 of candidates are selected from the raffle
func Raffle(db *gorm.DB, tickets_per_person map[string]int, eventName string, location string, startDate string, startTime string, endDate string, endTime string, id int) []models.Winner {
	var ticket_hopper []string
	for person, ticket_count := range tickets_per_person {
		for i := 0; i < ticket_count; i++ {
			ticket_hopper = append(ticket_hopper, person)
		}
	}

	// Change to 1/2
	length, winners := len(tickets_per_person)/2, 1
	if length > 0 {
		winners = length
	}
	var winnerArray []models.Winner

	for i := 0; i < winners; i++ {
		fmt.Println("ticket_hopper", i, ticket_hopper)
		randomIndex := rand.Intn(len(ticket_hopper))
		var winner models.User
		db.Where("phone_number = ?", ticket_hopper[randomIndex]).First(&winner)
		ticket_hopper = RemoveAll(ticket_hopper, ticket_hopper[randomIndex])
		SendSMS(winner, eventName, location, startDate, startTime, endDate, endTime)
		winnerArray = append(winnerArray, CreateWinner(winner, id))
	}

	return winnerArray
}

// Weighted lottery: (most times any one person's attended) - (times this user has attended) - 2*penalties + 1
func GenerateTickets(db *gorm.DB, id int, candidates []models.User) map[string]int {
	// Obtain all occurrences of an event
	var occurrence models.Occurrence
	var event models.Event
	db.First(&occurrence, id)
	db.Preload("Occurrences").First(&event, occurrence.EventID)
	occurrencesArray := event.Occurrences
	occurenceLength := len(occurrencesArray)

	// Calculate amount of times each candidate has attended an occurrence
	var attendance_counts map[string]int = make(map[string]int)
	for _, candidate := range candidates {
		attendance_counts[candidate.PhoneNumber] = 0
	}
	for i := 0; i < occurenceLength; i++ {
		var attendees []models.Attendee
		db.Where("occurrence_id = ?", occurrencesArray[i].ID).Find(&attendees)
		for _, attendee := range attendees {
			for _, candidate := range candidates {
				if candidate.PhoneNumber == attendee.PhoneNumber {
					attendance_counts[candidate.PhoneNumber] += 1
				}
			}
		}
	}

	// Calculate tickets for each person
	var tickets_per_person map[string]int = make(map[string]int)
	var maxTickets int = 0
	for _, value := range attendance_counts {
		if value > maxTickets {
			maxTickets = value
		}
	}
	for key, value := range attendance_counts {
		var candidate models.User
		db.Where("phone_number = ?", key).First(&candidate)
		tickets := maxTickets - value - 2*int(candidate.Penalty) + 1
		if tickets < 0 {
			tickets = 0
		}
		tickets_per_person[key] = tickets
	}

	// // REMOVE
	// fmt.Println("attendance_count", attendance_counts)
	// fmt.Println("tickets_per_person", tickets_per_person)
	return tickets_per_person
}

// Generates a random candidate
func RandomCandidates(db *gorm.DB, candidates []models.User, eventName string, location string, startDate string, startTime string, endDate string, endTime string, id int) []models.Winner {
	tickets_per_person := GenerateTickets(db, id, candidates)

	winnerArray := Raffle(db, tickets_per_person, eventName, location, startDate, startTime, endDate, endTime, id)

	return winnerArray
}

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	if len(occurrence.Candidates) == 0 {
		return c.JSON(nil)
	}
	return c.JSON(RandomCandidates(database.Connection, occurrence.Candidates, occurrence.EventName, occurrence.Location, occurrence.StartDate, occurrence.StartTime, occurrence.EndDate, occurrence.EndTime, int(occurrence.ID)))
}

// 0 : No Invitation, 1 : Invitation Sent, 2 : Accepted Invitation - Present, 3 : Accepted Invitation - Absent, 4 : Declined Invitation
func GetInvitations(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Preload("Winners").Find(&occurrence, id)

	candidatesArray := occurrence.Candidates
	winnersArray := occurrence.Winners
	invitationsSlice := make([]int, len(candidatesArray))
	for i := 0; i < len(winnersArray); i++ {
		for j := 0; j < len(candidatesArray); j++ {
			if winnersArray[i].PhoneNumber == candidatesArray[j].PhoneNumber {
				if winnersArray[i].AcceptTime != 0 {
					var attendee models.Attendee
					database.Connection.Where("phone_number = ? AND occurrence_id = ?", winnersArray[i].PhoneNumber, winnersArray[i].OccurrenceID).First(&attendee)
					if attendee.ID != 0 {
						invitationsSlice[j] = 2
					} else {
						invitationsSlice[j] = 3
					}
				} else if winnersArray[i].DeclineTime != 0 {
					invitationsSlice[j] = 4
				} else {
					invitationsSlice[j] = 1
				}
			}
		}
	}
	return c.JSON(invitationsSlice)
}
