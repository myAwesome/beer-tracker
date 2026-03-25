package main

import (
	"log"

	"beer-tracker/config"
	"beer-tracker/database"
	"beer-tracker/router"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}
	cfg := config.Load()
	db := database.Init(cfg.DSN)
	r := router.Setup(db)
	log.Printf("Server starting on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}
