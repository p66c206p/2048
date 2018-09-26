class Board {
  constructor() {
    this.moved = false;
    this.isCleared = false;
  }

  initialize() {
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        this[[x, y]] = null;
      }
    }

    this.makeNewTile();
    this.makeNewTile();
  }

  makeNewTile() {
    var probability_2 = 0.75;

    do {
        var x = Math.floor(Math.random() * 4);
        var y = Math.floor(Math.random() * 4);
    } while (this[[x, y]] != null);

    if (Math.random() < probability_2) {
        this[[x, y]] = 2;
    } else {
        this[[x, y]] = 4;
    }

    this.draw();
  }

  draw() {
    var ss = [];

    ss.push('<table>');
    for (var x = 0; x < 4; x++) {
      ss.push('<tr>');
      for (var y = 0; y < 4; y++) {
        ss.push('<td class="cell ');
        // 2048より大きい場合、class名を統一
        if (this[[x, y]] > 2048) {
          ss.push('2048over');
        } else {
          ss.push(this[[x, y]]);
        }

        ss.push('">');
        ss.push(this[[x, y]]);
        ss.push('</td>');
      }
      ss.push('</tr>');
    }
    ss.push('</table>');

    $('#game-board').html(ss.join(''));
  }

  moveLeft() {
    for (var i = 0; i < 4; i++) {
      var a = 0;
      var b = 1;

      do {
        if (this[[i, b]] == null) {
          b++;

        } else {
          if (this[[i, a]] == null) {
            this[[i, a]] = this[[i, b]];
            this[[i, b]] = null;

            b++;
            this.moved = true;

          } else {
            if (this[[i, a]] == this[[i, b]]) {
              this[[i, a]] *= 2;
              this[[i, b]] = null;
              this.moved = true;
            }

            a++;
            b = a + 1;
          }
        }
      } while (b < 5)
    }
  }

  moveUp() {
    for (var i = 0; i < 4; i++) {
      var a = 0;
      var b = 1;

      do {
        if (this[[b, i]] == null) {
          b++;

        } else {
          if (this[[a, i]] == null) {
            this[[a, i]] = this[[b, i]];
            this[[b, i]] = null;

            b++;
            this.moved = true;

          } else {
            if (this[[a, i]] == this[[b, i]]) {
              this[[a, i]] *= 2;
              this[[b, i]] = null;
              this.moved = true;
            }

            a++;
            b = a + 1;
          }
        }
      } while (b < 5)
    }
  }

  moveDown() {
    for (var i = 0; i < 4; i++) {
      var a = 3;
      var b = 2;

      do {
        if (this[[b, i]] == null) {
          b--;

        } else {
          if (this[[a, i]] == null) {
            this[[a, i]] = this[[b, i]];
            this[[b, i]] = null;

            b--;
            this.moved = true;

          } else {
            if (this[[a, i]] == this[[b, i]]) {
              this[[a, i]] *= 2;
              this[[b, i]] = null;
              this.moved = true;
            }

            a--;
            b = a - 1;
          }
        }
      } while (b > -1)
    }
  }

  moveRight() {
    for (var i = 0; i < 4; i++) {
      var a = 3;
      var b = 2;

      do {
        if (this[[i, b]] == null) {
          b--;

        } else {
          if (this[[i, a]] == null) {
            this[[i, a]] = this[[i, b]];
            this[[i, b]] = null;

            b--;
            this.moved = true;

          } else {
            if (this[[i, a]] == this[[i, b]]) {
              this[[i, a]] *= 2;
              this[[i, b]] = null;
              this.moved = true;
            }

            a--;
            b = a - 1;
          }
        }
      } while (b > -1)
    }
  }

  checkGameOver() {
    var tileValues = Object.values(this);
    var maxValue = Math.max.apply(null,(tileValues));

    if (!this.isCleared && maxValue == 2048) {
      alert('ゲームクリアです！');
      this.isCleared = true;
    }

    // 空白のタイルがなく、
    // 隣同士の値が同じタイルがないならば、ゲームオーバー
    if (tileValues.includes(null)) {
      return;
    }
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 3; y++) {
        if (this[[x, y]] == this[[x, y + 1]]) {
          return;
        }
      }
    }

    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 3; x++) {
        if (this[[x, y]] == this[[x, y + 1]]) {
          return;
        }
      }
    }

    alert('ゲームオーバーです。');
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
  switch (e.keyCode) {
    case 37:
      board.moveLeft();
      break;
    case 40:
      board.moveDown();
      break;
    case 38:
      board.moveUp();
      break;
    case 39:
      board.moveRight();
      break;
    default:
      return;
  }

  if (board.moved) {
    board.makeNewTile();
    board.checkGameOver();
    board.moved = false;
  }
}
document.onkeydown = selectMoveBykeyDown;
