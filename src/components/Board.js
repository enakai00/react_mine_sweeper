import React from "react";
import Cell from "./Board/Cell";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.size = 8;
    this.level = 0.2;
    this.finished = false;
    this.field = new Array(this.size)
    this.bombs = new Array(this.size)

    for (let y = 0; y < this.size; y++) {
      this.field[y] = new Array(this.size);
      this.bombs[y] = new Array(this.size);
      for (let x = 0; x < this.size; x++) {
        this.field[y][x] = " ";
        this.bombs[y][x] = false;
      }
    }

    let numberOfBombs = Math.floor(this.size * this.size * this.level);
    for (let i = 0; i < numberOfBombs; i++) {
      let x = Math.floor(Math.random() * this.size);
      let y = Math.floor(Math.random() * this.size);
      this.bombs[y][x] = true;
    }

    this.state = {
      field: this.field,
    }

    this.clickCount = 0;
  }

  onClick(x, y) {
    this.clickCount++;
    if (this.clickCount < 2) {
      setTimeout(() => {
        if (this.clickCount > 1) {
          this.openCell(x, y);
        } else {
          this.markCell(x, y);
        }
        this.clickCount = 0;
        this.checkCompletion();
      }, 200);
    }
  }

  checkCompletion() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let mark = this.field[y][x];
        if (mark == " " || mark == "?") {
          return;
        }
        if (mark == "*" && this.bombs[y][x] == false) {
          return;
        }
      }
    }
    this.finished = true;
    this.props.onFinish(true);
  }

  markCell(x, y) {
    switch (this.state.field[y][x]) {
      case " ":
        this.state.field[y][x] = "*";
        this.setState({field: this.state.field});
        break
      case "*":
        this.state.field[y][x] = "?";
        this.setState({field: this.state.field});
        break
      case "?":
        this.state.field[y][x] = " ";
        this.setState({field: this.state.field});
        break
    }
  }

  openCell(x, y) {
    let mark = this.field[y][x];
    if (mark != " " && mark != "*" && mark != "?") {
      return;
    }
    if (this.bombs[y][x]) { // game over
      this.field[y][x] = "X";
      this.setState({field: this.field});
      this.finished = true;
      this.props.onFinish(false);
      return;
    }

    let bombsCount = 0;
    for (let dy = -1; dy < 2; dy++) {
      for (let dx = -1; dx < 2; dx++) {
        if (dx == 0 && dy == 0) {
          continue;
        }
        if (x + dx < 0 || x + dx >= this.size || y + dy < 0 || y + dy >= this.size) {
          continue;
        }
        if (this.bombs[y+dy][x+dx]==true) {
          bombsCount++;
        }
      }
    }
    this.field[y][x] = bombsCount.toString();
    if (bombsCount == 0) {
      for (let dy = -1; dy < 2; dy++) {
        for (let dx = -1; dx < 2; dx++) {
          if (dx == 0 && dy == 0) {
            continue;
          }
          if (x + dx < 0 || x + dx >= this.size || y + dy < 0 || y + dy >= this.size) {
            continue;
          }
          this.openCell(x+dx, y+dy);
        }
      }
    }
    this.setState({field: this.field})
  }

  render() {
    let field_elements = [];
    for (let y = 0; y < this.size; y++) {
      let row_elements = [];
      for (let x = 0; x < this.size; x++) {
        row_elements.push(<Cell key={x}
            onClick={this.finished ? null : () => this.onClick(x, y)}
            mark={this.state.field[y][x]}/>);
      };
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
