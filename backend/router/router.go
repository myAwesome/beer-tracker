package router

import (
	"time"

	"beer-tracker/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		beerH := handlers.NewBeerHandler(db)
		beers := api.Group("/beers")
		beers.GET("", beerH.List)
		beers.POST("", beerH.Create)
		beers.GET("/:id", beerH.Get)
		beers.PUT("/:id", beerH.Update)
		beers.DELETE("/:id", beerH.Delete)

		invH := handlers.NewInventoryHandler(db)
		inv := api.Group("/inventory")
		inv.GET("", invH.List)
		inv.POST("", invH.Create)
		inv.GET("/:id", invH.Get)
		inv.PUT("/:id", invH.Update)
		inv.DELETE("/:id", invH.Delete)

		conH := handlers.NewConsumptionHandler(db)
		con := api.Group("/consumption")
		con.GET("", conH.List)
		con.POST("", conH.Create)
		con.GET("/:id", conH.Get)
		con.DELETE("/:id", conH.Delete)

		statsH := handlers.NewStatsHandler(db)
		api.GET("/stats", statsH.Get)
	}

	return r
}
