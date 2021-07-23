package models

import (
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	EventName   string
	Location    string
	Description string
	Owner       string
	UserID      int
	Occurrences []Occurrence `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
