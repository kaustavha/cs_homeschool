// Square 2nd round interview coderpad+phone

var _ = require('underscore');

function ballgame(n, k) {
  let gameArr = [];
  for (let i=1;i<n+1;i++) {
    gameArr.push(i);
  }
  
  let elims = 0;
  let startPlayer =0;
  
  while (elims < n-1) {
//     for (let j=0; j<k; j++) {
//       if (startPlayer >= gameArr.length) {
//         startPlayer = 0;
//       }
      
//       startPlayer++;
      
//       // console.log(startPlayer)
//       if (startPlayer >= gameArr.length) {
//         startPlayer = 0;
//       }
      
//     }
    
    startPlayer = (startPlayer+k) % gameArr.length;
    
    // console.log(gameArr)
    gameArr.splice(startPlayer, 1);
    elims++;
  }
  
    // console.log(gameArr)
  return gameArr[0]
}

console.log(ballgame(5,2))

console.log(ballgame(2,2))

console.log(ballgame(2,3))

console.log(ballgame(0,3))

console.log(ballgame(5,0))

console.log(ballgame(0,0))

console.log(ballgame(100,10))

console.log(ballgame(1,1))

console.log(ballgame(1,0))

/* 
[2, 4, (5)]
[(2), 4]
[2, (4)]
[(2), 4]
[(4)]

Your previous Plain Text content is preserved below:

This is just a simple shared plaintext pad, with no execution capabilities.

When you know what language you'd like to use for your interview,
simply choose it from the dropdown in the top bar.

You can also change the default language your pads are created with
in your account settings: https://coderpad.io/settings

Enjoy your interview!

A group of n children is standing in a circle, and the first child is holding a ball. The ball is passed clockwise k times, and the child that ends up with the ball leaves the circle and hands the ball to the next child. The children then continue to pass the ball following the same rules until only one child is left.
Simulate the children's game, and write tests to ensure that the code works correctly.
Inputs:
Number of children (n)
Number of ball passes between eliminations (k)
Output: The one-based index of the winning child in the original lineup of n children
Example: playGame(5, 2) -> 4

 */