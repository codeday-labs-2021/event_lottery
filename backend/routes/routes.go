package routes

import (
	"github.com/codeday-labs/event_lottery/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/api/v1/event", controllers.GetEvents)
	app.Post("/api/v1/event", controllers.CreateEvent)
	app.Get("/api/v1/event/:id", controllers.GetEvent)
	app.Post("/api/v1/register", controllers.Register)
	app.Post("/api/v1/login", controllers.Login)
	app.Get("/api/v1/user", controllers.User)
	app.Post("/api/v1/logout", controllers.Logout)
	// app.Get("/api/v1/user/:id", controllers.GetCandidates)
	// app.Get("/api/v1/user/winner/:id", controllers.GetLotteryWinners)
}
