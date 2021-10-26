import React, { useState, useEffect } from 'react'
import ReactDOM from "react-dom";

import "./index.css";

import Board from './components/board';
const Game = () => {

  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      poses: [],
    },
  ])
  const [current, setCurrent] = useState({
    squares: Array(9).fill(null),
    poses: [],
  })

  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setxIsNext] = useState(true)
  const [tableSize, settableSize] = useState(5)
  const [isRevertMoveList, setIsRevertMoveList] = useState(false)
  const [highLightArray, sethighLightArray] = useState([])
  const [status, setStatus] = useState("")
  const [winner, setWinner] = useState([])

  const handleClick = (i) => {
    const historySlice = history.slice(0, stepNumber + 1);
    setCurrent(history[history.length - 1]);
    const squares = current.squares.slice();
    const poses = current.poses.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";

    poses.push(i);
    
    setHistory(historySlice.concat([
      {
        squares: squares,
        poses: poses,
      }
    ]))
      
    setStepNumber(historySlice.length)
    setxIsNext(!xIsNext)
  }

  const increaseTablesize = () => {
    newGame();
    settableSize(tableSize+1);    
  }
  const decreaseTablesize = () => {  
    if (tableSize > 5) {
      newGame();
      settableSize(tableSize-1);
    }
  }

  const newGame = () => {  
    setHistory([
      {
        squares: Array(9).fill(null),
        poses: [],
      },
    ])
    setCurrent({
      squares: Array(9).fill(null),
      poses: [],
    })
    setStepNumber(0)
    setxIsNext(true)
    sethighLightArray([])    
    setWinner(null)
  }
  
  const revertMoveList = () => {    
    setIsRevertMoveList(!isRevertMoveList)
  }

  const jumpTo = (step) => {    
    setStepNumber(step)  
    setxIsNext(step % 2 === 0)    
  }

  useEffect(() => {
    
      setCurrent(history[stepNumber]);
      var a = calculateWinner(
        current.squares,
        tableSize,
        current.poses[current.poses.length - 1]
      );
  
      console.log(a);
      setWinner(a);
      
      if (winner) {
        setStatus("Winner: " + (xIsNext ? "O" : "X"));
      } else {
        if (current.poses.length === tableSize * tableSize) {
          setStatus("No one win, DRAW!");
        } else {
          setStatus("Next player: " + (xIsNext ? "X" : "O"));
        }
      }
    
    
  });

  const moves = () => history?.map((step, move) => {
    const i = step.poses[move - 1];
    const x = Math.floor(i / tableSize).toString();
    const y = (i - tableSize * Math.floor(i / tableSize)).toString();
    const desc = move
      ? "Go to move #" + move + " - (" + x + " - " + y + ")"
      : "Go to game start";
    return (
      <li key={move}>
        <button
          className={
            stepNumber === move ? "li-active" : "li-inactive"
          }
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  })

    return (
      <div className="game-board">
        <div className="game-setting">
          <p>Change table size:</p>

          {/*Change tablesize  */}
          <div className="game-button">
            <button
              className="game-button-item"
              onClick={() => decreaseTablesize()}
            >
              -1
            </button>
            <strong className="game-button-item">{tableSize}</strong>
            <button
              className="game-button-item"
              onClick={() => increaseTablesize()}
            >
              +1
            </button>
          </div>
          <div className="game-button">
            <button
              className="game-button-newgame"
              onClick={() => newGame()}
            >
              New game
            </button>
            <button
              className="game-button-newgame"
              onClick={() => revertMoveList()}
            >
              Revert Move List
            </button>
          </div>

          {/*List of moves*/}
          <div className="game-info">
            <div>{status}</div>
            <ol>{isRevertMoveList ? moves().reverse() : moves()}</ol>
          </div>
        </div>

        {/* Game table */}
        <div className="game-board">
          <Board
            squares={current.squares}
            poses={current.squares}
            winner={winner ? winner : []}            
            size={tableSize}
            onClick={(i) => handleClick(i)}
          />
        </div>
      </div>
    );

}


// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));


function calculateWinner(squares, size, current) {
  var currentPlayer = squares[current];

  // ngang trái
  var score = 0;
  var highLight = [];

  for (let i = 0; i < 5 && i <= current % size; i++) {
    if (squares[current - i] === currentPlayer) {
      score += 1;
      highLight.push(current - i);
    } else {
      break;
    }
  }

  // ngang phải
  for (let i = 1; i < 5 && i - 1 < size - (current % size); i++) {
    if (squares[current + i] === currentPlayer) {
      score += 1;
      highLight.push(current + i);
    } else {
      break;
    }
  }

  if (score >= 5) {
    return highLight;
  }

  score = 0;
  
  // dọc trên
  for (let i = 0; current - i * size > 0; i++) {
    if (squares[current - i * size] === currentPlayer) {
      score += 1;
      highLight.push(current - i * size);
    } else {
      break;
    }
  }

  // dọc dưới
  for (let i = 1; current + i * size < size * size; i++) {
    if (squares[current + i * size] === currentPlayer) {
      score += 1;
      highLight.push(current + i * size);
    } else {
      break;
    }
  }

  if (score >= 5) {
    return highLight;
  }

  score = 0;
  highLight = [];
  // chéo trái trên
  for (let i = 0; current - i * (size + 1) > 0; i++) {
    const pos = current - i * (size + 1);
    if (squares[pos] === currentPlayer) {
      score += 1;
      highLight.push(pos);
      if (pos % size === size - 1 || pos % size === 0) {
        break;
      }
    } else {
      break;
    }
  }

  // chéo phải dưới
  for (let i = 1; current + i * (size + 1) < size * size; i++) {
    const pos = current + i * (size + 1);
    if (squares[pos] === currentPlayer) {
      score += 1;
      highLight.push(pos);
      if (pos % size === size - 1 || pos % size === 0) {
        break;
      }
    } else {
      break;
    }
  }
  if (score >= 5) {
    return highLight;
  }

  score = 0;
  highLight = [];
  // chéo phải trên
  for (let i = 0; current - i * (size - 1) > 0; i++) {
    const pos = current - i * (size - 1);
    if (squares[pos] === currentPlayer) {
      score += 1;
      highLight.push(pos);
      if (pos % size === size - 1 || pos % size === 0) {
        break;
      }
    } else {
      break;
    }
  }

  // chéo trái dưới
  for (let i = 1; current + i * (size - 1) < size * size; i++) {
    const pos = current + i * (size - 1);
    if (squares[pos] === currentPlayer) {
      score += 1;
      highLight.push(pos);
      if (pos % size === size - 1 || pos % size === 0) {
        break;
      }
    } else {
      break;
    }
  }
  if (score >= 5) {
    return highLight;
  }

  return null;
};
