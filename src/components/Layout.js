import React from "react";
import Board from "./Board";
import "./Layout.css";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.restart = this.restart.bind(this);
    this.gameID = new Date().getTime();
    this.state = {
      message: "Good Luck...",
      showRetry: "hidden",
    }
  }

  restart() {
    this.setState({
      message: "Good Luck...",
      showRetry: "hidden",
    });
    this.gameID = new Date().getTime();
  }

  onFinish(isWin) {
    let message = "";
    if (isWin) {
      message = "Congratulations!";
    } else {
      message = "Bomb!!!";
    }
    this.setState({
      message: message,
      showRetry: "visible",
    });
  }

  render() {
    const element = (
      <>
        <h1>Mine Sweeper</h1>
        <Board key={this.gameID} onFinish={this.onFinish} />
        <h2>{this.state.message}</h2>
        <span className="bth"
          style={{ visibility: this.state.showRetry }}
          onClick={this.restart}>Retry</span>
      </>
    );
    return element;
  }
}
