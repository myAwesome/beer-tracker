package handlers

import (
	"net/http"
	"strconv"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BeerHandler struct{ db *gorm.DB }

func NewBeerHandler(db *gorm.DB) *BeerHandler { return &BeerHandler{db: db} }

func (h *BeerHandler) List(c *gin.Context) {
	var beers []models.Beer
	query := h.db.Model(&models.Beer{}).Preload("BreweryObj")
	if q := c.Query("q"); q != "" {
		query = query.
			Joins("LEFT JOIN breweries ON breweries.id = beers.brewery_id AND breweries.deleted_at IS NULL").
			Where("beers.name LIKE ? OR beers.brewery LIKE ? OR breweries.name LIKE ?", "%"+q+"%", "%"+q+"%", "%"+q+"%")
	}
	if err := query.Find(&beers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, beers)
}

func (h *BeerHandler) Create(c *gin.Context) {
	var input models.Beer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if err := h.db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	h.db.Preload("BreweryObj").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

func (h *BeerHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var beer models.Beer
	if err := h.db.Preload("BreweryObj").First(&beer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "beer not found"})
		return
	}
	c.JSON(http.StatusOK, beer)
}

func (h *BeerHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var beer models.Beer
	if err := h.db.First(&beer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "beer not found"})
		return
	}
	var input models.Beer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.db.Model(&beer).Updates(input)
	// Handle BreweryID explicitly so a null value clears the association
	h.db.Model(&beer).Update("brewery_id", input.BreweryID)
	h.db.Preload("BreweryObj").First(&beer, id)
	c.JSON(http.StatusOK, beer)
}

func (h *BeerHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.db.Delete(&models.Beer{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
