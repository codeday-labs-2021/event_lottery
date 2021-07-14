package database

import (
	"github.com/codeday-labs/2021_event_lottery/models"
    "os"
    "fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
    "github.com/joho/godotenv"
    "log"
)

var Connection *gorm.DB

// read/load the .env file and return the value of the key
func goDotEnvVariable(key string) string {
    err := godotenv.Load()
    if err != nil {
      log.Fatalf("Error loading .env file")
    }
    return os.Getenv(key)
}

func Connect() {
    // Load environment variables
    host := goDotEnvVariable("HOST")
    dbPort := goDotEnvVariable("DBPORT")
    user := goDotEnvVariable("USER")
    dbName := goDotEnvVariable("NAME")
    password := goDotEnvVariable("PASSWORD")
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