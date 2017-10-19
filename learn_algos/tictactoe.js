const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class tictactoe {
	constructor() {
		this.board = [];
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (!this.board[x]) this.board[x] = [];
				this.board[x][y] = "-";
			}
		}
	}

	print() {
		let temp = "";
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				temp += this.board[x][y];
				if (y < 2) temp += "|";
			}
			console.log(temp);
			temp = "";
		}
		console.log("--------------------");
	}
	isValidMove(x,y) {
		if (x>2 || y > 2 || x < 0 || y < 0) return false;
		if (!this.isOpen(x,y)) return false;
		return true;
	}

	isOpen(x,y) {
		if (this.board[x][y] !== "-") return false;
		return true;
	}

	add(x,y,player) {
		if (!this.isValidMove(x,y)) return console.log("invalid move");
		this.board[x][y] = player;
	}

	isFull() {
		let isfull = true;
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (this.board[x][y] == "-") isfull = false;
			}
		}
		return isfull;
	}

	aiPlay() {
		let played = false;
		if (this.isFull()) throw "Board is full";
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				if (this.isOpen(x,y)) {
					this.add(x,y,"O");
					played = true;
					break;
				}
			}
			if (played) break;
		}
	}

	isInputValid(args) {
		if (args.length !== 2) return false;
	}

	play() {
		rl.question("Pick move, y, x: ", (answer) => {
			let args = answer.split(" ");
			let x,y;
			if (this.isInputValid(args)) {
				x = args[0],y=args[1];
			} else {
				console.log("invalid move, try again");
				this.play();
				return;
			}


			if (!this.isValidMove(x,y)) {
				console.log("invalid move, try again");
				this.play();
				return;
			} else {
				this.add(x,y,"X");
				this.print();
				this.aiPlay();
				this.print();
				return this.play();
			}
		});
	}
}

// y, x, player
let t = new tictactoe();
t.play();
// t.add(0,0,"X");
// t.add(1,2,"X");
// t.add(0,1,"X");
// t.aiPlay();
// t.aiPlay();t.print();
