import React, { Component } from 'react';
import './style.css';

class Virus extends Component {
  render() {
    const {type = 'blue'} = this.props
    return (
      <div className={`body-${type}`}>
         <div className={`eye-${type}`}></div>
         <div className={`mouth-${type}`}></div>
      </div>
    );
  }
}

export default Virus;
