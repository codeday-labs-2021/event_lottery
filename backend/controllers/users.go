package controllers

import (
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
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
	database.Connection.Preload("Candidates").First(&occurrence, occurrenceID)
	for _, candidate := range occurrence.Candidates {
		if candidate.PhoneNumber == user.PhoneNumber {
			c.Status(fiber.StatusNotFound)
			return c.JSON(fiber.Map{
				"message": "You are already registered for this occurrence!",
			})
		}
	}

	occurrence.Candidates = append(occurrence.Candidates, user)
	database.Connection.Save(&occurrence)

	return c.JSON(occurrence.Candidates)
}

func CandidatesUnregistered(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	occurrenceID := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").First(&occurrence, occurrenceID)
	for _, candidate := range occurrence.Candidates {
		if candidate.PhoneNumber == data["phoneNumber"] {
			c.Status(fiber.StatusNotFound)
			return c.JSON(fiber.Map{
				"message": "Candidates list already contains user with the same phone number",
			})
		}
	}

	var user models.User
	database.Connection.Where("phone_number = ?", data["phoneNumber"]).First(&user)
	if user.ID == 0 {
		user = models.User{
			FirstName:   data["firstName"],
			LastName:    data["lastName"],
			PhoneNumber: data["phoneNumber"],
		}
		database.Connection.Create(&user)
	}

	occurrence.Candidates = append(occurrence.Candidates, user)
	database.Connection.Save(&occurrence)

	return c.JSON(occurrence.Candidates)
}

func GetCandidates(c *fiber.Ctx) error {
	id := c.Params("id")
	var occurrence models.Occurrence
	database.Connection.Preload("Candidates").Find(&occurrence, id)
	return c.JSON(occurrence.Candidates)
}

func UserEvents(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	database.Connection.Preload("Events").First(&user, id)
	return c.JSON(user.Events)
}

func UserOccurrences(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	database.Connection.Preload("Occurrences").First(&user, id)
	return c.JSON(user.Occurrences)
}
