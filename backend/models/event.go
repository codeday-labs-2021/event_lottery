package models

import (
	"gorm.io/gorm"
	"time"
)

type Event struct {
	gorm.Model
	EventName    string
	LotteryTime  time.Time
	MaxAttendees int
	StartTime    time.Time
	EndTime      time.Time
}