package handlers

import (
	"net/http"
	"strconv"

	"beer-tracker/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StyleHandler struct{ db *gorm.DB }

func NewStyleHandler(db *gorm.DB) *StyleHandler { return &StyleHandler{db: db} }

func (h *StyleHandler) List(c *gin.Context) {
	var styles []models.Style
	query := h.db.Model(&models.Style{})
	if q := c.Query("q"); q != "" {
		query = query.Where("name LIKE ?", "%"+q+"%")
	}
	if err := query.Order("name").Find(&styles).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, styles)
}

func (h *StyleHandler) Create(c *gin.Context) {
	var input models.Style
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

func (h *StyleHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var style models.Style
	if err := h.db.First(&style, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "style not found"})
		return
	}
	c.JSON(http.StatusOK, style)
}

func (h *StyleHandler) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var style models.Style
	if err := h.db.First(&style, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "style not found"})
		return
	}
	var input models.Style
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	h.db.Model(&style).Updates(input)
	c.JSON(http.StatusOK, style)
}

func (h *StyleHandler) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.db.Delete(&models.Style{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
