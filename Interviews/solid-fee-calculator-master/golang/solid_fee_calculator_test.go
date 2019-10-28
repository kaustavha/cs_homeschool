package main

import (
	"testing"
	"time"
)

func TestCalculateFeeNormalAuction(t *testing.T) {
	var userType = 0
	var itemType = 0
	var itemPrice = 0
	var itemEndDate = time.Now()
	var expected = 15
	actual, _ := calculateFee(userType, itemType, itemPrice, itemEndDate)

	if expected != actual {
		t.Fatalf("Expected %v but got %v", expected, actual)
	}
}
func TestCalculateFeeNormalBuyItNow(t *testing.T) {
	var userType = 0
	var itemType = 1
	var itemPrice = 0
	var itemEndDate = time.Now()
	var expected = 25
	actual, _ := calculateFee(userType, itemType, itemPrice, itemEndDate)

	if expected != actual {
		t.Fatalf("Expected %v but got %v", expected, actual)
	}
}
func TestCalculateFeeCompanyBuyItNow(t *testing.T) {
	var userType = 1
	var itemType = 1
	var itemPrice = 0
	var itemEndDate = time.Now()
	var expected = 20
	actual, _ := calculateFee(userType, itemType, itemPrice, itemEndDate)

	if expected != actual {
		t.Fatalf("Expected %v but got %v", expected, actual)
	}
}
func TestCalculateFeeCompanyAuction(t *testing.T) {
	var userType = 1
	var itemType = 0
	var itemPrice = 0
	var itemEndDate = time.Now()
	var expected = 10
	actual, _ := calculateFee(userType, itemType, itemPrice, itemEndDate)

	if expected != actual {
		t.Fatalf("Expected %v but got %v", expected, actual)
	}
}
func TestCalculateFeeCompanyAuctionLater(t *testing.T) {
	var userType = 1
	var itemType = 0
	var itemPrice = 0
	var itemEndDate = time.Now().AddDate(0, 0, 1)
	var expected = 20
	actual, _ := calculateFee(userType, itemType, itemPrice, itemEndDate)

	if expected != actual {
		t.Fatalf("Expected %v but got %v", expected, actual)
	}
}
