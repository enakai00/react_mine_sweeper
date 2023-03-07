import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react';


export const Config = (props) => {
  const [boardSize, setBoardSize] = useState(8);
  const [level, setLevel] = useState(1);

  const levelStrings = {0: "Easy", 1: "Normal", 2: "Hard"};
  let element = (
      <>
        <Box mb="2" pt="2" fontSize="xl" w="full">Configuration</Box>
        <Box>Board Size: {boardSize}</Box>
        <Box p="2" pr="10" width="xs">
          <Slider defaultValue={8} min={4} max={16} value={boardSize}
            onChange={(val) => {
              setBoardSize(Number(val));
              props.setConfig.size.current = Number(val);
            }}>
            <SliderTrack bg='blue.100'>
              <SliderFilledTrack bg='blue.400' />
            </SliderTrack>
            <SliderThumb /><SliderMark />
          </Slider>
        </Box>
        <Box>Game Level: {levelStrings[level]}</Box>
        <Box p="2" pr="40" width="xs">
          <Slider defaultValue={1} min={0} max={2} value={level}
            onChange={(val) => {
              setLevel(Number(val));
              props.setConfig.level.current = Number(val);
            }}>
            <SliderTrack bg='blue.100'>
              <SliderFilledTrack bg='blue.400' />
            </SliderTrack>
            <SliderThumb /><SliderMark />
          </Slider>
        </Box>
      </>
  );

  return element;
}
