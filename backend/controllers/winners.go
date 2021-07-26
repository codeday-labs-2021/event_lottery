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

// Takes response and updates database
func ReceiveSMS(c *fiber.Ctx) error {
	response := c.FormValue("Body")
	phone := c.FormValue("From")

	var winner models.Winner
	database.Connection.Where("phone_number = ? AND accept_time = ? AND decline_time = ?", phone[1:], "0", "0").First(&winner)

	if strings.ToLower(response) == "yes" {
		winner.AcceptTime = time.Now().Unix()
	} else if strings.ToLower(response) == "no" {
		winner.DeclineTime = time.Now().Unix()
	}
	database.Connection.Save(&winner)

	twiml := TwiML{Message: "Thanks for your response!"}
	x, err := xml.Marshal(twiml)
	if err != nil {
		return err
	}
	c.Set("Content-type", "application/xml")
	return c.Send(x)
}

func CreateWinner(winner models.User, id int) {
	lotteryWinner := models.Winner{
		PhoneNumber:  winner.PhoneNumber,
		OccurrenceID: id,
		CreateTime:   time.Now().Unix(),
		ExpireTime:   time.Now().Unix() + 86400,
	}
	database.Connection.Create(&lotteryWinner)
}

// Update winners via SMS
func SendSMS(winner models.User, eventName string, location string, startDate string, startTime string, endDate string, endTime string) {
	client := twilio.NewRestClient(os.Getenv("TWILIO_SID"), os.Getenv("TWILIO_TOKEN"))

	params := &openapi.CreateMessageParams{}
	params.SetTo(winner.PhoneNumber)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	str := fmt.Sprintf("Congratulations %s, you won the lottery for %s! Event details below:\nBegins: %s at %s\nEnds: %s at %s\nLocation: %s\n\nIf you plan on attending reply YES, if not reply NO.",
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
func RandomCandidates(candidates []models.User, eventName string, location string, startDate string, startTime string, endDate string, endTime string, id int) []models.User {
	// removeInvited := func(s models.User) bool { return !s.Invite }
	// candidates = filter(candidates, removeInvited)
	length, winners := len(candidates)/3, 1

	if length > 0 {
		winners = length
	}
	winnersSlice := make([]models.User, winners)

	for i := 0; i < winners; i++ {
		randomIndex := rand.Intn(len(candidates))
		winnersSlice[i] = candidates[randomIndex]
		candidates = RemoveElement(candidates, randomIndex)
		SendSMS(winnersSlice[i], eventName, location, startDate, startTime, endDate, endTime)
		CreateWinner(winnersSlice[i], id)
	}

	return winnersSlice
}

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	rand.Seed(time.Now().UnixNano())
	return c.JSON(RandomCandidates(occurrence.Candidates, occurrence.EventName, occurrence.Location, occurrence.StartDate, occurrence.StartTime, occurrence.EndDate, occurrence.EndTime, int(occurrence.ID)))
}
