package controllers

import (
	"fmt"
	"strconv"
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/gofiber/fiber/v2"
	"github.com/dgrijalva/jwt-go"
	_ "github.com/joho/godotenv/autoload"
)

func CandidatesRegistered(c *fiber.Ctx) error {
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

func CandidatesUnregistered(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	database.Connection.Where("phone_number = ?", data["phoneNumber"]).First(&user)
	if user.ID == 0 {
		user = models.User {
			FirstName:   data["firstName"],
			LastName:    data["lastName"],
			PhoneNumber: data["phoneNumber"],
		}
		database.Connection.Create(&user)
	}

	occurrenceID := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Find(&occurrence, occurrenceID)
	occurrence.Candidates = append(occurrence.Candidates, user)
	database.Connection.Save(&occurrence)

	return c.JSON(user)
}

func GetCandidates(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	return c.JSON(occurrence.Candidates)
}

func UserEvents(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	id, err := strconv.Atoi(data["id"])
	if err != nil {
		fmt.Println(err)
	}
	
	var user models.User
	database.Connection.First(&user, id)

	return c.JSON(user.Events)
}

func UserOccurrences(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	id, err := strconv.Atoi(data["id"])
	if err != nil {
		fmt.Println(err)
	}
	
	var user models.User
	database.Connection.First(&user, id)

	return c.JSON(user.Occurrences)
}
