import React, { useState, useRef, useEffect } from "react";
import Spritesheet from "react-responsive-spritesheet";
import sprites from "../assets/sprites.png";
import "./Board.css";


const Cell = (props) => {
  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const mark_pos = {" ": 3, "?": 7, "*": 5};
  var element;

  if (nums.includes(props.mark)) {
    element = (
      <Spritesheet image={sprites} className="cell"
	    widthFrame={32} heightFrame={32}
            startAt={12+Number(props.mark)} endAt={12+Number(props.mark)} />
    );
  } else if (Object.keys(mark_pos).includes(props.mark)) {
    element = (
      <Spritesheet image={sprites} className="cell" onClick={props.onClick}
	    widthFrame={32} heightFrame={32}
            startAt={mark_pos[props.mark]} endAt={mark_pos[props.mark]} />
    );
  } else if (props.mark === "X") {
    element = (
      <Spritesheet image={sprites} className="cell"
	    widthFrame={32} heightFrame={32}
            startAt={9} endAt={9} />
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
  const info = boardInfo.current;
  // Since `field` stores an array object, updating it doesn't rerender the component.
  // Instead, dummyState is used to rerender the compoent.
  // eslint-disable-next-line
  const [dummyState, setDummyState] = useState([]);

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  };

  const undo = () => {
      let [x, y] = info.lastCell;
      info.freeze = false;
      info.field[y][x] = " ";
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

    info.clickCount++;
    if (info.clickCount < 2) {
      setTimeout(() => {
        if (info.clickCount >= 2) {
          doubleClick();
        } else {
          singleClick();
        }
        info.clickCount = 0;
      }, 240);
    }
  };

  const checkCompletion = () => {
    for (let y = 0; y < info.size; y++) {
      for (let x = 0; x < info.size; x++) {
        let mark = info.field[y][x];
        if (mark === " " || mark === "?") {
          return;
        }
        if (mark === "*" && info.bombs[y][x] === false) {
          return;
        }
      }
    }
    info.freeze = true;
    props.onFinish(true);
  };

  const markCell = (x, y) => {
    switch (info.field[y][x]) {
      case " ":
        info.field[y][x] = "*";
        break
      case "*":
        info.field[y][x] = "?";
        break
      case "?":
        info.field[y][x] = " ";
        break
      default:
    }
    setDummyState([]);
  };

  const openCell = (x, y) => {
    const finalize = () => {
      // Update states and check completion.
      info.freeze = false;
      setDummyState([]);
      checkCompletion();
    };

    if (info.depth === 0) {
      info.depth = 1;
    }
    info.freeze = true;
    let mark = info.field[y][x];
    if (mark !== " " && mark !== "*" && mark !== "?") {
      info.depth--;
      if (info.depth === 0) {
        finalize();
      }
      return;
    }

    info.lastCell = [x, y];
    if (info.bombs[y][x]) { // game over
      info.field[y][x] = "X";
      info.freeze = true;
      setDummyState([]);
      props.onFinish(false);
      return;
    }

    let bombsCount = 0;
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        if (x+dx < 0 || x+dx >= info.size || y+dy < 0 || y+dy >= info.size) {
          continue;
        }
        if (info.bombs[y+dy][x+dx] === true) {
          bombsCount++;
        }
      }
    }
    info.field[y][x] = bombsCount.toString();
    if (bombsCount === 0) {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          if (x+dx < 0 || x+dx >= info.size || y+dy < 0 || y+dy >= info.size) {
            continue;
          }
          info.depth++;
          sleep(10).then(() => openCell(x+dx, y+dy));
        }
      }
    }

    setDummyState([]);
    info.depth--;
    if (info.depth === 0) {
      finalize();
    }
  };

  const field_elements = [];
  for (let y = 0; y < info.size; y++) {
    const row_elements = [];
    for (let x = 0; x < info.size; x++) {
      // Add the cell value to the unique key so that modified cell will be rerendered.
      row_elements.push(<Cell key={x.toString()+info.field[y][x]}
        onClick={info.freeze ? null : () => onClick(x, y)}
        mark={info.field[y][x]}/>);
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
