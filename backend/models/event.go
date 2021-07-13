package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName    string
	MaxAttendees int
	StartTime    string
	EndTime      string
	LotteryTime  string
}