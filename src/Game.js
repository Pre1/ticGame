import React, { Component } from "react";
import Board from "./Board";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for (let line of lines) {
		const [a, b, c] = line;

		console.log("calculateWinner => line", line);
		console.log("calculateWinner => a: ?", squares[a]);
		console.log("calculateWinner => b: ?", squares[b]);
		console.log("calculateWinner => a === b ?", squares[a] === squares[b]);
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			console.log("calculateWinner => a: ?", squares[a]);
			console.log("calculateWinner => b: ?", squares[b]);
			console.log("calculateWinner => a === b ?", squares[a] === squares[b]);
			return squares[a];
		}
	}

	return null;
}

export default class Game extends React.Component {
	state = {
		history: [
			{
				squares: Array(9).fill(null)
			}
		],

		xIsNext: true,
		won: false,
		stepNumber: 0
	};

	handleClick = i => {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		if (this.state.won || squares[i]) return;

		const nextFlag = this.state.xIsNext;
		let x = <FontAwesomeIcon key='x' size="2x" icon={faCoffee} />;
		let o = <FontAwesomeIcon key="o" size="2x" icon={faCookieBite} />;
		squares[i] = nextFlag ? x : o;

		this.setState({
			history: history.concat([
				{
					squares: squares
				}
			]),

			xIsNext: !nextFlag,
			stepNumber: history.length
		});
	};

	jumpTo = step => {
		const history = this.state.history;
		const current = history[step];
		const winner = calculateWinner(current.squares);

		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
			won: winner ? true : false
		});
	};

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];

		const status = () => {
			const winner = calculateWinner(current.squares);
			if (winner) {
				// to prevent infentnt loop, setState will trigger
				// re-rendering becuase of the won flag
				if (!this.state.won) this.setState({ won: true });
				return "Winner: " + winner;
			} else {
				return `Next player: ${this.state.xIsNext ? "☕️" : "🍩"}`;
			}
		};

		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";

			return (
				<li key={move}>
					<button
						className="btn btn-success my-1"
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			);
		});

		return (
			<div className="container">
				<div className="game text-center">
					<div className="game-board">
						<Board
							squares={current.squares}
							onClick={i => this.handleClick(i)}
						/>
					</div>

					<div className="game-info">
						<div>{status()}</div>
						<ol>{moves}</ol>
					</div>
				</div>
			</div>
		);
	}
}
