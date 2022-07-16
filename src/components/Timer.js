import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";

export default function Timer(props) {
  const [count, setCount] = useState(0);
  const [timerID, setTimerID] = useState(null);

  const handleTimerChange = () => {
    const startTimer = () => {
      if (!timerID) {
        const newTimerID = setInterval(
          () => {setCount((preCount) => {return preCount+1})}, 1000);
        setTimerID(newTimerID);
      }
    };

    const stopTimer = () => {
      if (timerID) {
        clearInterval(timerID);
        setTimerID(null);
      }
    };

    switch (props.status) {
      case "start":
        startTimer();
        break;
      case "stop":
        stopTimer();
        break;
      case "reset":
        stopTimer();
        setCount(0);
        startTimer();
        break;
      default:
        break;
    };
  };

  useEffect(handleTimerChange, [props.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const text = props.text.replace("[]", count);
  const element = (
    <Box m="1">{text}</Box>
  );
  return element;
}
