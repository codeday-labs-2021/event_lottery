package database

import (
	// "github.com/codeday-labs/2021_event_lottery/models"
    "fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() {
    // Load environment variables
    dialect := os.Getenv("DIALECT")
    host := os.Getenv("HOST")
    dbPort := os.Getenv("DBPORT")
    user := os.Getenv("USER")
    dbName := os.Getenv("NAME")
    password := os.Getenv("PASSWORD")

    // Database connection string
    dbURI := fmt.Sprintf("host=%s user=%s dbname=%s sslmodel=disable password=%s port=%s", host, user, dbName, password, dbPort)

    // Open connection to database
    db, err = gorm.Open(dialect, dbURI)
    if err != nil {
        panic("could not connect to the database")
    } else {
        fmt.Println("Successfully connect to database")
    }
    
    // Close connection when main exits
    defer db.Close()
}