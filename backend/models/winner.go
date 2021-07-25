package models

import (
	"gorm.io/gorm"
)

type Winner struct {
	gorm.Model
	CreateTime  int64
	ExpireTime  int64
	AcceptTime  int64
	DeclineTime int64
	PhoneNumber string
	OccurrenceID int
}
