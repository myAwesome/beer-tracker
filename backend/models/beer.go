package models

import (
	"time"

	"gorm.io/gorm"
)

type Beer struct {
	ID          uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string         `json:"name" gorm:"not null"`
	Brewery     string         `json:"brewery"`
	BreweryID   *uint          `json:"brewery_id"`
	BreweryObj  *Brewery       `json:"brewery_obj,omitempty" gorm:"foreignKey:BreweryID"`
	StyleID     *uint          `json:"style_id"`
	StyleObj    *Style         `json:"style_obj,omitempty" gorm:"foreignKey:StyleID"`
	Style       string         `json:"style"`
	ABV         float64        `json:"abv"`
	IBU         *int           `json:"ibu,omitempty"`
	Description string         `json:"description"`
	ImageURL    string         `json:"image_url"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}
