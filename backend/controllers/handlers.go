package controllers

import (
	"github.com/codeday-labs/2021_event_lottery/models"
	"github.com/codeday-labs/2021_event_lottery/database"
	"github.com/gofiber/fiber/v2"
	"fmt"
	"strconv"
	"time"
)

func Create(c *fiber.Ctx) error {
	var data map[string] string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Parsing Body
	maxAttendees, err := strconv.Atoi(data["maxAttendees"])
	if err != nil {
        fmt.Println(err)
    }
	// FIX TIME
	// layout := "2021-07-14 19:58:00"
	// startTime, _ := time.Parse(layout, data["startTime"])
	// endTime, _ := time.Parse(layout, data["endTime"])

	event := models.Event {
		EventName: data["eventName"],
		LotteryTime: time.Now(),
		MaxAttendees: maxAttendees,
		StartTime: time.Now(),
		EndTime: time.Now(),
	}

	database.Connection.Create(&event)

	return c.JSON(event)
}