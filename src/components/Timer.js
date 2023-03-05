import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";

const useTimer = (status) => {
  const [count, setCount] = useState(0);
  const [timerID, setTimerID] = useState(null);

  const startTimer = () => {
    if (timerID) {
      clearInterval(timerID);
    }
    const newTimerID = setInterval(
      () => {setCount((preCount) => {return preCount+1})}, 1000);
    setTimerID(newTimerID);
  };

  const stopTimer = () => {
    if (timerID) {
      clearInterval(timerID);
      setTimerID(null);
    }
  };

  const handleTimerChange = () => {
    switch (status) {
      case "start":
        startTimer();
        break;
      case "stop":
        stopTimer();
        break;
      default: // reset
        setCount(0);
        stopTimer();
        //startTimer();
    };
  };

  useEffect(handleTimerChange, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  return count;
}


export const Timer = (props) => {
  const count = useTimer(props.status);
  const text = props.text.replace("[]", count);
  const element = (
    <Box m="1">{text}</Box>
  );
  return element;
}
