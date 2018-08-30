/*
 * @file main.js
 * @brief 盤面の操作、ゲームとしての動作
 */

const N = 4;                  // 盤面のサイズ(N x N)
const PROBABILITY_2 = 0.75;   // 新しく生成されるタイルの値が2である確率
const CLEAR_VALUE = 2048;      // ゲームクリアとする時のタイルの最大値

class Board {
  constructor() {
    this.isCleared = false;
    this.isTransposed = false;
  }

  initialize() {
    // x = rows, y = columns
    for (var x = 0; x < N; x++) {
      this[x] = [];
      for (var y = 0; y < N; y++) {
        this[x][y] = null;
      }
    }

    this.addNewTile();
    this.addNewTile();
  }

  addNewTile() {
    do {
        var x = Math.floor(Math.random() * N);
        var y = Math.floor(Math.random() * N);
    } while (this[x][y] != null);

    // 下記drawメソッドにて、新しいタイルにidを付与する為に便宜上値を'newX'とする
    if (Math.random() < PROBABILITY_2) {
      this[x][y] = 'new2';
    } else {
      this[x][y] = 'new4';
    }

    this.draw();
  }

  draw() {
    var tag = [];

    tag.push('<table>');
    for (var x = 0; x < N; x++) {
      tag.push('<tr>');
      for (var y = 0; y < N; y++) {
        tag.push('<td ');

        if (this[x][y] == 'new2' || this[x][y] == 'new4') {
          tag.push('id="new-tile" ');
          if (this[x][y] == 'new2'){
            this[x][y] = 2;
          } else {
            this[x][y] = 4;
          }
        }

        tag.push('class="cell ');
        if (this[x][y] > 2048) {
          tag.push('2048over');
        } else {
          tag.push(this[x][y]);
        }

        tag.push('">');
        tag.push(this[x][y]);
        tag.push('</td>');
      }
      tag.push('</tr>');
    }
    tag.push('</table>');

    $('#game-board').html(tag.join(''));

    // 新しく生成されたタイルが浮き上がって表示されるアニメーション
    $('#new-tile').hide();
    $('#new-tile').show(300);
  }

  move(direction) {
    // タイルをdirection方向に寄せるメソッド
    // 盤面が変わった場合はその後の処理も行う

    this.replaceElementsIfNeeded(direction);

    var hasChanged = false;

    for (var i = 0; i < N; i++) {
      var xthis_i = this[i];

      this[i] = this.arrange(this[i]);

      if (hasChanged) continue;
      if (!this.isEqual(xthis_i, this[i])) {
        hasChanged = true;
      }
    }

    this.undoIfReplaced(direction);

    if (hasChanged) {
      this.addNewTile();
      this.checkGameState();
    }
  }

  replaceElementsIfNeeded(direction) {
    // 動く方向に応じて、this[0]～this[3]の配列要素の値を入れ直す。
    // 1234  ex.  left => this[0] = [1, 2, 3, 4] (※入れ直さない)
    // 5678      right => this[0] = [4, 3, 2, 1]
    // 9ABC         up => this[0] = [1, 5, 9, D]
    // DEFG       down => this[0] = [D, 9, 5, 1]

    if (direction == 'up' || direction == 'down') {
      this.transpose();
    }

    if (direction == 'right' || direction == 'down') {
      for (var i = 0; i < N; i++) {
        this[i].reverse();
      }
    }
  }

  arrange(array) {
    // ex. [2, null, 2, 4] => [4, 4, null, null] (※[8, null,...]とはならない)

    // nullの要素を削除
    array = array.filter(value => value != null);

    // array.length - 1 回だけ前後の値を比較したいので、
    // array.length を N としてはいけない
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] == array[i + 1]) {
        array[i] *= 2;
        array.splice(i + 1, 1);
      }
    }

    // 要素数を元に戻す
    while (array.length < N) {
      array.push(null);
    }

    return array;
  }

  undoIfReplaced(direction) {
    // replaceElementsIfNeededで入れ替えられた対象を元に戻す。

    if (direction == 'right' || direction == 'down') {
      for (var i = 0; i < N; i++) {
        this[i].reverse();
      }
    }

    if (direction == 'up' || direction == 'down') {
      this.transpose();
    }
  }

  checkGameState() {
    if (this.hasJustReachedClearValue()) {
      alert('ゲームクリアです！');
    }

    if (!this.canMove()) {
      setTimeout('alert("ゲームオーバーです。")', 300);
    }
  }

  transpose() {
    var tmpBoard = [];

    for (var y = 0; y < N; y++) {
      tmpBoard[y] = [];
      for (var x = 0; x < N; x++) {
        tmpBoard[y][x] = this[x][y];
      }
    }

    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        this[x][y] = tmpBoard[x][y];
      }
    }

    this.isTransposed = !this.isTransposed;
  }

  isEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;

    if (a.toString() == b.toString()) {
      return true;
    } else {
      return false;
    }
  }

  hasJustReachedClearValue() {
    if (this.isCleared) return false;

    for (var i = 0; i < N; i++) {
      if (this[i].some(value => value == CLEAR_VALUE)) {
        this.isCleared = true;
        return true;
      }
    }

    return false;
  }

  canMove() {
    for (var i = 0; i < N; i++) {
      if (this[i].includes(null)) {
        return true;
      }
    }

    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N - 1; y++) {
        if (this[x][y] == this[x][y + 1]) {
          if (this.isTransposed) {
            this.transpose();
          }
          return true;
        }
      }
    }

    if (!this.isTransposed) {
      this.transpose();
      return this.canMove();
    }

    this.transpose();
    return false;
  }
}


