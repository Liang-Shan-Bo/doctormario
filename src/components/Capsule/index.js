import React, { Component } from 'react';
import './style.css';

class Capsule extends Component {

  render() {
    const { type, rotate } = this.props;
    return (
      <div className={`capsule-${type} ${rotate}`}></div>
    );
  }
}

export default Capsule;
