package main

import (
    "fmt"
    "os"
    "github.com/codeday-labs/event_lottery/database"
    "github.com/codeday-labs/event_lottery/routes"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    _ "github.com/joho/godotenv/autoload"
    "log"
)

func main() {
    database.Connect()

    app := fiber.New()
    app.Use(cors.New())
    
    routes.SetupRoutes(app)
    
    fmt.Println("Listening on port", os.Getenv("PORT"))

    log.Fatal(app.Listen(os.Getenv("PORT")))
}