# Running

Install dependencies using `yarn install`. 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### The App

The app allows users to submit items they want to sell. They can either submit auction items or fixed price buy it now items. 
Submitting items comes with a fee. The fee is calculated according to a set of rules detailed bellow. 

### Assignment 

The code in this small app is on purpose quite horrible. Your task is to improve it. You should not spend more than 2-4 hours. Choose 2 areas of improvement and change the code accordingly.

- The calculator code is not very maintainable and has very poor test coverage. Try improving this code. 
- The react App component is a bit messy in many ways. Any ideas for how to refactor and break this apart? 
- Add validation and error handling in the Register new item form so you cannot press submit when form values are not valid or incomplete. 
- Show added items in a card design with information styled nicely. 

During the technical interview we can talk through your changes and also discuss other changes you would like to do. 

When you want to submit your changes, remove the node_modules folder, zip the folder and attach it in an email. We kindly ask you not to publish your solution.

## Details on the fee calculator 

Calculate the fee for publishing an ad. Refactor the code to something that you're satisfied with - code that you would want to maintain.

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

In the code example, the end date discount are only implemented for auctions, but we would like it to also work for Buy It Now ads. You only need to do this if you choose to improve the calculator code.

