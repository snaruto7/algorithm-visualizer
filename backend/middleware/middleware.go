package middleware

import (
	"algorithm-visualizer/config"
	"algorithm-visualizer/models"
	"context"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection
var conf *config.Store = &config.Config

func init() {
	createDBInstance(&config.Config)
}

func BasicAuth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		username, password, ok := r.BasicAuth()
		if ok {
			usernameHash := sha256.Sum256([]byte(username))
			passwordHash := sha256.Sum256([]byte(password))
			expectedUsernameHash := sha256.Sum256([]byte(conf.Username))
			expectedPasswordHash := sha256.Sum256([]byte(conf.Password))

			usernameMatch := (subtle.ConstantTimeCompare(usernameHash[:], expectedUsernameHash[:]) == 1)
			passwordMatch := (subtle.ConstantTimeCompare(passwordHash[:], expectedPasswordHash[:]) == 1)

			if usernameMatch && passwordMatch {
				next.ServeHTTP(w, r)
				return
			}
		}

		w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
	})
}
func createDBInstance(config *config.Store) {
	connectionString := config.Host

	dbName := config.Database
	collectionName := config.Collection
	clientOptions := options.Client().ApplyURI(connectionString)

	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to Database")

	collection = client.Database(dbName).Collection(collectionName)

	fmt.Println("Collections instance created")
}

func GetAllRuns(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	payload := getAllRuns()
	json.NewEncoder(w).Encode(payload)
}

func CreateRun(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var run models.SortRun
	_ = json.NewDecoder(r.Body).Decode(&run)
	insertOneRun(run)
	json.NewEncoder(w).Encode(run)
}

func GetSortRuns(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	params := mux.Vars(r)
	payload := findSortRun(params["id"])
	json.NewEncoder(w).Encode(payload)
}

func getAllRuns() []primitive.M {
	cur, err := collection.Find(context.Background(), bson.D{{}})
	if err != nil {
		log.Fatal(err)
	}

	var results []primitive.M
	for cur.Next(context.Background()) {
		var result bson.M
		e := cur.Decode(&result)
		if e != nil {
			log.Fatal(e)
		}

		results = append(results, result)
	}

	if err := cur.Err(); err != nil {
		log.Fatal(err)
	}

	cur.Close(context.Background())

	return results
}

func insertOneRun(run models.SortRun) {
	_, err := collection.InsertOne(context.Background(), run)

	if err != nil {
		log.Fatal(err)
	}

}

func findSortRun(sort string) []primitive.M {
	groupPipeline := bson.A{
		bson.D{{Key: "$match", Value: bson.D{{Key: "name", Value: sort}}}},
		bson.D{
			{Key: "$group",
				Value: bson.D{
					{Key: "_id", Value: "$name"},
					{Key: "maxTime", Value: bson.D{{Key: "$max", Value: "$time"}}},
					{Key: "averageTime", Value: bson.D{{Key: "$avg", Value: "$time"}}},
					{Key: "totalRuns", Value: bson.D{{Key: "$sum", Value: 1}}},
				},
			},
		},
	}

	cur, err := collection.Aggregate(context.Background(), groupPipeline)
	if err != nil {
		log.Fatal(err)
	}

	var results []bson.M
	if err = cur.All(context.TODO(), &results); err != nil {
		panic(err)
	}
	return results
}
