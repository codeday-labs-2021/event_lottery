package controllers

import (
	"fmt"
	"github.com/codeday-labs/2021_event_lottery/database"
	"github.com/codeday-labs/2021_event_lottery/models"
	"github.com/gofiber/fiber/v2"
)

func GetLotteryWinners(c *fiber.Ctx) error {
	id := c.Params("id")
	var winners []models.User
	database.Connection.Find(&event, id)
	return c.JSON(winners)
}