package handlers

import (
	"net/http"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StatsHandler struct{ db *gorm.DB }

func NewStatsHandler(db *gorm.DB) *StatsHandler { return &StatsHandler{db: db} }

type StatsResponse struct {
	TotalBeers      int64   `json:"total_beers"`
	TotalInventory  int     `json:"total_inventory"`
	TotalConsumed   int64   `json:"total_consumed"`
	AverageRating   float64 `json:"average_rating"`
	UniqueBreweries int64   `json:"unique_breweries"`
	TopBeerID       *uint   `json:"top_beer_id,omitempty"`
	TopBeerName     string  `json:"top_beer_name,omitempty"`
}

func (h *StatsHandler) Get(c *gin.Context) {
	var stats StatsResponse

	h.db.Model(&models.Beer{}).Count(&stats.TotalBeers)
	h.db.Model(&models.Beer{}).Distinct("brewery").Count(&stats.UniqueBreweries)
	h.db.Model(&models.ConsumptionLog{}).Count(&stats.TotalConsumed)

	h.db.Model(&models.Inventory{}).
		Select("COALESCE(SUM(quantity), 0)").
		Scan(&stats.TotalInventory)

	h.db.Model(&models.ConsumptionLog{}).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&stats.AverageRating)

	type TopBeer struct {
		BeerID uint
		Name   string
		Count  int
	}
	var top TopBeer
	h.db.Model(&models.ConsumptionLog{}).
		Select("consumption_logs.beer_id, beers.name, COUNT(*) as count").
		Joins("JOIN beers ON beers.id = consumption_logs.beer_id").
		Group("consumption_logs.beer_id").
		Order("count DESC").
		Limit(1).
		Scan(&top)
	if top.BeerID != 0 {
		stats.TopBeerID = &top.BeerID
		stats.TopBeerName = top.Name
	}

	c.JSON(http.StatusOK, stats)
}
