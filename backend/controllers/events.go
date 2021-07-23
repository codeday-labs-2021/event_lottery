package controllers

import (
	"fmt"
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func GetEvents(c *fiber.Ctx) error {
	var events []models.Event
	database.Connection.Find(&events)
	return c.JSON(events)
}

func GetEvent(c *fiber.Ctx) error {
	id := c.Params("id")
	var event models.Event
	database.Connection.Find(&event, id)
	return c.JSON(event)
}

func CreateEvent(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Converting to Appropriate Type
	userID, err := strconv.Atoi(data["userID"])
	if err != nil {
		fmt.Println(err)
	}

	event := models.Event{
		EventName:   data["eventName"],
		Location:    data["location"],
		Description: data["description"],
		Owner:       data["owner"],
		UserID:      userID,
	}

	database.Connection.Create(&event)

	return c.JSON(event)
}
