package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName   string
	LastName    string
	PhoneNumber string
	EventID     int
	Invite      bool
}
