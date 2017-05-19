import React, { Component } from 'react';
import Bottle from './components/Bottle';
import Virus from './components/Virus';
import './App.css';

class App extends Component {
  render() {
    return (
      <Bottle>
        <Virus />
      </Bottle>
    );
  }
}

export default App;
