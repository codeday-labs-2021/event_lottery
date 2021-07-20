package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName    string
	MaxAttendees int	
	Location     string
	Description  string
	StartDate    string
	StartTime    string
	EndDate      string
	EndTime      string
	LotteryDate  string
	LotteryTime  string
}
