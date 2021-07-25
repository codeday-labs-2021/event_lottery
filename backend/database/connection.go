package database

import (
	"github.com/codeday-labs/event_lottery/models"
    "os"
    "fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
    _ "github.com/joho/godotenv/autoload"
)

var Connection *gorm.DB

func Connect() {
    host := os.Getenv("HOST")
    user := os.Getenv("NAME")
    password := os.Getenv("PASSWORD")
    dbName := os.Getenv("DB")
    dbPort := os.Getenv("DBPORT")
    
    // Database connection string
    dbURI := fmt.Sprintf("host=%s user=%s password=%s dbname=%s dbport=%s", host, user, password, dbName, dbPort)

    // Open connection to database
    db, err := gorm.Open(postgres.Open(dbURI), &gorm.Config{})
    if err != nil {
        panic("could not connect to the database")
    } else {
        fmt.Println("Successfully connect to database")
    }

    Connection = db

    db.AutoMigrate(&models.User{}, &models.Event{}, &models.Occurrence{}, &models.Winner{})
}