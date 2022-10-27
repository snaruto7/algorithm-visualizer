package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

const (
	activeEnvKey  = "ACTIVE_ENV"
	hostKey       = "MONGO_HOST"
	databasekey   = "MONGO_DATABASE"
	collectionKey = "MONGO_COLLECTION"
	usernameKey   = "USER_NAME"
	passwordKey   = "USER_PASSWORD"
	development   = "DEVELOPMENT"
	staging       = "STAGING"
	production    = "PRODUCTION"
)

type Store struct {
	Env        string
	Host       string
	Database   string
	Collection string
	Username   string
	Password   string
}

func loadEnvConfig(config *Store) {
	val, ok := os.LookupEnv(activeEnvKey)
	if !ok || val == "" {
		val = development
	}
	config.Env = val
}

func InitConfig() Store {
	var config = Store{}
	loadEnvConfig(&config)

	if config.Env == production {
		fmt.Println("Running in Production")
		host, ok := os.LookupEnv(hostKey)
		if !ok || host == "" {
			panic("DB host not found")
		}
		config.Host = host

		db, ok := os.LookupEnv(databasekey)
		if !ok || db == "" {
			panic("DB Name not found")
		}
		config.Database = db

		collection, ok := os.LookupEnv(collectionKey)
		if !ok || collection == "" {
			panic("Collection name not found")
		}
		config.Collection = collection

		return config

	}
	if config.Env == staging {
		fmt.Println("Running in Staging")
		host, ok := os.LookupEnv(hostKey)
		if !ok || host == "" {
			panic("DB host not found")
		}
		config.Host = host

		db, ok := os.LookupEnv(databasekey)
		if !ok || db == "" {
			panic("DB Name not found")
		}
		config.Database = db

		collection, ok := os.LookupEnv(collectionKey)
		if !ok || collection == "" {
			panic("Collection name not found")
		}
		config.Collection = collection

		return config

	}
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
	config.Env = os.Getenv(activeEnvKey)
	fmt.Printf("Running in %s\n", config.Env)
	config.Host = os.Getenv(hostKey)
	config.Database = os.Getenv(databasekey)
	config.Collection = os.Getenv(collectionKey)
	config.Username = os.Getenv(usernameKey)
	config.Password = os.Getenv(passwordKey)

	return config
}

var Config = InitConfig()
