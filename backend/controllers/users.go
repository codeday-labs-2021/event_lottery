package controllers

import (
	"fmt"
	"math/rand"
	"time"
	"github.com/codeday-labs/2021_event_lottery/database"
	"github.com/codeday-labs/2021_event_lottery/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func RegisterUser(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Converting to Appropriate Type
	eventID, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		fmt.Println(err)
	}

	user := models.User{
		FirstName:   data["firstName"],
		LastName:    data["lastName"],
		PhoneNumber: data["phoneNumber"],
		EventID:     eventID,
	}

	database.Connection.Create(&user)

	return c.JSON(user)
}

func GetCandidates(c *fiber.Ctx) error {
	id := c.Params("id")
	var event models.Event
	database.Connection.Preload("Candidates").Find(&event, id)
	fmt.Printf("%+v\n", event.Candidates)
	return c.JSON(event.Candidates)
}

func RandomCandidates(candidates []models.User) []models.User {
	rand.Seed(time.Now().UnixNano())
	a := make([]models.User, 2)
	length := len(candidates)
	for i := 0; i < 2; i++ {
		randomIndex := rand.Intn(length)
		fmt.Println(i, randomIndex)
		a[i] = candidates[randomIndex]
	}
    return a
}

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var event models.Event
	database.Connection.Preload("Candidates").Find(&event, id)

	// candidates, winners := len(event.Candidates)/3, 1
	// if candidates > 0 {
	// 	winners = candidates / 3
	// }
	// RandomCandidates(event.Candidates)
	
	return c.JSON(RandomCandidates(event.Candidates))
}
