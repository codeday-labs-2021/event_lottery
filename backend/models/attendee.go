package models

import (
	"gorm.io/gorm"
)

type Attendee struct {
	gorm.Model
	PhoneNumber  string
	OccurrenceID int
	WinnerID     int
	Winner       Winner
}
