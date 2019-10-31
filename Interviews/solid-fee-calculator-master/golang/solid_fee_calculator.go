package main

import (
	"fmt"
	"time"
)

func main() {
	fee, _ := calculateFee(1, 0, 100, time.Now())
	fmt.Print(fee)
}

// This function handles all calculation you ever need!
// usertype: 0= Normal, 1 = Company
// itemtype: 0= Auction, 1 = BuyItNow
// itemprice: price of item
// itemenddate: time item ends
func calculateFee(usertype int, itemtype int, itemprice int, itemenddate time.Time) (int, error) {
	userTypes := map[string]int{
		"Normal":  0,
		"Company": 1,
	}
	itemTypes := map[string]int{
		"Auction":  0,
		"BuyItNow": 1,
	}
	// Sanity check
	if usertype != userTypes["Auction"] && usertype != userTypes["Company"] ||
		itemtype != itemTypes["Normal"] && itemtype != itemTypes["BuyItNow"] {
		return 0, fmt.Errorf("something with the input isn't right here")
	}

	expiringToday := itemenddate.Year() == time.Now().Year() && itemenddate.Month() == time.Now().Month() && itemenddate.Day() == time.Now().Day()
	var discount = 0
	if expiringToday {
		discount += 10
	}
	if usertype == userTypes["Company"] { //Company discount
		discount += 5
	}
	var cost = 0
	if itemtype == itemTypes["Auction"] { //Auction
		cost += 25
	} else if itemtype == itemTypes["BuyItNow"] { //BuyItNow
		cost += 35
	}
	return itemprice + cost - discount, nil
}
// maps, table driven tests