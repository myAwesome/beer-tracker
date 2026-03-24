package models

import (
	"time"

	"gorm.io/gorm"
)

type Brewery struct {
	ID          uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string         `json:"name" gorm:"not null"`
	Country     string         `json:"country"`
	City        string         `json:"city"`
	Website     string         `json:"website"`
	Description string         `json:"description"`
	FoundedYear int            `json:"founded_year"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
