import React from "react";
import { Box } from "@chakra-ui/react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react';


export default class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: 8,
      level: 1,
    }
  }

  getBoardSize() {
    return this.state.boardSize;
  }

  getLevel() {
    return this.state.level;
  }

  render() {
    const levelStrings = {0: "Easy", 1: "Normal", 2: "Hard"}
    let element = (
      <>
        <Box mb="2" mt="4" fontSize="xl" w="full">Configuration</Box>
        <Box>Board Size: {this.state.boardSize}</Box>
        <Box p="2" pr="10" width="xs">
          <Slider defaultValue={8} min={4} max={16} value={this.state.boardSize}
            onChange={(val) => this.setState({boardSize: Number(val)})}>
            <SliderTrack bg='blue.100'>
              <SliderFilledTrack bg='blue.400' />
            </SliderTrack>
            <SliderThumb /><SliderMark />
          </Slider>
        </Box>
        <Box>Game Level: {levelStrings[this.state.level]}</Box>
        <Box p="2" pr="40" width="xs">
          <Slider defaultValue={1} min={0} max={2} value={this.state.level}
            onChange={(val) => this.setState({level: Number(val)})}>
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
}
