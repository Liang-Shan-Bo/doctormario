import React, { Component } from 'react';
import Bottle from './components/Bottle';
import Virus from './components/Virus';
import './App.css';

class App extends Component {
  state = {
    //此处就是例子,应该设计成二维数组
    virus: [
      {type: 'blue'},
      {type: 'blue'},
      {type: 'red'},
    ]
  }

  // 更新state的例子， 可删
  updateVirus = () => {
    this.setState({
      virus: [{type: 'red'}, {type: 'blue'}]
    })
  }

  render() {
    const {virus} = this.state
    return (
      <div>
        <Bottle>
          {virus.map(({type}) => (<Virus type={type} />))}
        </Bottle>
        {/* 更新state的例子， 可删 */}
        <button onClick={this.updateVirus}>点我！</button>
      </div>
    );
  }
}

export default App;
