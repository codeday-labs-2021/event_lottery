package models

import (
	"gorm.io/gorm"
)

type Attendee struct {
	gorm.Model
	OccurrenceID int
	PhoneNumber  string
}
