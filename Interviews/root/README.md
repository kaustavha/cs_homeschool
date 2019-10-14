# Feedback 
```
* The way he calculates the difference in start and end time clearly demonstrates that he is not familiar with javascript language idioms
* Tests are not descriptive and does not cover some use cases like boundary condition for avg speed higher than 100
* No separation of concerns - Driving History class parses the lines and generates the report
* Both Driver and Trip data are combined into a single Metric class. Not much thought being put into object modeling the solution resulting in more complexity than necessary
* No evidence of TDD
```
# TODO - improvements based on feedback
- spped calc is wrong in _calculateAverageSpeed; needs to convert hours to 60 mins, currently treats 1hr as 100mins and divides simply
- More tests, avg speed > x, more unit, test individual functions instead of i/o to show TDD instead of integration only
- Smaller, more modular classes, e.g. a trip class, used in a driver class used in Driving history. Seperate class or func for parsing input and rendering output

# Problem statement:
https://gist.github.com/dan-manges/1e1854d0704cb9132b74

# Usage
```
node root_cli.js <relativeFilePath>
```

# Arch
`root_cli.js` handles cli input, reads specified file and uses `root_lib`   
`root_test.js` tests  
`root_lib.js` has main logic  

We use 2 classes in root_lib:  
- a Metric interface that specifies the metrics we care about, this holds driver info like name and running tallies of distance and average speed. Used in DrivingHistory
- DrivingHistory - which implements business logic. Given a string with the sample format it'll accumulate the required Metrics.   
Functions:  
  - process - processes text line and calls appropriate handler function addDriver or addTrip
  - addDriver - adds a driver to our set of drivers
  - addTrip - associates a trip with a known driver, generates averageSpeed, updates Metric linked to the driver name


Adding trips and adding drivers are constant time, since report generation is done less frequently we dont keep a sorted list and this takes O(nlogn);
Error handling is just console log statements out and is very minimal.

In the interest of time some trade-offs were made:  
We test a few edge cases but not exhaustively. Also the driver name is used as the key and this implementation will not work with different drivers with the same name. 
We also don't gaurd for malicious or malformed input.

Since we synchronously load the input text file and store it in an in memory buffer, very large files can cause issues. The cli component can be easily refactored to a streaming interface if that becomes an issue. 
