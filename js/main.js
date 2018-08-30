/*
 * @file main.js
 * @brief ゲーム全体の流れを管理する処理、イベントに関連する処理
 */

// - global -
var board = new Board();
var newGame = document.getElementById('new-game');
var gameBoard = document.getElementById('game-board');
var touchStartX, touchStartY, touchMoveX, touchMoveY;

// - main -
window.onload = function() {
  gameStart();
  console.log(3);

  // イベントの登録
  newGame.addEventListener('click', gameStart);
  window.addEventListener('keydown', moveBoardWithKey);
  gameBoard.addEventListener('touchstart', flickStart);
  gameBoard.addEventListener('touchmove', flicking);
  gameBoard.addEventListener('touchend', moveBoardWithFlick);
}

// - event -
function gameStart() {
  board.initialize();
}

function moveBoardWithKey(event) {
  var keyDirection = {
    '37' : 'left' ,   // [←]
    '38' : 'up'   ,   // [↑]
    '39' : 'right',   // [→]
    '40' : 'down'     // [↓]
  };

  if (keyDirection[event.keyCode]) {
    board.move(keyDirection[event.keyCode]);
  }
}

function flickStart(event) {
  // event.preventDefault();

  touchStartX = event.touches[0].pageX;
  touchStartY = event.touches[0].pageY;
}

function flicking(event) {
  event.preventDefault();

  touchMoveX = event.changedTouches[0].pageX;
  touchMoveY = event.changedTouches[0].pageY;
}

function moveBoardWithFlick(event) {
  var XLength = touchMoveX - touchStartX;
  var YLength = touchMoveY - touchStartY;
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
