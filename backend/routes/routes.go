package routes

import (
	"github.com/codeday-labs/2021_event_lottery/controllers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	app.Post("/api/v1/event", controllers.Create)
	//app.post("/api/v1/regester")
}
