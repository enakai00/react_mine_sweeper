import React from "react";
import { Container, Heading, Box, Button } from "@chakra-ui/react";

import Board from "./Board";
import Config from "./Config";
import "./Layout.css";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.restart = this.restart.bind(this);
    this.undo = this.undo.bind(this);
    this.gameID = new Date().getTime();
    this.timerID = null;
    this.state = {
      size: 8,
      level: 1,
      message: "Good Luck...",
      showUndo: "hidden",
      timer: 0,
    }
  }

  undo() {
    this.setState({
      showUndo: "hidden",
      message: "Good Luck...",
    });
    this.startTimer();
    this.refs.Board.undo();
  }

  restart() {
    this.setState({
      message: "Good Luck...",
      showUndo: "hidden",
      size: this.refs.Config.getBoardSize(),
      level: this.refs.Config.getLevel(),
      timer: 0,
    });
    if (this.timerID) {
      clearInterval(this.timerID);
    }
    this.timerID = null;
    this.gameID = new Date().getTime();
  }

  onFinish(isWin) {
    let message = "";
    clearInterval(this.timerID);
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

  startTimer() {
    this.timerID = setInterval(() => {
      this.setState(state => {return {timer: state.timer+1}})}, 1000);
  }

  render() {
    const size = this.state.size;
    const level = this.state.level;
    if (!this.timerID) {
      this.startTimer();
    }

    const element = (
      <Container p="8" minWidth="2xl" maxWidth="2xl">
        <Heading m="2" as="h1" fontSize="3xl" w="full">MineSweeper</Heading>

        <Board ref='Board' key={this.gameID} onFinish={this.onFinish}
          level={level} size={size}/>

        <Box m="1" fontSize="md">Elapsed Time: {this.state.timer}sec</Box>
        <Box m="1" fontSize="2xl">{this.state.message}</Box>

        <Button colorScheme="red" size="sm"
          style={{ visibility: this.state.showUndo }}
          onClick={this.undo}>Undo</Button>

        <Config ref="Config" />

        <Button colorScheme="blue" size="sm"
          onClick={this.restart}>Restart</Button>
      </Container>
    );
    return element;
  }
}
