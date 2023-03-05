import React, { useState, useRef } from "react";
import { Container, Stack, Heading, Box, Button } from "@chakra-ui/react";

import { Board } from "./Board";
import { Timer } from "./Timer";
import { Config } from "./Config";


export const Layout = (props) => {
  const defaultSize = 8;
  const defaultLevel = 1;
  const [gameID, setGameID] = useState(new Date().getTime());
  const [size, setSize] = useState(defaultSize);
  const [level, setLevel] = useState(defaultLevel);
  const [configSize, setConfigSize] = useState(defaultSize);
  const [configLevel, setConfigLevel] = useState(defaultLevel);
  const [message, setMessage] = useState("Good Luck...");
  const [showUndo, setShowUndo] = useState("hidden");
  const [timerStatus, setTimerStatus] = useState("start");

  const undoRef = useRef([]);
  const undo = () => {
    setShowUndo("hidden");
    setMessage("Good Luck...");
    setTimerStatus("start");
    undoRef.current = []; // Execute `undo()` of the Board component.
  };

  const restart = () => {
    const doResetStatus = new Promise(resolve => {
      const boardSize = configSize;
      const level = configLevel;
      setMessage("Good Luck...");
      setShowUndo("hidden");
      setSize(boardSize);
      setLevel(level);
      setTimerStatus("reset");
      resolve();
    });
    // Need to wait for the timer to be reset asynchronously.
    doResetStatus.then(() => {
      setGameID(new Date().getTime());
      setTimerStatus("start");
    });
  };

  const onFinish = (isWin) => {
    let message = "";
    setTimerStatus("stop");
    if (isWin) {
      message = "Congratulations!";
      setMessage(message);
    } else {
      message = "Bomb!!!";
      setMessage(message);
      setShowUndo("visible");
    }
  };

  const setConfig = {
    size: setConfigSize,
    level: setConfigLevel,
  };

  const element = (
      <Container p="8" minWidth="2xl" maxWidth="2xl">
        <Stack spacing="1">
          <Heading m="2" as="h1" fontSize="3xl" w="full">MineSweeper</Heading>
        </Stack>
        <Stack spacing="0">
	  {/* undoRef.current is used to execute `undo()` of the Board component. */}
          <Board key={gameID} onFinish={onFinish}
	         level={level} size={size} undo={undoRef.current}/>
        </Stack>
        <Stack spacing="1">
          <Timer status={timerStatus} text="Elapsed Time: []sec" />
          <Box m="1" fontSize="2xl">{message}</Box>
          <Box><Button colorScheme="red" size="sm"
            style={{ visibility: showUndo }}
            onClick={undo}>Undo</Button></Box>
          <Config setConfig={setConfig} />
          <Box><Button colorScheme="blue" size="sm"
            onClick={restart}>Restart</Button></Box>
        </Stack>
      </Container>
  );

  return element;
}
