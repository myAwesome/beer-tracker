package handlers

import (
	"beer-tracker/models"
	"net/http"
	"strconv"
	"time"

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

type DailyUnits struct {
	Date       string  `json:"date"`
	DailyUnits float64 `json:"daily_units"`
	RollingSum float64 `json:"rolling_7d"`
}

type DailyConsumption struct {
	Date         string  `json:"date"`
	AlcoholUnits float64 `json:"alcohol_units"`
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

func (h *StatsHandler) DailyAlcohol(c *gin.Context) {
	type dbRow struct {
		Date       time.Time
		DailyUnits float64
	}

	var dbRows []dbRow

	// 1. Агрегація по днях
	err := h.db.Model(&models.ConsumptionLog{}).
		Select("DATE(consumed_at) AS date, SUM(alcohol_units) AS daily_units").
		Group("DATE(consumed_at)").
		Order("date ASC").
		Scan(&dbRows).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(dbRows) == 0 {
		c.JSON(http.StatusOK, []DailyUnits{})
		return
	}

	// 2. Map для швидкого доступу
	dailyMap := make(map[string]float64)
	for _, r := range dbRows {
		key := r.Date.Format("2006-01-02")
		dailyMap[key] = r.DailyUnits
	}

	// 3. Заповнюємо ВСІ дні (без дірок)
	start := dbRows[0].Date
	end := dbRows[len(dbRows)-1].Date

	var full []dbRow

	for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
		key := d.Format("2006-01-02")
		full = append(full, dbRow{
			Date:       d,
			DailyUnits: dailyMap[key], // 0 якщо нема
		})
	}

	// 4. Rolling window (O(n), ефективно)
	result := make([]DailyUnits, len(full))

	var rollingSum float64
	left := 0

	for right := 0; right < len(full); right++ {
		rollingSum += full[right].DailyUnits

		// тримаємо тільки останні 7 днів
		for full[right].Date.Sub(full[left].Date).Hours() > 24*6 {
			rollingSum -= full[left].DailyUnits
			left++
		}

		result[right] = DailyUnits{
			Date:       full[right].Date.Format("2006-01-02"),
			DailyUnits: full[right].DailyUnits,
			RollingSum: rollingSum,
		}
	}

	c.JSON(http.StatusOK, result)
}

// ConsumptionByDays повертає суму alcohol_units за кожен день
// за останні `days` днів (включаючи сьогодні).
// Query param: ?days=7 або ?days=30 (default: 7)
func (h *StatsHandler) ConsumptionByDays(c *gin.Context) {
	days := 7
	if d := c.Query("days"); d != "" {
		if parsed, err := strconv.Atoi(d); err == nil && parsed > 0 {
			days = parsed
		}
	}

	sinceStr := time.Now().AddDate(0, 0, -(days - 1)).Format("2006-01-02")

	var logs []models.ConsumptionLog
	err := h.db.Model(&models.ConsumptionLog{}).
		Select("consumed_at, alcohol_units").
		Where("consumed_at >= ?", sinceStr).
		Find(&logs).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	unitsMap := make(map[string]float64)
	for _, log := range logs {
		dateKey := log.ConsumedAt
		if len(dateKey) > 10 {
			dateKey = dateKey[:10]
		}
		unitsMap[dateKey] += log.AlcoholUnits
	}

	// Будуємо повний масив від сьогодні назад (без дірок)
	result := make([]DailyConsumption, days)
	for i := 0; i < days; i++ {
		key := time.Now().AddDate(0, 0, -i).Format("2006-01-02")
		result[i] = DailyConsumption{
			Date:         key,
			AlcoholUnits: unitsMap[key],
		}
	}

	c.JSON(http.StatusOK, result)
}
