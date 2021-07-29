package controllers

import (
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	_ "github.com/joho/godotenv/autoload"
	"golang.org/x/crypto/bcrypt"
	"strconv"
	"time"
)

const SecretKey = "secret"

func Signup(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		FirstName:   data["firstName"],
		LastName:    data["lastName"],
		PhoneNumber: data["phoneNumber"],
		Username:    data["username"],
		Email:       data["email"],
		Password:    password,
		Penalty:     0,
	}

	database.Connection.Create(&user)

	return c.JSON(user)
}

// Authorize login
func Login(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Checks username & password
	var user models.User
	database.Connection.Where("email = ?", data["email"]).First(&user)
	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}
	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "incorrect password",
		})
	}

	// Create JWT token and send to client
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})
	token, err := claims.SignedString([]byte(SecretKey))
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	// Store token in cookies
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

// Authorize user
func User(c *fiber.Ctx) error {
	// Gets the cookie
	cookie := c.Cookies("jwt")

	// Takes the cookie to retrieve the token
	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	// Get claims, convert claims to standard claims, retrieves ID from issuer
	claims := token.Claims.(*jwt.StandardClaims)

	// Queries DB for user
	var user models.User
	database.Connection.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

// Authorize logout
func Logout(c *fiber.Ctx) error {
	// Removes cookie
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)
	return c.JSON(fiber.Map{
		"message": "success",
	})
}
