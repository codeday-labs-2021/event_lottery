package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName   string
	LastName    string
	PhoneNumber string
	Username    string `gorm:"unique"`
	Email       string `gorm:"unique"`
	Password    []byte `json:"-"`
}
