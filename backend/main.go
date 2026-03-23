package main

import (
	"log"

	"beer-tracker/config"
	"beer-tracker/database"
	"beer-tracker/router"
)

func main() {
	cfg := config.Load()
	db := database.Init(cfg.DBPath)
	r := router.Setup(db)
	log.Printf("Server starting on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}
