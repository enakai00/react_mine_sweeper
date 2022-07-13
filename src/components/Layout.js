import React from "react";
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RangeSlider from 'react-bootstrap-range-slider';

import Board from "./Board";
import "./Layout.css";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.restart = this.restart.bind(this);
    this.undo = this.undo.bind(this);
    this.gameID = new Date().getTime();
    this.state = {
      size: 8,
      level: 1,
      message: "Good Luck...",
      showUndo: "hidden",
    }
  }

  undo() {
    this.setState({
      showUndo: "hidden",
      message: "Good Luck...",
    });
    this.refs.Board.undo();
  }

  restart() {
    this.setState({
      message: "Good Luck...",
      showUndo: "hidden",
    });
    this.gameID = new Date().getTime();
  }

  onFinish(isWin) {
    let message = "";
    if (isWin) {
      message = "Congratulations!";
      this.setState({message: message});
    } else {
      message = "Bomb!!!";
      this.setState({
        message: message,
        showUndo: "visible",
      });
    }
  }

  render() {
    const size = this.state.size;
    const level = this.state.level;
    const levelStrings = {0: "Easy", 1: "Normal", 2: "Hard"}
    const element = (
      <>
        <h1>Mine Sweeper</h1>
        <Board ref='Board' key={this.gameID} onFinish={this.onFinish}
          level={level} size={size}/>
        <h2>{this.state.message}</h2>
        <span className="bth"
          style={{ visibility: this.state.showUndo }}
          onClick={this.undo}>Undo</span>

        <h4>Configuration</h4>
        <div style={{ width: "200px" }}>
        <h5>Board Size: {this.state.size}</h5>
        <RangeSlider min={4} max={16} size="sm" value={this.state.size}
          tooltip="off"
          onChange={e => this.setState({size: Number(e.target.value)})} />
        <h5>Game Level: {levelStrings[this.state.level]}</h5>
        <RangeSlider min={0} max={2} size="sm" value={this.state.level}
          tooltip="off"
          onChange={e => this.setState({level: Number(e.target.value)})} />
        </div>
        <span className="bth"
          onClick={this.restart}>Restart</span>
      </>
    );
    return element;
  }
}
