package controllers

import (
	// "fmt"
	// "github.com/codeday-labs/event_lottery/database"
	// "github.com/codeday-labs/event_lottery/models"
	// "github.com/gofiber/fiber/v2"
	// _ "github.com/joho/godotenv/autoload"
	// twilio "github.com/twilio/twilio-go"
	// openapi "github.com/twilio/twilio-go/rest/api/v2010"
	// "math/rand"
	// "os"
	// "strconv"
	// "time"
)

// func RegisterCandidate(c *fiber.Ctx) error {
// 	var data map[string] string

// 	if err := c.BodyParser(&data); err != nil {
// 		return err
// 	}

// 	// Converting to Appropriate Type
// 	eventID, err := strconv.Atoi(c.Params("id"))
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	user := models.User{
// 		FirstName:   data["firstName"],
// 		LastName:    data["lastName"],
// 		PhoneNumber: data["phoneNumber"],
// 		EventID:     eventID,
// 		Invite:      false,
// 	}

// 	database.Connection.Create(&user)

// 	return c.JSON(user)
// }

// func GetCandidates(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var event models.Event
// 	database.Connection.Preload("Candidates").Find(&event, id)
// 	fmt.Printf("%+v\n", event.Candidates)
// 	return c.JSON(event.Candidates)
// }

// Filters slice
// func filter(ss []models.User, removeInvited func(models.User) bool) (ret []models.User) {
// 	for _, s := range ss {
// 		if removeInvited(s) {
// 			ret = append(ret, s)
// 		}
// 	}
// 	return
// }

// // Update winners via SMS
// func SendSMS(winner models.User, eventName string, startDate string, startTime string, endDate string, endTime string) {
// 	client := twilio.NewRestClient(os.Getenv("TWILIO_SID"), os.Getenv("TWILIO_TOKEN"))

// 	params := &openapi.CreateMessageParams{}
// 	params.SetTo(winner.PhoneNumber)
// 	params.SetFrom(os.Getenv("TWILIO_PHONE_NUMBER"))
// 	str := fmt.Sprintf("Congratulations, you won the lottery for %s!\nYour Event is on %s at %s and ends on %s at %s.\n",
// 		eventName, startDate, startTime, endDate, endTime)
// 	params.SetBody(str)

// 	_, err := client.ApiV2010.CreateMessage(params)
// 	if err != nil {
// 		fmt.Println(err.Error())
// 	} else {
// 		fmt.Println("SMS sent successfully!")
// 	}
// }

// // Removes element from slice
// func RemoveElement(s []models.User, index int) []models.User {
// 	return append(s[:index], s[index+1:]...)
// }

// // Generates a random candidate
// func RandomCandidates(candidates []models.User, eventName string, startDate string, startTime string, endDate string, endTime string) []models.User {
// 	// removeInvited := func(s models.User) bool { return !s.Invite }
// 	// candidates = filter(candidates, removeInvited)

// 	length, winners := len(candidates)/3, 1

// 	if length > 0 {
// 		winners = length
// 	}
// 	winnersSlice := make([]models.User, winners)

// 	for i := 0; i < winners; i++ {
// 		randomIndex := rand.Intn(len(candidates))
// 		winnersSlice[i] = candidates[randomIndex]
// 		candidates = RemoveElement(candidates, randomIndex)
// 		SendSMS(winnersSlice[i], eventName, startDate, startTime, endDate, endTime)
// 		database.Connection.Model(&models.User{}).Where("id = ?", winnersSlice[i].ID).Update("invite", true)
// 	}

// 	return winnersSlice
// }

// func GetLotteryWinners(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	var event models.Event
// 	database.Connection.Preload("Candidates").Find(&event, id)
// 	rand.Seed(time.Now().UnixNano())
// 	return c.JSON(RandomCandidates(event.Candidates, event.EventName, event.StartDate, event.StartTime, event.EndDate, event.EndTime))
// }
