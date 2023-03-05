import React, { useState, useRef, useEffect } from "react";
import "./Board.css";


const Cell = (props) => {
  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var element;

  if (props.mark === "0") {
    element = (
      <button className="cell cell_open" />
    );
  } else if (nums.includes(props.mark)) {
    element = (
      <button className="cell cell_open">{props.mark}</button>
    );
  } else {
    element = (
      <button className="cell" onClick={props.onClick}>
      {props.mark}</button>
    );
  }

  return element;
};


class BoardInfo {
  constructor(props) {
    this.size = props.size;
    this.level = props.level;

    this.freeze = false;
    this.lastCell = [0, 0];
    this.depth = 0;
    this.clickCount = 0;
    this.bombs = new Array(this.size)
    this.field = new Array(this.size)

    for (let y = 0; y < this.size; y++) {
      this.bombs[y] = new Array(this.size);
      this.bombs[y].fill(false);
      this.field[y] = new Array(this.size);
      this.field[y].fill(" ");
    }
    const numberOfBombs = Math.floor(
        this.size * this.size * 0.1 * (this.level+1));
    for (let i = 0; i < numberOfBombs; i++) {
      let x = Math.floor(Math.random() * this.size);
      let y = Math.floor(Math.random() * this.size);
      this.bombs[y][x] = true;
    }
  }
}


export const Board = (props) => {
  const boardInfo = useRef(new BoardInfo(props));
  const size = boardInfo.current.size;
  const field = boardInfo.current.field;
  // Since `field` stores an array object, updating it doesn't rerender the component.
  // Instead, dummyState is used to rerender the compoent.
  // eslint-disable-next-line
  const [dummyState, setDummyState] = useState([]);

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  };

  const undo = () => {
      let [x, y] = boardInfo.current.lastCell;
      boardInfo.current.freeze = false;
      field[y][x] = " ";
      setDummyState([]);
  };
  useEffect(undo, [props.undo]); // eslint-disable-line react-hooks/exhaustive-deps

  const onClick = (x, y) => {
    const singleClick = () => {
      markCell(x, y);
      checkCompletion();
    };
    const doubleClick = () => {
      openCell(x, y);
    };

    boardInfo.current.clickCount++;
    if (boardInfo.current.clickCount < 2) {
      setTimeout(() => {
        if (boardInfo.current.clickCount >= 2) {
          doubleClick();
        } else {
          singleClick();
        }
        boardInfo.current.clickCount = 0;
      }, 240);
    }
  };

  const checkCompletion = () => {
    for (let y = 0; y < boardInfo.current.size; y++) {
      for (let x = 0; x < boardInfo.current.size; x++) {
        let mark = field[y][x];
        if (mark === " " || mark === "?") {
          return;
        }
        if (mark === "*" && boardInfo.current.bombs[y][x] === false) {
          return;
        }
      }
    }
    boardInfo.current.freeze = true;
    props.onFinish(true);
  };

  const markCell = (x, y) => {
    switch (field[y][x]) {
      case " ":
        field[y][x] = "*";
        break
      case "*":
        field[y][x] = "?";
        break
      case "?":
        field[y][x] = " ";
        break
      default:
    }
    setDummyState([]);
  };

  const openCell = (x, y) => {
    const finalize = () => {
      // Update states and check completion.
      boardInfo.current.freeze = false;
      setDummyState([]);
      checkCompletion();
    };

    if (boardInfo.current.depth === 0) {
      boardInfo.current.depth = 1;
    }
    boardInfo.current.freeze = true;
    let mark = field[y][x];
    if (mark !== " " && mark !== "*" && mark !== "?") {
      boardInfo.current.depth--;
      if (boardInfo.current.depth === 0) {
        finalize();
      }
      return;
    }

    boardInfo.current.lastCell = [x, y];
    if (boardInfo.current.bombs[y][x]) { // game over
      field[y][x] = "X";
      boardInfo.current.freeze = true;
      setDummyState([]);
      props.onFinish(false);
      return;
    }

    const size = boardInfo.current.size;
    let bombsCount = 0;
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        if (x+dx < 0 || x+dx >= size || y+dy < 0 || y+dy >= size) {
          continue;
        }
        if (boardInfo.current.bombs[y+dy][x+dx] === true) {
          bombsCount++;
        }
      }
    }
    field[y][x] = bombsCount.toString();
    if (bombsCount === 0) {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          if (x+dx < 0 || x+dx >= size || y+dy < 0 || y+dy >= size) {
            continue;
          }
          boardInfo.current.depth++;
          sleep(10).then(() => openCell(x+dx, y+dy));
        }
      }
    }

    setDummyState([]);
    boardInfo.current.depth--;
    if (boardInfo.current.depth === 0) {
      finalize();
    }
  };

  const field_elements = [];
  for (let y = 0; y < size; y++) {
    const row_elements = [];
    for (let x = 0; x < size; x++) {
      row_elements.push(<Cell key={x}
        onClick={boardInfo.current.freeze ? null : () => onClick(x, y)}
        mark={field[y][x]}/>);
    }
    field_elements.push(<div key={y} className="board-row">{row_elements}</div>);
  };
  const element = (
    <>
      {field_elements}
    </>
  );

  return element;
}
