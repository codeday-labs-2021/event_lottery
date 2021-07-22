package controllers

import (
	"fmt"
	"strconv"

	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/gofiber/fiber/v2"
)

func GetOccurrences(c *fiber.Ctx) error {
	id := c.Params("id")
	var event models.Event
	database.Connection.Preload("Occurrences").Find(&event, id)
	fmt.Printf("%+v\n", event.Occurrences)
	return c.JSON(event.Occurrences)
}

func GetOccurrence(c *fiber.Ctx) error {
	id := c.Params("id1")
	var occurrence models.Occurrence
	database.Connection.Find(&occurrence, id)
	return c.JSON(occurrence)
}

func CancelOccurrence(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Find(&occurrence, id)
	if occurrence.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "occurence not found",
		})
	}
	database.Connection.Delete(&occurrence, id)
	return c.JSON(occurrence)
}

func CreateOccurrence(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Converting to Appropriate Type
	maxAttendees, err := strconv.Atoi(data["maxAttendees"])
	if err != nil {
		fmt.Println(err)
	}
	eventID, err := strconv.Atoi(data["eventID"])
	if err != nil {
		fmt.Println(err)
	}

	occurrence := models.Occurrence{
		EventName:    data["eventName"],
		MaxAttendees: maxAttendees,
		Location:     data["location"],
		Description:  data["description"],
		StartDate:    data["startDate"],
		StartTime:    data["startTime"],
		EndDate:      data["endDate"],
		EndTime:      data["endTime"],
		LotteryDate:  data["lotteryDate"],
		LotteryTime:  data["lotteryTime"],
		EventID:      eventID,
	}

	database.Connection.Create(&occurrence)

	return c.JSON(occurrence)
}
