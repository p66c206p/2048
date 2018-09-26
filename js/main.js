/*
 * @file main.js
 * @brief ゲーム全体の流れを管理する処理、イベントに関連する処理
 */

// - global -
var board = new Board();
var newGame = document.getElementById('new-game');
var gameBoard = document.getElementById('game-board');
var touchStartX, touchStartY, touchEndX, touchEndY;

// - main -
window.onload = function() {
  startGame();

  // イベントの登録
  newGame.addEventListener('click', startGame);
  window.addEventListener('keydown', keyControls);
  gameBoard.addEventListener('touchstart', flickStart);
  gameBoard.addEventListener('touchmove', flicking);
  gameBoard.addEventListener('touchend', flickControls);
}

// - event -
function startGame() {
  board.initialize();
}

function getDirectionFromKey() {

}

function getDirectionFromFlick() {
  var direction = getDirectionFromKey();
  return direction[key];
}

function runGame(direction) {
  var direction = getDirectionFromKey();
  board.moveTilesTo(direction);
  board.drawOn(canvas);
  checkGameState();
}

function keyControls(event) {
  var key = event.keyCode;
  var direction = {
    '37' : 'left' ,   // [←]
    '38' : 'up'   ,   // [↑]
    '39' : 'right',   // [→]
    '40' : 'down'     // [↓]
  };

  if (direction[key]) {
    board.moveTiles(direction[key]);
    checkGameState();
  }
}

function flickStart(event) {
  event.preventDefault();   // 上位のイベント処理を停止させる
                            // ex. touch長押しによる文字列の選択

  touchStartX = event.touches[0].pageX;
  touchStartY = event.touches[0].pageY;
}

function flicking(event) {
  event.preventDefault();   // 上位のイベント処理を停止させる
                            // ex. touchmoveによる画面スクロール

  touchEndX = event.changedTouches[0].pageX;
  touchEndY = event.changedTouches[0].pageY;
}

function flickControls(event) {
  var XLength = touchEndX - touchStartX;
  var YLength = touchEndY - touchStartY;
  var XMoveThanY = (Math.abs(XLength) > Math.abs(YLength));

  if (XMoveThanY) {
    if (XLength < -50) {
      board.moveTiles('left');
    } else if (XLength > 50) {
      board.moveTiles('right');
    }
  } else {  // if (YMoveThanX)
    if (YLength < -50) {
      board.moveTiles('up');
    } else if (YLength > 50) {
      board.moveTiles('down');
    }
  }

  checkGameState();
}

function checkGameState() {
  if (board.hasJustReachedClearValue()) {
    alert('ゲームクリアです！');
  }

  if (!board.canMove()) {
    setTimeout('alert("ゲームオーバーです。")', 300);
  }
}
