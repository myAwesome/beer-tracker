package database

import (
	"log"

	"beer-tracker/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(dbPath string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	err = db.AutoMigrate(
		&models.Beer{},
		&models.Inventory{},
		&models.ConsumptionLog{},
	)
	if err != nil {
		log.Fatalf("auto-migration failed: %v", err)
	}

	log.Println("Database initialized and migrated")
	return db
}
