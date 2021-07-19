package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName    string
	Description  string
	Location     string
}
