import React, { Component } from 'react';
import Bottle from './components/Bottle';
import Virus from './components/Virus';
import Capsule from './components/Capsule';
import './App.css';

class App extends Component {

  state = {
    grids: []
  }

  // 随机开局
  updateGrids = () => {
    let blank;
    var grids = new Array();
    for (var i = 0; i < 16; i++) {
      for (var j = 0; j < 8; j++) {
        if (i > 4) {
          let random = parseInt(Math.random() * 5);
          switch (random) {
            case 0:
              let redVirus = { type: 'virus', color: 'red', x: j, y: i };
              grids.push(redVirus);
              break;
            case 1:
              let blueVirus = { type: 'virus', color: 'blue', x: j, y: i };
              grids.push(blueVirus);
              break;
            case 2:
              let yellowVirus = { type: 'virus', color: 'yellow', x: j, y: i };
              grids.push(yellowVirus);
              break;
            default:
              blank = { type: 'blank', x: j, y: i }
              grids.push(blank);
          }
        } else {
          blank = { type: 'blank', x: j, y: i }
          grids.push(blank);
        }
      }
    }
    grids[3] = { type: 'capsule', color: 'yellow', x: 3, y: 0 ,rotate:'top'};
    grids[11] = { type: 'capsule', color: 'red', x: 3, y: 1 ,rotate:'bottom'};
    this.setState({
      grids: grids
    })
  }

  //画格子
  getGrid = (grid) => {
    switch (grid.type) {
      case 'blank':
        return <Virus key={(grid.x + 1) + (grid.y * 8)} type={grid.type} />;
      case 'virus':
        return <Virus key={(grid.x + 1) + (grid.y * 8)} type={grid.color} />;
      case 'capsule':
        return <Capsule key={(grid.x + 1) + (grid.y * 8)} type={grid.color} rotate={grid.rotate}/>;
    }
  }

  render() {
    const { grids } = this.state;
    return (
      <div>
        <Bottle>
          {grids.map((grid) => (this.getGrid(grid)))}
        </Bottle>
        {/* 更新state的例子， 可删 */}
        <button onClick={this.updateGrids}>开始游戏</button>
      </div>
    );
  }
}

export default App;
