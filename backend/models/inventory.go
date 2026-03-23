package models

import "time"

type Inventory struct {
	ID           uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	BeerID       uint      `json:"beer_id" gorm:"not null;index"`
	Beer         Beer      `json:"beer,omitempty" gorm:"foreignKey:BeerID"`
	Quantity     int       `json:"quantity" gorm:"not null;default:1"`
	PurchaseDate time.Time `json:"purchase_date"`
	PricePerUnit float64   `json:"price_per_unit"`
	Notes        string    `json:"notes"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
