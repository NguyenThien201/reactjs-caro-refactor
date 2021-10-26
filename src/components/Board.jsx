import React from "react";
import Square from "./Square";

const Board = ({squares, poses, winner, size, onClick}) => {
    const renderSquare = (i) => {
      return (
        <Square
          value={squares[i]}
          hightLight={
            i === poses[poses.length - 1] ||
            winner.includes(i)
          }
          onClick={() => onClick(i)}
        />
      );
    }
    const renderRow = (rowIndex, items) => {    
      var row = [];
      for (var i = 0; i < items; i++) {
        let cell = renderSquare(rowIndex * items + i);
        row.push(cell);
      }
      return <div className="board-row">{row}</div>;
    }
  
    const renderBoard = (row, col) => {        
        console.log(row)
        console.log(col)
      var board = [];
      for (var i = 0; i < row; i++) {
        let row = renderRow(i, col);
        board.push(row);
      }
      return board;
    }
  
    
    return (
        <>        
        <div>{renderBoard(size, size)}</div>
        </>
    
    );
    
  }
  
  export default Board;