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
    // Load environment variables
    // host := os.Getenv("HOST")
    // dbPort := os.Getenv("DBPORT")
    // user := os.Getenv("NAME")
    // //dbName := os.Getenv("DB")
    // password := os.Getenv("PASSWORD")
    // // Database connection string
    // dbURI := fmt.Sprintf("host=%s user=%s password=%s dbname=event_lottery port=%s", host, user, password, dbPort)
    host := os.Getenv("HOST")
    user := os.Getenv("NAME")
    password := os.Getenv("PASSWORD")
    dbName := os.Getenv("DB")
    dbPort := os.Getenv("DBPORT")
    // Database connection string
    dbURI := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", host, user, password, dbName, dbPort)

    // Open connection to database
    db, err := gorm.Open(postgres.Open(dbURI), &gorm.Config{})
    if err != nil {
        panic("could not connect to the database")
    } else {
        fmt.Println("Successfully connect to database")
    }

    Connection = db

    db.AutoMigrate(&models.Event{}, &models.User{})

    // create database foreign key for event & users
    db.Migrator().CreateConstraint(&models.Event{}, "Candidates")
    db.Migrator().CreateConstraint(&models.Event{}, "fk_events_candidates")
}