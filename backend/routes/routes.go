package routes

import (
	"github.com/codeday-labs/2021_event_lottery/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/api/v1/event", controllers.GetEvents)
	app.Get("/api/v1/event/:id", controllers.GetEvent)
	app.Get("/api/v1/lottery/:id", controllers.GetLotteryWinners)
	app.Post("/api/v1/event", controllers.CreateEvent)
	app.Post("/api/v1/register", controllers.RegisterUser)
}
