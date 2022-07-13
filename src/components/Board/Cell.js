import React from "react";

export default class Cell extends React.Component {
  render() {
    const element = (
        <button className="cell" onClick={this.props.onClick}>{this.props.mark}</button>
    );
    return element;
  }
}
