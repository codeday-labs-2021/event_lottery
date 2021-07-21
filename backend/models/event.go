package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName    string
	Location     string
	Description  string
	Owner        int
}
