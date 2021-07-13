package controllers

import (
	"github.com/codeday-labs/2021_event_lottery/models"
	"github.com/codeday-labs/2021_event_lottery/database"
	"github.com/gofiber/fiber/v2"
	"fmt"
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
	var data map[string] string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Parsing Body
	maxAttendees, err := strconv.Atoi(data["maxAttendees"])
	if err != nil {
        fmt.Println(err)
    }

	event := models.Event {
		EventName: data["eventName"],
		MaxAttendees: maxAttendees,
		StartTime: data["startDate"] + " " + data["startTime"],
		EndTime: data["endDate"] + " " + data["endTime"],
		LotteryTime: data["lotteryDate"] + " " + data["lotteryTime"],
	}

	database.Connection.Create(&event)

	return c.JSON(event)
}

