package database

import (
	"log"

	"beer-tracker/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(dsn string) *gorm.DB {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	err = db.AutoMigrate(
		&models.Brewery{},
		&models.Style{},
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
