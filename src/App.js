import React, { Component } from 'react';
import Virus from './virus';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <div className="bottle-top">
        </div>
        <div className="bottle">
          <Virus />
        </div>
      </div>
    );
  }
}

export default App;