# SOLID FEE CALCULATOR

## Task Description

Calculate the fee for publishing an ad.

Refactor the code to something that you're satisfied with - code that you would want to maintain.

The code exists in 3 languages: go, C# and Java. There is also a frontend version in JavaScript and React with different instructions that are located in the [js-react directory](js-react/README.md).

### Conditions

In this example there are two types of ads:

* Auction (bids are placed until an ad ends)
* Buy it now (an ad is bought directly and thereby ending)

There's two types of users:

* Company users
* Non-company users (normal)

#### Calculation rules

The formula to calculate the sum of fees is:

* Price of the ad + type of ad cost - discount

Costs:

| Ad type       | Cost |
| ------------- |:----:|
| Auction       | 25   |
| Buy It Now    | 35   |

Discounts:

* If an ad ends today there's a discount of 10.
* Company users get a discount of 5 when they publish an ad.

## New desired feature:

In the code example, the end date discount are only implemented for auctions, but we would like it to also work for Buy It Now ads.
