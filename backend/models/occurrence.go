package models

import (
	"gorm.io/gorm"
)

type Occurrence struct {
	gorm.Model
	EventName    string
	Location     string
	Description  string
	StartDate    string
	StartTime    string
	EndDate      string
	EndTime      string
	LotteryDate  string
	LotteryTime  string
	Candidates   []User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
