package models

import "time"

type Inventory struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	BeerID       uint      `json:"beer_id" gorm:"not null;index"`
	Beer         Beer      `json:"beer,omitempty" gorm:"foreignKey:BeerID"`
	Quantity     int       `json:"quantity" gorm:"not null;default:1"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
