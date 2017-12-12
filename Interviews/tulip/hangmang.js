const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



class Hangman {
	constructor() {
		this.incorrectGuesses = [];
		this.word = this.getRandomWord();
		console.log(this.word);
		this.guess = '';
		this.successes = 0;
		this.lives = 5;
		for (let i=0; i< this.word.length; i++) {
			if (this.word[i] == " ") {
				this.guess += " ";
			} else {
				this.guess += "_";
			}
		}
	}

	getRandomWord() {
		let txt = fs.readFileSync('/usr/share/dict/words');
		txt = txt + '';
		let lines = txt.split("\n");
		// console.log(txt.length);
		let rand = lines[Math.min(Math.floor(Math.random()*lines.length))];

		let rand1 = lines[Math.min(Math.floor(Math.random()*lines.length))];

		let rand2 = lines[Math.min(Math.floor(Math.random()*lines.length))];
		// console.log(rand);
		// console.log(lines[rand]);
		let out = [rand, rand1, rand2].join(" ");
		return out.toUpperCase();
		// return txt.split("\n")[rand].toUpperCase();
	}
	guessLetter(letter) {
		if (this.word.indexOf(letter) > -1) {
			for (let i = 0; i<this.word.length; i++) {
				if (this.word[i] == letter) {
					this.replaceAt(letter);
					return true;
				}
			}
		}
		return false;
	}
	replaceAt(letter) {
		let guessArr = this.guess.split("");
		for (let i=0; i<this.word.length; i++) {
			if (this.guess[i] == "_" && this.word[i] == letter) {
				guessArr[i] = this.word[i];
				this.successes++;
			}
		}
		this.guess = guessArr.join("");
	}
	ask(rl) {
		if (this.lives == 0)  {
			console.log("Sorry you died");
			rl.close();
			return;
		} else if (this.successes == this.word.replace(/\s/gi, "").length) {
			console.log("You win");
			rl.close();
			return;
		}

		rl.question(this.guess, (answer) => {
			answer = answer.toUpperCase();
			if (answer.length > 1) console.log("Cant enter more than 1 letter at a time");
			// if (!isNaN(parseInt(answer))) console.log("Cant enter numbers");
			if (answer.charCodeAt(0)>90 || answer.charCodeAt(0)<65) console.log("Please input letters only");
			if (this.guessLetter(answer)) {
				console.log("Correct guess! ");
				this.ask(rl);
			} else {
				if (this.incorrectGuesses.indexOf(answer) > -1) {
					console.log("You've guessed this char before");
				} else {
					this.incorrectGuesses.push(answer);
				}
				this.lives--;
				console.log("Wrong guess, lives left: ", this.lives);
				this.ask(rl);
			}
		});
	}



}

// function ask(rl) {
// 	if (this.lives == 0)  {
// 		console.log("Sorry you died");
// 		rl.close();
// 		return;
// 	} else if (this.successes == hmi.word.length) {
// 		console.log("You win");
// 		rl.close();
// 		return;
// 	}

// 	rl.question(hmi.guess, (answer) => {
// 		answer = answer.toUpperCase();
// 		if (answer.length > 1) console.log("Cant enter more than 1 letter at a time");
// 		// if (!isNaN(parseInt(answer))) console.log("Cant enter numbers");
// 		if (answer.charCodeAt(0)>90 || answer.charCodeAt(0)<65) console.log("Please input letters only");
// 		if (this.guessLetter(answer)) {
// 			console.log("Correct guess! ");
// 			ask(rl);
// 		} else {
// 			if (this.incorrectGuesses.indexOf(answer) > -1) {
// 				console.log("You've guessed this char before");
// 			} else {
// 				this.incorrectGuesses.push(answer);
// 			}
// 			this.lives--;
// 			console.log("Wrong guess, lives left: ", this.lives);
// 			ask(this, rl);
// 		}
// 	});
// }

let Hangmaninstance = new Hangman();
Hangmaninstance.ask(rl);
// var lives = 5;

// ask(Hangmaninstance, rl);

// rl.question(Hangmaninstance.guess, (answer) => {
//   // TODO: Log the answer in a database
//   if (Hangmaninstance.guess(answer)) {
//   	console.log( )
//   }
//   console.log(`Thank you for your valuable feedback: ${answer}`);

//   rl.close();
// });

// console.log(Hangmaninstance.word);

