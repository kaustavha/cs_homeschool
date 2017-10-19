const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

class ticTacToe {
	constructor() {
		this.board = [];
		this.positions = [];
		for (var i=0;i<3;i++) {
			for (var j=0;j<3;j++) {
				this.board[i] = [];
				this.board[i][j] = " ";
			}
		}
	}

	printBoard() {
		let temp = "";
		for (var i=0;i<3;i++) {
			for (var j=0;j<3;j++) {
				temp += "|" + this.board[i][j];
			}
			console.log(temp);
			temp = [];
		}
	}

	playTurn(player) {
		rl.question("Make a move "+player, (answer)=>{
			console.log(answer);
			let play = answer.split(" ");
			this.board[play[0], play[1]] = player;
			this.printBoard();
		});

	}

}

let g = new ticTacToe();
g.playTurn("X");