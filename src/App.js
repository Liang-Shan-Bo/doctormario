import React, { Component } from 'react';
import Bottle from './components/Bottle';
import Virus from './components/Virus';
import Capsule from './components/Capsule';
import './App.css';

var grids = new Array();
let top;
let bottom;

class App extends Component {

  state = {
    grids: []
  }

  // 随机开局
  updateGrids = () => {
    grids = [];
    let blank;
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
    // 第一个药丸
    top = { x: 3, y: 0, rotate: 'top' };
    bottom = { x: 3, y: 1, rotate: 'bottom' };
    top = this.makeCapsule(top);
    bottom = this.makeCapsule(bottom);
    // 开始计时器
    this.timer = setInterval(function () {
      this.fall();
    }.bind(this), 1000);
    this.setState({
      grids: grids
    })
  }

  // 生成半个药丸
  makeCapsule = (capsule) => {
    // 判断当前格子是否为空,如果不为空则不能生成药丸
    if (grids[capsule.x + (capsule.y * 8)].type != 'blank') {
      // 停止计时器
      clearInterval(this.timer);
      alert('游戏结束！');
      return;
    }
    // 生成随机颜色的药丸
    let random = parseInt(Math.random() * 3);
    let color;
    switch (random) {
      case 0:
        color = 'red';
        break;
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'yellow';
        break;
    }
    capsule = { type: 'capsule', color: color, x: capsule.x, y: capsule.y, rotate: capsule.rotate };
    grids[capsule.x + (capsule.y * 8)] = capsule;
    return capsule;
  }

  // 画格子
  paintGrid = (grid) => {
    switch (grid.type) {
      case 'blank':
        return <Virus key={(grid.x + 1) + (grid.y * 8)} type={grid.type} />;
      case 'virus':
        return <Virus key={(grid.x + 1) + (grid.y * 8)} type={grid.color} />;
      case 'capsule':
        return <Capsule key={(grid.x + 1) + (grid.y * 8)} type={grid.color} rotate={grid.rotate} />;
    }
  }

  // 消除格子
  clearGrid = (x, y) => {
    grids[x + (y * 8)] = { type: 'blank', x: x, y: y };
  }

  // 下落
  fall = () => {
    // 如果下面的格子为空，则下降一格
    if (grids[bottom.x + (bottom.y + 1) * 8].type == 'blank') {
      grids[bottom.x + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y + 1, rotate: bottom.rotate };
      grids[top.x + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y + 1, rotate: top.rotate };
      this.clearGrid(top.x, top.y);
      bottom.y++;
      top.y++;
    } else {
      top = { x: 3, y: 0, rotate: 'top' };
      bottom = { x: 3, y: 1, rotate: 'bottom' };
      top = this.makeCapsule(top);
      bottom = this.makeCapsule(bottom);
    }
    this.setState({
      grids: grids
    })
  }
  render() {
    const { grids } = this.state;
    return (
      <div>
        <Bottle>
          {grids.map((grid) => (this.paintGrid(grid)))}
        </Bottle>
        <button onClick={this.updateGrids}>开始游戏</button>
      </div>
    );
  }
}

export default App;
