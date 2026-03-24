package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port string
	DSN  string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "root"
	}
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	if name == "" {
		name = "beer_tracker"
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, dbPort, name)

	return &Config{Port: port, DSN: dsn}
}
