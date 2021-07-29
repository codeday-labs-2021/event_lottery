package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName   string
	LastName    string
	PhoneNumber string
	Username    string //`gorm:"unique"`
	Email       string //`gorm:"unique"`
	Password    []byte `json:"-"`
	Penalty     float64
	Events      []Event      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Occurrences []Occurrence `gorm:"many2many:occurrence_users;"`
}
