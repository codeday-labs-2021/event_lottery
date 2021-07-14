package controllers

import (
	"fmt"
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

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	event := &models.Event{}
	database.Connection.Preload("Candidates").Find(&event, id)
	fmt.Printf("%+v\n", event)
	return c.JSON(event)
}