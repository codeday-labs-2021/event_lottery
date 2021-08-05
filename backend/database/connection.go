package database

import (
	"fmt"
	"github.com/codeday-labs/event_lottery/models"
	_ "github.com/joho/godotenv/autoload"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
	"time"
)

var Connection *gorm.DB

func Connect() {
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

	db.AutoMigrate(&models.User{}, &models.Event{}, &models.Occurrence{}, &models.Winner{}, &models.Attendee{})
}

func AutomaticDecline() {
	var winners []models.Winner
	Connection.Find(&winners)

	for _, element := range winners {
		timeNow := time.Now().UnixNano() / int64(time.Millisecond)
		if element.ExpireTime <= timeNow && element.AcceptTime == 0 && element.DeclineTime == 0 {
			element.DeclineTime = timeNow
			Connection.Save(&element)
		} else if element.ExpireTime > timeNow && element.AcceptTime == 0 && element.DeclineTime == 0 {
			go func() {
				DurationOfTime := time.Duration(element.ExpireTime-timeNow) * time.Millisecond
				time.AfterFunc(DurationOfTime, func() {
					element.DeclineTime = time.Now().UnixNano() / int64(time.Millisecond)
					Connection.Save(&element)
				})
			}()
			time.Sleep(100 * time.Millisecond)
		}
	}
}
