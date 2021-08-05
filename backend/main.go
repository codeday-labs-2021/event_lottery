package main

import (
	"fmt"
	"github.com/codeday-labs/event_lottery/database"
	"github.com/codeday-labs/event_lottery/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/joho/godotenv/autoload"
	"log"
	"math/rand"
	"os"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())
	database.Connect()
	database.AutomaticDecline()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))

	routes.SetupRoutes(app)

	fmt.Println("Listening on port", os.Getenv("PORT"))
	log.Fatal(app.Listen(os.Getenv("PORT")))
}
