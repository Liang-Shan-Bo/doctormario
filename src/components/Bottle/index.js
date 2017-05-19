import React, { Component } from 'react';
import './style.css';

class Bottle extends Component {
  render() {
    return (
      <div>
        <div className="bottle-top" />
        <div className="bottle">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Bottle;
