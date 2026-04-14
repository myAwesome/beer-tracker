package handlers

import (
	"net/http"
	"strconv"
	"time"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ConsumptionHandler struct{ db *gorm.DB }

func NewConsumptionHandler(db *gorm.DB) *ConsumptionHandler { return &ConsumptionHandler{db: db} }

func (h *ConsumptionHandler) List(c *gin.Context) {
	var logs []models.ConsumptionLog
	query := h.db.Preload("Beer").Order("consumed_at DESC")
	if beerID := c.Query("beer_id"); beerID != "" {
		query = query.Where("beer_id = ?", beerID)
	}
	query.Find(&logs)
	c.JSON(http.StatusOK, logs)
}

func (h *ConsumptionHandler) Create(c *gin.Context) {
	var input models.ConsumptionLog
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.BeerID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beer_id is required"})
		return
	}
	if input.Rating < 1.0 || input.Rating > 5.0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rating must be between 1 and 5"})
		return
	}
	if input.ConsumedAt == "" {
		input.ConsumedAt = time.Now().Format("2006-01-02")
	}
	var beer models.Beer
	if err := h.db.First(&beer, input.BeerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beer not found"})
		return
	}
	if input.Amount > 0 {
		input.AlcoholUnits = input.Amount * beer.ABV / 1000
	}
	h.db.Create(&input)
	h.db.Preload("Beer").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

func (h *ConsumptionHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var entry models.ConsumptionLog
	if err := h.db.Preload("Beer").First(&entry, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, entry)
}

func (h *ConsumptionHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	var entry models.ConsumptionLog
	if err := h.db.First(&entry, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}

	var input models.ConsumptionLog
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.BeerID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beer_id is required"})
		return
	}
	if input.Rating < 1.0 || input.Rating > 5.0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rating must be between 1 and 5"})
		return
	}
	if input.ConsumedAt == "" {
		input.ConsumedAt = time.Now().Format("2006-01-02")
	}

	var beer models.Beer
	if err := h.db.First(&beer, input.BeerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beer not found"})
		return
	}

	entry.BeerID = input.BeerID
	entry.Amount = input.Amount
	entry.Rating = input.Rating
	entry.Notes = input.Notes
	entry.ConsumedAt = input.ConsumedAt
	if input.Amount > 0 {
		entry.AlcoholUnits = input.Amount * beer.ABV / 1000
	} else {
		entry.AlcoholUnits = 0
	}

	h.db.Save(&entry)
	h.db.Preload("Beer").First(&entry, entry.ID)
	c.JSON(http.StatusOK, entry)
}

func (h *ConsumptionHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	h.db.Delete(&models.ConsumptionLog{}, id)
	c.Status(http.StatusNoContent)
}