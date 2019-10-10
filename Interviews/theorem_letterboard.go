/**
Theorem interview

example word:  "cat"
board:  [ 'a', 'z', 'c', 't', 'v', 'a' ]

best order (move and the state of the board after the move):

[ 'a', 'z', 'c', 't', 'v', 'a' ]
LEFT       => [ 'z', 'c', 't', 'v', 'a', 'a' ]
LEFT       => [ 'c', 't', 'v', 'a', 'a', 'z' ]
LEFT  "c"  => [ 't', 'v', 'a', 'a', 'z' ]
RIGHT      => [ 'z', 't', 'v', 'a', 'a' ]
RIGHT "a"  => [ 'z', 't', 'v', 'a' ]
LEFT       => [ 't', 'v', 'a', 'z' ]
LEFT  "t"  => [ 'v', 'a', 'z' ]

Result:

LEFT:nil, LEFT:nil, LEFT:c, RIGHT:nil, RIGHT:a, LEFT:nil, LEFT:t

f(board, word) => moves

2nd example word: "tv"
2nd board:  [ 'a', 'z', 'c', 't', 'v', 'a' ]

Result:
RIGHT:nil, RIGHT:nil, RIGHT:t, LEFT:v
**/

/**
- valid letters = word[0]
- find side w/ closest valid letter
- pop off till we get to letter, adding to other side
-
**/

package main

import "fmt"
import "strconv"

type LetterBoard struct {
	outputBoard []rune
	searchArray []rune
	result      []Move
}

type Move struct {
	direction string
	character string
}

func (lb *LetterBoard) _search(searchIter int) {
	if searchIter == len(lb.searchArray) {
		return
	}
	char := lb.searchArray[searchIter]
	leftIndex := 0
	rightIndex := len(lb.outputBoard) - 1
	for leftIndex < len(lb.outputBoard) {
		if lb.outputBoard[leftIndex] == char {
			break
		}
		leftIndex++
	}
	for rightIndex >= 0 {
		if lb.outputBoard[rightIndex] == char {
			break
		}
		rightIndex--
	}

	if len(lb.outputBoard)-rightIndex <= leftIndex {
		lb.goFromRight(char, searchIter)
	} else {
		lb.goFromLeft(char, searchIter)
	}
	return
}

func (lb *LetterBoard) goFromLeft(char rune, searchIter int) {
	defer lb._search(searchIter + 1)
	var newRight []rune
	for i := 0; i < len(lb.outputBoard); i++ {
		if lb.outputBoard[i] != char {
			newRight = append(newRight, lb.outputBoard[i])
			lb.result = append(lb.result, Move{"LEFT", "nil"})
		} else {
			lb.result = append(lb.result, Move{"LEFT", strconv.QuoteRune(char)})
			lb.outputBoard = append(lb.outputBoard[i+1:], newRight...)
			return
		}
	}
}

func (lb *LetterBoard) goFromRight(char rune, searchIter int) {
	defer lb._search(searchIter + 1)
	var newLeft []rune
	for i := len(lb.outputBoard) - 1; i >= 0; i-- {
		if lb.outputBoard[i] != char {
			newLeft = append([]rune{lb.outputBoard[i]}, newLeft...)
			lb.result = append(lb.result, Move{"RIGHT", "nil"})
		} else {
			lb.result = append(lb.result, Move{"RIGHT", strconv.QuoteRune(char)})
			lb.outputBoard = append(newLeft, lb.outputBoard[:i-1]...)
			return
		}
	}
}

func (lb *LetterBoard) printAnswer() {
	fmt.Println(lb.result)
}

func (lb *LetterBoard) solve() {
	lb._search(0)
}

func NewLetterBoard(word string, board []rune) *LetterBoard {
	lb := LetterBoard{board, []rune(word), nil}
	lb.solve()
	return &lb
}

func main() {
	lb := NewLetterBoard(
		"cat",
		[]rune{'a', 'z', 'c', 't', 'v', 'a'},
	)
	lb.printAnswer()

	lb = NewLetterBoard(
		"tv",
		[]rune{'a', 'z', 'c', 't', 'v', 'a'},
	)
	lb.printAnswer()
}
