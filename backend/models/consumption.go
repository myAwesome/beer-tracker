package models

import "time"

type ConsumptionLog struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	BeerID     uint      `json:"beer_id" gorm:"not null;index"`
	Beer       Beer      `json:"beer,omitempty" gorm:"foreignKey:BeerID"`
	ConsumedAt time.Time `json:"consumed_at"`
	Rating     int       `json:"rating"`
	Notes      string    `json:"notes"`
	CreatedAt  time.Time `json:"created_at"`
}
