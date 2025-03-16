/**
 * @file board.js
 * @brief ゲーム盤面とその動作
 */

const N = 4;                     // 盤面の行数,列数
const PROBABILITY_OF_2 = 0.75;   // 追加されるタイルの値が2である確率
const CLEAR_VALUE = 2048;        // この値のタイルを作った時ゲームクリアとする

class Board {
  constructor() {
    this.isCleared = false;
  }

  initialize() {
    // x = row, y = column
    for (let x = 0; x < N; x++) {
      this[x] = [];
      for (let y = 0; y < N; y++) {
        this[x][y] = null;
      }
    }

    this.addTile();
    this.addTile();
    this.draw();
  }

  addTile() {
    // タイルを追加する。

    // 挿入位置を決める
    let x, y;
    do {
        x = Math.floor(Math.random() * N);
        y = Math.floor(Math.random() * N);
    } while (this[x][y] != null);

    // タイルの値を2 or 4に決める
    // （'newX'とする理由は、draw()にて新しいタイルにclassを付与するため）
    let value = 'new4';
    if (Math.random() < PROBABILITY_OF_2) {
      value = 'new2';
    }

    // タイルを追加する
    this[x][y] = value;
  }

  draw() {
    let tag = [];

    tag.push('<table>');
    for (let x = 0; x < N; x++) {
      tag.push('<tr>');
      for (let y = 0; y < N; y++) {
        tag.push('<td class="');

        if (this[x][y] == 'new2' || this[x][y] == 'new4') {
          tag.push('new-tile ');
          if (this[x][y] == 'new2'){
            this[x][y] = 2;
          } else {
            this[x][y] = 4;
          }
        }

        tag.push('cell-');
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

    // 浮き上がって表示されるアニメーション
    $('.new-tile').hide();
    $('.new-tile').show(300);
  }

  slideTiles(direction) {
    // 入力された方向にタイルを寄せる。
    // （盤面が変わった場合はその後の処理も行う）

    this.flip(direction);

    let slided = false;
    for (let i = 0; i < N; i++) {
      let old = this[i];

      this[i] = this.combineAndShift(this[i]);

      if (slided) continue;
      if (!this.isEqual(old, this[i])) {
        slided = true;
      }
    }

    this.unflip(direction);

    if (slided) {
      this.addTile();
      this.draw();
    }
  }

  flip(direction) {
    // 次に処理されるcombineAndShift()が、directionによって分岐するのを避けるために、
    // 一時的に、配列要素を入れ替えて軸や向きを反転させる処理。
    // 1234  ex. (left => this[0] = [1, 2, 3, 4])
    // 5678      right => this[0] = [4, 3, 2, 1]
    // 9ABC         up => this[0] = [1, 5, 9, D]
    // DEFG       down => this[0] = [D, 9, 5, 1]

    if (direction == 'down' || direction == 'up') {
      this.transpose();
    }

    if (direction == 'down' || direction == 'right') {
      for (let i = 0; i < N; i++) {
        this[i].reverse();
      }
    }
  }

  combineAndShift(array) {
    // 同じ値のタイルを合体し、詰める。
    // ex. [2, null, 2, 4] => [4, 4, null, null] (※[8, null,...]とはならない)

    // [2, null, 2, 4] => [2, 2, 4]
    array = array.filter(value => value != null);

    // [2, 2, 4] => [4, 4]
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] == array[i + 1]) {
        array[i] *= 2;
        array.splice(i + 1, 1);
      }
    }

    // [4, 4] => [4, 4, null, null]
    while (array.length < N) {
      array.push(null);
    }

    return array;
  }

  unflip(direction) {
    // flip()で行った反転処理を元に戻す。

    if (direction == 'down' || direction == 'right') {
      for (let i = 0; i < N; i++) {
        this[i].reverse();
      }
    }

    if (direction == 'down' || direction == 'up') {
      this.transpose();
    }
  }

  transpose() {
    // 2次元配列の行と列を入れ替える。
    
    let tmpBoard = [];

    for (let j = 0; j < N; j++) {
      tmpBoard[j] = [];
      for (let i = 0; i < N; i++) {
        tmpBoard[j][i] = this[i][j];
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        this[i][j] = tmpBoard[i][j];
      }
    }
  }

  isEqual(a, b) {
    // JavaScriptにはequalsメソッドがない為これを用いる

    if (!Array.isArray(a) || !Array.isArray(b)) return false;

    if (a.toString() == b.toString()) {
      return true;
    } else {
      return false;
    }
  }

  isJustCleared() {
    if (this.isCleared) return false;

    for (let i = 0; i < N; i++) {
      if (this[i].includes(CLEAR_VALUE)) {
        this.isCleared = true;
        return true;
      }
    }

    return false;
  }

  isGameOver() {
    if (this.canAddTile())   return false;
    if (this.canCombineTiles()) return false;

    return true;
  }

  canAddTile() {
    for (let i = 0; i < N; i++) {
      if (this[i].includes(null)) {
        return true;
      }
    }

    return false;
  }

  canCombineTiles() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N - 1; j++) {
        if (this[i][j] == this[i][j + 1]) return true;
        if (this[j][i] == this[j + 1][i]) return true;
      }
    }

    return false;
  }
}
