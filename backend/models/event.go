package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName    string
	MaxAttendees int
	StartDate    string
	StartTime    string
	EndDate      string
	EndTime      string
	LotteryDate  string
	LotteryTime  string
	Candidates []User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
