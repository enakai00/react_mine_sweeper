import React from "react";


const Cell = (props) => {
  const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let element = (
    <button className="cell" onClick={props.onClick}>
    {props.mark}</button>
  );
  if (props.mark === "0") {
    element = (
      <button className="cell cell_open"></button>
    );
  }
  if (nums.includes(props.mark)) {
    element = (
      <button className="cell cell_open">{props.mark}</button>
    );
  }

  return element;
}


export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.size = props.size;
    this.level = props.level;

    this.freeze = false;
    this.lastCell = [0, 0];
    this.depth = 0;
    this.clickCount = 0;
    this.field = new Array(this.size)
    this.bombs = new Array(this.size)

    for (let y = 0; y < this.size; y++) {
      this.field[y] = new Array(this.size);
      this.bombs[y] = new Array(this.size);
      this.field[y].fill(" ");
      this.bombs[y].fill(false);
    }

    const numberOfBombs = Math.floor(
        this.size * this.size * 0.1 * (this.level+1));
    for (let i = 0; i < numberOfBombs; i++) {
      let x = Math.floor(Math.random() * this.size);
      let y = Math.floor(Math.random() * this.size);
      this.bombs[y][x] = true;
    }

    this.sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    this.state = {
      field: this.field,
    }
  }

  undo() {
    let [x, y] = this.lastCell;
    this.field[y][x] = " ";
    this.setState({field: this.field});
    this.freeze = false;
  }

  onClick(x, y) {
    this.clickCount++;
    if (this.clickCount < 2) {
      setTimeout(() => {
        if (this.clickCount > 1) {
          this.openCell(x, y);
        } else {
          this.markCell(x, y);
          this.checkCompletion();
        }
        this.clickCount = 0;
      }, 240);
    }
  }

  checkCompletion() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let mark = this.field[y][x];
        if (mark === " " || mark === "?") {
          return;
        }
        if (mark === "*" && this.bombs[y][x] === false) {
          return;
        }
      }
    }
    this.freeze = true;
    this.props.onFinish(true);
  }

  markCell(x, y) {
    switch (this.field[y][x]) {
      case " ":
        this.field[y][x] = "*";
        this.setState({field: this.field});
        break
      case "*":
        this.field[y][x] = "?";
        this.setState({field: this.field});
        break
      case "?":
        this.field[y][x] = " ";
        this.setState({field: this.field});
        break
      default:
    }
  }

  openCell(x, y) {
    const finalize = () => {
      this.freeze = false;
      this.setState({}); // Reflect this.freeze to the component
      this.sleep(10).then(() => this.checkCompletion());
    };

    if (this.depth === 0) {
      this.depth = 1;
    }
    this.freeze = true;
    let mark = this.field[y][x];
    if (mark !== " " && mark !== "*" && mark !== "?") {
      this.depth--;
      if (this.depth === 0) {
        finalize();
      }
      return;
    }

    this.lastCell = [x, y];
    if (this.bombs[y][x]) { // game over
      this.field[y][x] = "X";
      this.setState({field: this.field});
      this.freeze = true;
      this.props.onFinish(false);
      return;
    }

    let bombsCount = 0;
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dx === 0 && dy === 0) {
          continue;
        }
        if (x + dx < 0 || x + dx >= this.size || y + dy < 0 || y + dy >= this.size) {
          continue;
        }
        if (this.bombs[y+dy][x+dx]===true) {
          bombsCount++;
        }
      }
    }
    this.field[y][x] = bombsCount.toString();
    if (bombsCount === 0) {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }
          if (x + dx < 0 || x + dx >= this.size || y + dy < 0 || y + dy >= this.size) {
            continue;
          }
          this.depth++;
          this.sleep(10).then(() => this.openCell(x+dx, y+dy));
        }
      }
    }

    this.setState({field: this.field});
    this.depth--;
    if (this.depth === 0) {
      finalize();
    }
  }

  render() {
    const field_elements = [];
    for (let y = 0; y < this.size; y++) {
      const row_elements = [];
      for (let x = 0; x < this.size; x++) {
        row_elements.push(<Cell key={x}
          onClick={this.freeze ? null : () => this.onClick(x, y)}
          mark={this.state.field[y][x]}/>);
      }
      field_elements.push(<div key={y} className="board-row">{row_elements}</div>);
    };
    const field = (
      <>
        {field_elements}
      </>
    );
    return field;
  }
}