// - global -
var board = new Board();
var newGame = document.getElementById('new-game');
var gameBoard = document.getElementById('game-board');
var touchStartX, touchStartY;
var touchMoveX, touchMoveY;
var XLength, YLength;

// - main -
window.onload = function() {
  console.log(77);
  // 盤面の初期化
  board.initialize();

  // イベントの登録
  newGame.addEventListener('click', function() {board.initialize()}, false);
  window.addEventListener('keydown', keyDown);
  gameBoard.addEventListener('touchstart', touchStart, false);
  gameBoard.addEventListener('touchmove', touchMove, false);
  gameBoard.addEventListener('touchend', touchEnd, false);

}

// - event -
function keyDown(event) {
  var direction = {
    '37' : 'left' , // key:[←]
    '38' : 'up'   , // key:[↑]
    '39' : 'right', // key:[→]
    '40' : 'down'   // key:[↓]
  };

  if (direction[event.keyCode]) {
    board.move(direction[event.keyCode]);
  }
}

function touchStart(event) {
  event.preventDefault();

  touchStartX = event.touches[0].pageX;
  touchStartY = event.touches[0].pageY;
}

function touchMove(event) {
  event.preventDefault();

  touchMoveX = event.changedTouches[0].pageX;
  touchMoveY = event.changedTouches[0].pageY;
}

function touchEnd(event) {
  XLength = touchMoveX - touchStartX;
  YLength = touchMoveY - touchStartY;
  var XMoveThanY = (Math.abs(XLength) > Math.abs(YLength));

  if (XMoveThanY) {
    if (XLength < -50) {
      board.move('left');
    } else if (XLength > 50) {
      board.move('right');
    }
  } else {  // if (YMoveThanX)
    if (YLength < -50) {
      board.move('up');
    } else if (YLength > 50) {
      board.move('down');
    }
  }
}


// const board = new Board();
//
// window.addEventListener('load', function(event) {
//   board.initialize();
// });
//
// $('#new-game').click(function() {
//   board.initialize();
//   console.log(4);
// });
//
// // 矢印キーでの操作
// function selectMoveBykeyDown(e) {
//   var direction = {
//     '37' : 'left',
//     '38' : 'up',
//     '39' : 'right',
//     '40' : 'down',
//   };
//
//   if (direction[e.keyCode]) {
//     board.move(direction[e.keyCode]);
//   }
// }
// document.onkeydown = selectMoveBykeyDown;
//
// // フリック操作
// var gameBoard = document.getElementById('game-board');
// window.addEventListener('load', function(event) {
//   var touchStartX, touchStartY;
//   var touchMoveX, touchMoveY;
//   var XLength, YLength;
//
//   // 開始時
//   gameBoard.addEventListener('touchstart', function(event) {
//     event.preventDefault();
//
//     touchStartX = event.touches[0].pageX;
//     touchStartY = event.touches[0].pageY;
//   }, false);
//
//   // 移動時
//   gameBoard.addEventListener('touchmove', function(event) {
//     event.preventDefault();
//
//     touchMoveX = event.changedTouches[0].pageX;
//     touchMoveY = event.changedTouches[0].pageY;
//   }, false);
//
//   // 終了時
//   gameBoard.addEventListener('touchend', function(event) {
//     XLength = touchMoveX - touchStartX
//     YLength = touchMoveY - touchStartY
//     XMoveThanY = (Math.abs(XLength) > Math.abs(YLength))
//
//     // 移動量の判定
//     if (XMoveThanY) {
//       if (XLength < -50) {
//         board.move('left');
//       } else if (XLength > 50) {
//         board.move('right');
//       }
//     } else {  // if (YMoveThanX)
//       if (YLength < -50) {
//         board.move('up');
//       } else if (YLength > 50) {
//         board.move('down');
//       }
//     }
//   }, false);
// }, false);
