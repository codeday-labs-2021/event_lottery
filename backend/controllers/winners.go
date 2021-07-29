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
	"math/rand"
	"os"
	"strings"
	"time"
)

type TwiML struct {
	XMLName xml.Name `xml:"Response"`
	Message string   `xml:",omitempty"`
}

// Filters slice
// func filter(ss []models.User, removeInvited func(models.User) bool) (ret []models.User) {
// 	for _, s := range ss {
// 		if removeInvited(s) {
// 			ret = append(ret, s)
// 		}
// 	}
// 	return
// }

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
	user.Penalty += 0.05
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
				WinnerID:   int(winner.ID),
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
		ExpireTime:   time.Now().UnixNano() / int64(time.Millisecond) + 259200000,
	}
	database.Connection.Create(&lotteryWinner)
	// state to reconstruct to die early
	// scan for state infomration so it can reconstruct functions
	// how to schedule things into rows in the DB
	DurationOfTime := time.Duration(259200000) * time.Millisecond
	time.AfterFunc(DurationOfTime, func() {
		var updateWinner models.Winner
		database.Connection.Find(&updateWinner, lotteryWinner.ID)
		if updateWinner.AcceptTime == 0 && updateWinner.DeclineTime == 0 {
			updateWinner.DeclineTime = time.Now().UnixNano() / int64(time.Millisecond)
			database.Connection.Save(&updateWinner)
		}
	})
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

// Removes element from slice
func RemoveElement(s []models.User, index int) []models.User {
	return append(s[:index], s[index+1:]...)
}

// Generates a random candidate
func RandomCandidates(candidates []models.User, eventName string, location string, startDate string, startTime string, endDate string, endTime string, id int) []models.Winner {
	// removeInvited := func(s models.User) bool { return !s.Invite }
	// candidates = filter(candidates, removeInvited)
	length, winners := len(candidates)/3, 1

	if length > 0 {
		winners = length
	}
	winnersSlice := make([]models.User, winners)
	var winnerArray []models.Winner

	for i := 0; i < winners; i++ {
		randomIndex := rand.Intn(len(candidates))
		winnersSlice[i] = candidates[randomIndex]
		candidates = RemoveElement(candidates, randomIndex)
		SendSMS(winnersSlice[i], eventName, location, startDate, startTime, endDate, endTime)
		winnerArray = append(winnerArray, CreateWinner(winnersSlice[i], id))
	}

	return winnerArray
}

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	rand.Seed(time.Now().UnixNano())
	return c.JSON(RandomCandidates(occurrence.Candidates, occurrence.EventName, occurrence.Location, occurrence.StartDate, occurrence.StartTime, occurrence.EndDate, occurrence.EndTime, int(occurrence.ID)))
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
				if (winnersArray[i].AcceptTime != 0) {
					var attendee models.Attendee
					database.Connection.Where("phone_number = ? AND occurrence_id = ?", winnersArray[i].PhoneNumber, winnersArray[i].OccurrenceID).First(&attendee)
					if attendee.ID != 0 {
						invitationsSlice[j] = 2
					} else {
						invitationsSlice[j] = 3
					}
				} else if (winnersArray[i].DeclineTime != 0) {
					invitationsSlice[j] = 4
				} else {
					invitationsSlice[j] = 1
				}
			}
		}
    }
	return c.JSON(invitationsSlice)
}
