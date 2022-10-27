package router

import (
	"algorithm-visualizer/middleware"

	"github.com/gorilla/mux"
)

func Router() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/api/run", middleware.BasicAuth(middleware.GetAllRuns)).Methods("GET", "OPTIONS")
	router.HandleFunc("/api/run", middleware.BasicAuth(middleware.CreateRun)).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/run/{id}", middleware.BasicAuth(middleware.GetSortRuns)).Methods("GET", "OPTIONS")

	return router
}
