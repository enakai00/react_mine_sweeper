import React from "react";
import { Container, Heading, Box, Button } from "@chakra-ui/react";

import Board from "./Board";
import Timer from "./Timer";
import Config from "./Config";
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
      timerStatus: "start",
    }
    this.BoardRef = React.createRef();
    this.ConfigRef = React.createRef();
  }

  undo() {
    this.setState({
      showUndo: "hidden",
      message: "Good Luck...",
    });
    this.setState({timerStatus: "start"});
    this.BoardRef.undo();
  }

  restart() {
    this.setState({
      message: "Good Luck...",
      showUndo: "hidden",
      size: this.ConfigRef.getBoardSize(),
      level: this.ConfigRef.getLevel(),
      timerStatus: "reset",
    });
    this.gameID = new Date().getTime();
  }

  onFinish(isWin) {
    let message = "";
    this.setState({timerStatus: "stop"});
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

    const element = (
      <Container p="8" minWidth="2xl" maxWidth="2xl">
        <Heading m="2" as="h1" fontSize="3xl" w="full">MineSweeper</Heading>

        <Board ref={this.BoardRef} key={this.gameID} onFinish={this.onFinish}
          level={level} size={size}/>

        <Timer status={this.state.timerStatus} text="Elapsed Time: []sec" />

        <Box m="1" fontSize="2xl">{this.state.message}</Box>

        <Button colorScheme="red" size="sm"
          style={{ visibility: this.state.showUndo }}
          onClick={this.undo}>Undo</Button>

        <Config ref={this.ConfigRef} />

        <Button colorScheme="blue" size="sm"
          onClick={this.restart}>Restart</Button>
      </Container>
    );
    return element;
  }
}
