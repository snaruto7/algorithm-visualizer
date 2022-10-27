package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SortRun struct {
	ID   primitive.ObjectID   `json:"_id,omitempty" bson:"_id,omitempty"`
	Name string               `json:"name,omitempty"`
	Time primitive.Decimal128 `json:"time,omitempty"`
}
