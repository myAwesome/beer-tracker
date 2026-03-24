package handlers

import (
	"net/http"
	"strconv"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BreweryHandler struct{ db *gorm.DB }

func NewBreweryHandler(db *gorm.DB) *BreweryHandler { return &BreweryHandler{db: db} }

func (h *BreweryHandler) List(c *gin.Context) {
	var breweries []models.Brewery
	query := h.db.Model(&models.Brewery{})
	if q := c.Query("q"); q != "" {
		query = query.Where("name LIKE ? OR country LIKE ? OR city LIKE ?", "%"+q+"%", "%"+q+"%", "%"+q+"%")
	}
	if err := query.Find(&breweries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, breweries)
}

func (h *BreweryHandler) Create(c *gin.Context) {
	var input models.Brewery
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
	c.JSON(http.StatusCreated, input)
}

func (h *BreweryHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var brewery models.Brewery
	if err := h.db.First(&brewery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "brewery not found"})
		return
	}
	c.JSON(http.StatusOK, brewery)
}

func (h *BreweryHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var brewery models.Brewery
	if err := h.db.First(&brewery, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "brewery not found"})
		return
	}
	var input models.Brewery
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.db.Model(&brewery).Updates(input)
	c.JSON(http.StatusOK, brewery)
}

func (h *BreweryHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.db.Delete(&models.Brewery{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
