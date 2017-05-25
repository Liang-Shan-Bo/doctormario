import React, { Component } from 'react';
import Bottle from './components/Bottle';
import Virus from './components/Virus';
import Capsule from './components/Capsule';
import './App.css';

var grids = new Array();
let top;
let bottom;
let freeFall = false;
let freeFallArray = [];

class App extends Component {

  state = {
    grids: []
  }

  // 随机开局
  updateGrids = () => {
    clearInterval(this.timer);
    freeFall = false;
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

  // 清除格子
  clearGrid = (x, y) => {
    grids[x + (y * 8)] = { type: 'blank', x: x, y: y };
  }

  // 返回指定格子的颜色
  getColor = (x, y) => {
    if (y < 0 || y > 15 || x < 0 || x > 7 || grids[x + (y * 8)].type == "blank") {
      return "black";
    }
    return grids[x + (y * 8)].color;
  }

  // 判断胶囊是否悬空，进行自由落体
  checkFreeFall = (grid) => {
    if (grid.type == 'capsule') {
      if (grid.y < 15 && this.getColor(grid.x, grid.y + 1) == "black") {
        let tmp = { type: 'capsule', color: grid.color, x: grid.x, y: grid.y + 1, rotate: grid.rotate };
        grids[grid.x + (grid.y + 1) * 8] = tmp;
        this.clearGrid(grid.x, grid.y);
        freeFallArray.push(tmp);
      }
    }
  }

  // 消除
  clearCapsule = (array) => {
    let clearArray = [];
    let app = this;
    array.forEach(function (capsule) {
      let color = grids[capsule.x + (capsule.y * 8)].color;
      let arr = [];
      let i = 1;
      let j = 1;
      // 横向消除
      arr.push({ x: capsule.x, y: capsule.y });
      if (app.getColor(capsule.x - 1, capsule.y) == color) {
        i++;
        arr.push({ x: capsule.x - 1, y: capsule.y });
        if (app.getColor(capsule.x - 2, capsule.y) == color) {
          i++;
          arr.push({ x: capsule.x - 2, y: capsule.y });
          if (app.getColor(capsule.x - 3, capsule.y) == color) {
            i++;
            arr.push({ x: capsule.x - 3, y: capsule.y });
          }
        }
      }
      if (app.getColor(capsule.x + 1, capsule.y) == color) {
        i++;
        arr.push({ x: capsule.x + 1, y: capsule.y });
        if (app.getColor(capsule.x + 2, capsule.y) == color) {
          i++;
          arr.push({ x: capsule.x + 2, y: capsule.y });
          if (app.getColor(capsule.x + 3, capsule.y) == color) {
            i++;
            arr.push({ x: capsule.x + 3, y: capsule.y });
          }
        }
      }
      if (i >= 4) {
        arr.map((arr) => (clearArray.push(arr)));
      }
      arr = [];
      // 纵向消除
      arr.push({ x: capsule.x, y: capsule.y });
      if (app.getColor(capsule.x, capsule.y - 1) == color) {
        j++;
        arr.push({ x: capsule.x, y: capsule.y - 1 });
        if (app.getColor(capsule.x, capsule.y - 2) == color) {
          j++;
          arr.push({ x: capsule.x, y: capsule.y - 2 });
          if (app.getColor(capsule.x, capsule.y - 3) == color) {
            j++;
            arr.push({ x: capsule.x, y: capsule.y - 3 });
          }
        }
      }
      if (app.getColor(capsule.x, capsule.y + 1) == color) {
        j++;
        arr.push({ x: capsule.x, y: capsule.y + 1 });
        if (app.getColor(capsule.x, capsule.y + 2) == color) {
          j++;
          arr.push({ x: capsule.x, y: capsule.y + 2 });
          if (app.getColor(capsule.x, capsule.y + 3) == color) {
            j++;
            arr.push({ x: capsule.x, y: capsule.y + 3 });
          }
        }
      }
      if (j >= 4) {
        arr.map((arr) => (clearArray.push(arr)));
      }
      arr = [];
    })
    // 将标记格子全部消除
    if (clearArray.length > 0) {
      clearArray.map((arr) => (this.clearGrid(arr.x, arr.y)));
      freeFall = true;
    }
    if (!freeFall) {
      // 生成新胶囊
      top = { x: 3, y: 0, rotate: 'top' };
      bottom = { x: 3, y: 1, rotate: 'bottom' };
      top = this.makeCapsule(top);
      bottom = this.makeCapsule(bottom);
    }
    this.setState({
      grids: grids
    })
  }

  // 下落
  fall = () => {
    // 如果有悬浮的胶囊，则胶囊下落
    if (freeFall) {
      freeFallArray = [];
      for (var index = 127; index >= 0; index--) {
        this.checkFreeFall(grids[index]);
      }
      if (freeFallArray.length > 0) {
        this.clearCapsule(freeFallArray);
      } else {
        freeFall = false;
        // 生成新胶囊
        top = { x: 3, y: 0, rotate: 'top' };
        bottom = { x: 3, y: 1, rotate: 'bottom' };
        top = this.makeCapsule(top);
        bottom = this.makeCapsule(bottom);
      }
    } else {
      // 如果下面的格子为空，则下降一格
      switch (top.rotate) {
        case "top":
          if (bottom.y < 15 && grids[bottom.x + (bottom.y + 1) * 8].type == 'blank') {
            grids[bottom.x + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y + 1, rotate: bottom.rotate };
            grids[top.x + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y + 1, rotate: top.rotate };
            this.clearGrid(top.x, top.y);
            bottom.y++;
            top.y++;
          } else {
            // 尝试消除
            let arrCapsule = [top, bottom];
            this.clearCapsule(arrCapsule);
          }
          break;
        case "bottom":
          if (top.y < 15 && grids[top.x + (top.y + 1) * 8].type == 'blank') {
            grids[top.x + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y + 1, rotate: top.rotate };
            grids[bottom.x + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y + 1, rotate: bottom.rotate };
            this.clearGrid(bottom.x, bottom.y);
            bottom.y++;
            top.y++;
          } else {
            // 尝试消除
            let arrCapsule = [top, bottom];
            this.clearCapsule(arrCapsule);
          }
          break;
        case "left":
          if (bottom.y < 15 && grids[bottom.x + (bottom.y + 1) * 8].type == 'blank' && grids[top.x + (top.y + 1) * 8].type == 'blank') {
            grids[bottom.x + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y + 1, rotate: bottom.rotate };
            grids[top.x + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y + 1, rotate: top.rotate };
            this.clearGrid(top.x, top.y);
            this.clearGrid(bottom.x, bottom.y);
            bottom.y++;
            top.y++;
          } else {
            // 尝试消除
            let arrCapsule = [top, bottom];
            this.clearCapsule(arrCapsule);
          }
          break;
        case "right":
          if (bottom.y < 15 && grids[bottom.x + (bottom.y + 1) * 8].type == 'blank' && grids[top.x + (top.y + 1) * 8].type == 'blank') {
            grids[bottom.x + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y + 1, rotate: bottom.rotate };
            grids[top.x + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y + 1, rotate: top.rotate };
            this.clearGrid(top.x, top.y);
            this.clearGrid(bottom.x, bottom.y);
            bottom.y++;
            top.y++;
          } else {
            // 尝试消除
            let arrCapsule = [top, bottom];
            this.clearCapsule(arrCapsule);
          }
          break;
      }
    }

    this.setState({
      grids: grids
    })
  }

  // 左移
  left = () => {
    switch (top.rotate) {
      case "top":
        if (top.x > 0 && grids[top.x - 1 + (top.y * 8)].type == "blank" && grids[bottom.x - 1 + (bottom.y * 8)].type == "blank") {
          grids[top.x - 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x - 1, y: top.y, rotate: top.rotate };
          grids[bottom.x - 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x - 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(top.x, top.y);
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
      case "bottom":
        if (top.x > 0 && grids[top.x - 1 + (top.y * 8)].type == "blank" && grids[bottom.x - 1 + (bottom.y * 8)].type == "blank") {
          grids[top.x - 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x - 1, y: top.y, rotate: top.rotate };
          grids[bottom.x - 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x - 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(top.x, top.y);
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
      case "left":
        if (top.x > 0 && grids[top.x - 1 + (top.y * 8)].type == "blank") {
          grids[top.x - 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x - 1, y: top.y, rotate: top.rotate };
          grids[bottom.x - 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x - 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
      case "right":
        if (bottom.x > 0 && grids[bottom.x - 1 + (bottom.y * 8)].type == "blank") {
          grids[bottom.x - 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x - 1, y: bottom.y, rotate: bottom.rotate };
          grids[top.x - 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x - 1, y: top.y, rotate: top.rotate };
          this.clearGrid(top.x, top.y);
        }
        break;
    }
    top.x--;
    bottom.x--;
    this.setState({
      grids: grids
    })
  }

  // 右移
  right = () => {
    switch (top.rotate) {
      case "top":
        if (top.x < 7 && grids[top.x + 1 + (top.y * 8)].type == "blank" && grids[bottom.x + 1 + (bottom.y * 8)].type == "blank") {
          grids[top.x + 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x + 1, y: top.y, rotate: top.rotate };
          grids[bottom.x + 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x + 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(top.x, top.y);
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
      case "bottom":
        if (top.x < 7 && grids[top.x + 1 + (top.y * 8)].type == "blank" && grids[bottom.x + 1 + (bottom.y * 8)].type == "blank") {
          grids[top.x + 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x + 1, y: top.y, rotate: top.rotate };
          grids[bottom.x + 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x + 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(top.x, top.y);
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
      case "left":
        if (bottom.x < 7 && grids[bottom.x + 1 + (bottom.y * 8)].type == "blank") {
          grids[bottom.x + 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x + 1, y: bottom.y, rotate: bottom.rotate };
          grids[top.x + 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x + 1, y: top.y, rotate: top.rotate };
          this.clearGrid(top.x, top.y);
        }
        break;
      case "right":
        if (top.x < 7 && grids[top.x + 1 + (top.y * 8)].type == "blank") {
          grids[top.x + 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x + 1, y: top.y, rotate: top.rotate };
          grids[bottom.x + 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x + 1, y: bottom.y, rotate: bottom.rotate };
          this.clearGrid(bottom.x, bottom.y);
        }
        break;
    }
    top.x++;
    bottom.x++;
    this.setState({
      grids: grids
    })
  }

  // 旋转
  rotate = () => {
    switch (top.rotate) {
      case "top":
        if (top.x < 7 && grids[top.x + 1 + (top.y + 1) * 8].type == "blank") {
          grids[top.x + 1 + (top.y + 1) * 8] = { type: 'capsule', color: top.color, x: top.x + 1, y: top.y + 1, rotate: "right" };
          grids[bottom.x + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y, rotate: "left" };
          this.clearGrid(top.x, top.y);
          top = grids[top.x + 1 + (top.y + 1) * 8];
          bottom = grids[bottom.x + (bottom.y * 8)];
        }
        break;
      case "bottom":
        if (bottom.x < 7 && grids[bottom.x + 1 + (bottom.y + 1) * 8].type == "blank") {
          grids[bottom.x + 1 + (bottom.y + 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x + 1, y: bottom.y + 1, rotate: "right" };
          grids[top.x + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x, y: top.y, rotate: "left" };
          this.clearGrid(bottom.x, bottom.y);
          top = grids[top.x + (top.y * 8)];
          bottom = grids[bottom.x + 1 + (bottom.y + 1) * 8];
        }
        break;
      case "left":
        if (grids[top.x + (top.y - 1) * 8].type == "blank") {
          grids[top.x + (top.y - 1) * 8] = { type: 'capsule', color: top.color, x: top.x, y: top.y - 1, rotate: "top" };
          grids[bottom.x - 1 + (bottom.y * 8)] = { type: 'capsule', color: bottom.color, x: bottom.x - 1, y: bottom.y, rotate: "bottom" };
          this.clearGrid(bottom.x, bottom.y);
          top = grids[top.x + (top.y - 1) * 8];
          bottom = grids[bottom.x - 1 + (bottom.y * 8)];
        }
        break;
      case "right":
        if (grids[bottom.x + (bottom.y - 1) * 8].type == "blank") {
          grids[bottom.x + (bottom.y - 1) * 8] = { type: 'capsule', color: bottom.color, x: bottom.x, y: bottom.y - 1, rotate: "top" };
          grids[top.x - 1 + (top.y * 8)] = { type: 'capsule', color: top.color, x: top.x - 1, y: top.y, rotate: "bottom" };
          this.clearGrid(top.x, top.y);
          top = grids[top.x - 1 + (top.y * 8)];
          bottom = grids[bottom.x + (bottom.y - 1) * 8];
        }
        break;
    }
    this.setState({
      grids: grids
    })
  }

  componentDidMount() {
    let app = this;
    document.addEventListener('keyup', function (e) {
      switch (e.keyCode) {
        case 38:
          // 旋转
          app.rotate();
          break
        case 37:
          //左
          app.left();
          break
        case 39:
          // 右
          app.right();
          break
        case 40:
          // 右
          app.fall();
          break
      }
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
