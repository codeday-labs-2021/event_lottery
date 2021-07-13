package controllers

import (
	"fmt"
	"github.com/codeday-labs/2021_event_lottery/database"
	"github.com/codeday-labs/2021_event_lottery/models"
	"github.com/gofiber/fiber/v2"
)

func RegisterUser(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	user := models.User{
		FirstName:    data["firstName"],
		lastName: data["lastName"],
		PhoneNumber:    data["phoneNumber"]
	}

	database.Connection.Create(&user)

	return c.JSON(user)
}