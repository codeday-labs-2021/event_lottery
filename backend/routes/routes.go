package routes

import (
	"github.com/codeday-labs/event_lottery/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/api/v1/event", controllers.CreateEvent)
	app.Get("/api/v1/event", controllers.GetEvents)
	app.Get("/api/v1/event/:id", controllers.GetEvent)
	app.Post("/api/v1/occurrence", controllers.CreateOccurrence)
	app.Get("/api/v1/occurrences/:id", controllers.GetOccurrences)
	app.Get("/api/v1/occurrence/:id", controllers.GetOccurrence)
	app.Post("/api/v1/signup", controllers.Signup)
	app.Post("/api/v1/login", controllers.Login)
	app.Get("/api/v1/user", controllers.User)
	app.Post("/api/v1/logout", controllers.Logout)
	app.Post("/api/v1/register-occurrence/:id", controllers.RegisterOccurrence)
	app.Get("/api/v1/candidates/:id", controllers.GetCandidates)
	app.Get("/api/v1/occurrence-winner/:id", controllers.GetLotteryWinners)
}
