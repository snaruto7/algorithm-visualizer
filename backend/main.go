package main

import (
	"algorithm-visualizer/router"
	"fmt"
	"log"
	"net/http"
)

func main() {
	r := router.Router()

	fmt.Println("Starting server on port 8080...")

	log.Fatal(http.ListenAndServe(":8080", r))
}
