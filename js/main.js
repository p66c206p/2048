/*
 * @file main.js
 * @brief ゲーム全体の流れを管理する処理、イベントに関連する処理
 */

// - global -
var board = new Board();
var newGame = document.getElementById('new-game');
var gameBoard = document.getElementById('game-board');
var touchStartX, touchStartY;
var touchMoveX, touchMoveY;
var XLength, YLength;

// - main -
window.onload = function() {
  console.log(80);
  gameStart();

  // イベントの登録
  newGame.addEventListener('click', gameStart, false);
  window.addEventListener('keydown', keyDown);
  gameBoard.addEventListener('touchstart', touchStart);
  gameBoard.addEventListener('touchmove', touchMove);
  gameBoard.addEventListener('touchend', touchEnd);

}

// - event -
function gameStart() {
  board.initialize();
}

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
