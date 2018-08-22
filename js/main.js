const N = 4;
const probability_2 = 0.75;
const clearValue = 2048;

class Board {
  constructor() {
    this.isMoved = false;
    this.isCleared = false;
    this.isReversed = false;
  }

  initialize() {
    // x = rows, y = columns
    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        this[[x, y]] = null;
      }
    }

    this.addNewTile();
    this.addNewTile();
  }

  addNewTile() {
    do {
        var x = Math.floor(Math.random() * N);
        var y = Math.floor(Math.random() * N);
    } while (this[[x, y]] != null);

    if (Math.random() < probability_2) {
      this[[x, y]] = 'new2'
    } else {
      this[[x, y]] = 'new4'
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

        // 新しいタイルはid:newを付与
        if (this[[x, y]] == 'new2' || this[[x, y]] == 'new4') {
          tag.push('id="new-tile" ');
          if (this[[x, y]] == 'new2'){
            this[[x, y]] = 2;
          } else {
            this[[x, y]] = 4;
          }
        }

        tag.push('class="cell ');
        // 2048より大きい場合、class名を統一
        if (this[[x, y]] > 2048) {
          tag.push('2048over');
        } else {
          tag.push(this[[x, y]]);
        }

        tag.push('">');
        tag.push(this[[x, y]]);
        tag.push('</td>');
      }
      tag.push('</tr>');
    }
    tag.push('</table>');

    $('#game-board').html(tag.join(''));
    $('#new-tile').hide();
    $('#new-tile').show(300);
  }

  move(direction) {
    var line = [];

    // [↑][↓]の場合は軸を逆にする
    if (direction == 'up' || direction == 'down') {
      this.reverseXY();
    }

    // 各ラインで整列させる
    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        line[y] = this[[x, y]];
      }

      line = this.arrange(line, direction);

      for (var y = 0; y < N; y++) {
        this[[x, y]] = line[y];
      }
    }

    if (this.isReversed) {
      this.reverseXY();
    }
  }

  arrange(line, direction) {
    var xline = line;

    // nullを削除
    line = line.filter(v => v);

    // [→][↓]の時は配列を逆順で処理する
    if (direction == 'right' || direction == 'down') {
      line.reverse();
      var lineIsReversed = true;
    }

    // 同値が連続する場合、前方の値を2倍にし後方を削除する
    for (var i = 0; i < line.length - 1; i++) {
      if (line[i] == line[i + 1]) {
        line[i] *= 2;
        line.splice(i + 1, 1);
      }
    }

    // 要素数を元に戻す
    while (line.length < N) {
      line.push(null);
    }

    // 逆にした配列を元に戻す
    if (lineIsReversed) {
      line.reverse();
    }

    // 処理前後で配列に変化があった場合movedとする
    for (var i = 0; i < N; i++) {
      if (xline[i] != line[i]) {
        this.isMoved = true;
        break;
      }
    }

    return line;
  }

  checkGameOver() {
    var tileValues = Object.values(this);
    var maxValue = Math.max.apply(null,(tileValues));

    if (!this.isCleared && maxValue == clearValue) {
      alert('ゲームクリアです！');
      this.isCleared = true;
    }

    // 空白のタイルがなく、
    // 隣同士の値が同じタイルがないならば、ゲームオーバー
    if (tileValues.includes(null)) {
      return;
    }
    for (var i = 0; i < 2; i++) {
      for (var x = 0; x < N; x++) {
        for (var y = 0; y < N - 1; y++) {
          if (this[[x, y]] == this[[x, y + 1]]) {
            if (this.isReversed) {
              this.reverseXY();
            }
            return;
          }
        }
      }
    this.reverseXY();
    }

    alert('ゲームオーバーです。');
  }

  reverseXY() {
    var tmpBoard = {};

    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        tmpBoard[[y, x]] = this[[x, y]];
      }
    }

    for (var x = 0; x < N; x++) {
      for (var y = 0; y < N; y++) {
        this[[x, y]] = tmpBoard[[x, y]];
      }
    }

    this.isReversed = !this.isReversed;
  }
}

const board = new Board();

window.addEventListener('load', function(event) {
  board.initialize();
});

$('#new-game').click(function() {
  board.initialize();
});

// 矢印キーでの操作
function selectMoveBykeyDown(e) {
  var directionBy = {
    '37' : 'left',
    '38' : 'up',
    '39' : 'right',
    '40' : 'down',
  };

  if (directionBy[e.keyCode]) {
    board.move(directionBy[e.keyCode]);
  }

  if (board.isMoved) {
    board.addNewTile();
    board.checkGameOver();
    board.isMoved = false;
  }
}
document.onkeydown = selectMoveBykeyDown;

// フリック操作
var gameBoard = document.getElementById('game-board');
window.addEventListener('load', function(event) {
  var touchStartX;
  var touchStartY;
  var touchMoveX;
  var touchMoveY;
  var XLength;
  var YLength;

  // 開始時
  gameBoard.addEventListener('touchstart', function(event) {
    event.preventDefault();
    // 座標の取得
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
  }, false);

  // 移動時
  gameBoard.addEventListener('touchmove', function(event) {
    event.preventDefault();
    // 座標の取得
    touchMoveX = event.changedTouches[0].pageX;
    touchMoveY = event.changedTouches[0].pageY;
  }, false);
  // 終了時
  gameBoard.addEventListener('touchend', function(event) {
    XLength = touchMoveX - touchStartX
    YLength = touchMoveY - touchStartY
    XMoveThanY = (Math.abs(XLength) > Math.abs(YLength))

    // 移動量の判定
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

    if (board.isMoved) {
      board.addNewTile();
      board.checkGameOver();
      board.isMoved = false;
    }
  }, false);
}, false);
