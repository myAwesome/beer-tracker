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

		breweryH := handlers.NewBreweryHandler(db)
		breweries := api.Group("/breweries")
		breweries.GET("", breweryH.List)
		breweries.POST("", breweryH.Create)
		breweries.GET("/:id", breweryH.Get)
		breweries.PUT("/:id", breweryH.Update)
		breweries.DELETE("/:id", breweryH.Delete)

		styleH := handlers.NewStyleHandler(db)
		styles := api.Group("/styles")
		styles.GET("", styleH.List)
		styles.POST("", styleH.Create)
		styles.GET("/:id", styleH.Get)
		styles.PUT("/:id", styleH.Update)
		styles.DELETE("/:id", styleH.Delete)

		statsH := handlers.NewStatsHandler(db)
		api.GET("/stats", statsH.Get)
	}

	return r
}
