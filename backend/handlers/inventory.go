package handlers

import (
	"net/http"
	"strconv"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type InventoryHandler struct{ db *gorm.DB }

func NewInventoryHandler(db *gorm.DB) *InventoryHandler { return &InventoryHandler{db: db} }

func (h *InventoryHandler) List(c *gin.Context) {
	var items []models.Inventory
	query := h.db.Preload("Beer")
	if beerID := c.Query("beer_id"); beerID != "" {
		query = query.Where("beer_id = ?", beerID)
	}
	query.Find(&items)
	c.JSON(http.StatusOK, items)
}

func (h *InventoryHandler) Create(c *gin.Context) {
	var input models.Inventory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.BeerID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "beer_id is required"})
		return
	}
	h.db.Create(&input)
	h.db.Preload("Beer").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

func (h *InventoryHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.Inventory
	if err := h.db.Preload("Beer").First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "inventory item not found"})
		return
	}
	c.JSON(http.StatusOK, item)
}

func (h *InventoryHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var item models.Inventory
	if err := h.db.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	var input models.Inventory
	c.ShouldBindJSON(&input)
	h.db.Model(&item).Updates(input)
	h.db.Preload("Beer").First(&item, id)
	c.JSON(http.StatusOK, item)
}

func (h *InventoryHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	h.db.Delete(&models.Inventory{}, id)
	c.Status(http.StatusNoContent)
}
