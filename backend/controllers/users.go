package controllers

import (
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/gofiber/fiber/v2"
	"github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
	twilio "github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
	"fmt"
	"math/rand"
	"os"
	"time"
)

func RegisterOccurrence(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	claims := token.Claims.(*jwt.StandardClaims)
	var user models.User
	database.Connection.Where("id = ?", claims.Issuer).First(&user)

	occurrenceID := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Find(&occurrence, occurrenceID)

	occurrence.Candidates = append(occurrence.Candidates, user)
	database.Connection.Save(&occurrence)
	return c.JSON(occurrence)
}

func GetCandidates(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	return c.JSON(occurrence.Candidates)
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

// Update winners via SMS
func SendSMS(winner models.User, eventName string, location string, startDate string, startTime string) {
	client := twilio.NewRestClient(os.Getenv("TWILIO_SID"), os.Getenv("TWILIO_TOKEN"))

	params := &openapi.CreateMessageParams{}
	params.SetTo(winner.PhoneNumber)
	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
	str := fmt.Sprintf("Congratulations %s, you won the lottery for %s!\nDate: %s\nTime: %s\nLocation: %s\n",
		winner.FirstName, eventName, startDate, startTime, location)
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
func RandomCandidates(candidates []models.User, eventName string, location string, startDate string, startTime string) []models.User {
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
		SendSMS(winnersSlice[i], eventName, location, startDate, startTime)
		// database.Connection.Model(&models.User{}).Where("id = ?", winnersSlice[i].ID).Update("invite", true)
	}

	return winnersSlice
}

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	rand.Seed(time.Now().UnixNano())
	return c.JSON(RandomCandidates(occurrence.Candidates, occurrence.EventName, occurrence.Location, occurrence.StartDate, occurrence.StartTime))
}
