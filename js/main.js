/**
 * @file main.js
 * @brief 操作の受付、ゲームクリア/ゲームオーバー時のメッセージ表示
 */

// - グローバル -
const BOARD = new Board();
var touchStartX, touchStartY, touchEndX, touchEndY;

// - メイン -
window.onload = function() {
  gameStart();

  // 操作の受付
  const newGame = document.getElementById('new-game');
  const gameBoard = document.getElementById('game-board');
  newGame.addEventListener('click', gameStart);
  window.addEventListener('keydown', keyAction);
  gameBoard.addEventListener('touchstart', flickStart);
  gameBoard.addEventListener('touchmove', flicking);
  gameBoard.addEventListener('touchend', flickAction);
}

// - イベント -
function gameStart() {
  BOARD.initialize();
}

function keyAction(event) {
  var key = event.keyCode;
  const direction = {
    '37' : 'left' ,   // [←]
    '38' : 'up'   ,   // [↑]
    '39' : 'right',   // [→]
    '40' : 'down'     // [↓]
  };

  if (direction[key]) {
    BOARD.slideTiles(direction[key]);
    checkGameState();
  }
}

function flickStart(event) {
  event.preventDefault();   // 上位のイベント処理を禁じる
                            // ex. タップ長押しによる文字列の選択

  touchStartX = event.touches[0].pageX;
  touchStartY = event.touches[0].pageY;
}

function flicking(event) {
  event.preventDefault();   // 上位のイベント処理を禁じる
                            // ex. フリックによる画面スクロール

  touchEndX = event.changedTouches[0].pageX;
  touchEndY = event.changedTouches[0].pageY;
}

function flickAction(event) {
  var deltaX = touchEndX - touchStartX;
  var deltaY = touchEndY - touchStartY;

  var dir;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < -50) dir = 'left';
    if (deltaX > 50)  dir = 'right';
  } else {
    if (deltaY < -50) dir = 'up';
    if (deltaY > 50)  dir = 'down';
  }

  if (dir != null) {
    BOARD.slideTiles(dir);
    checkGameState();
  }
}

function checkGameState() {
  var message;
  if (!BOARD.isJustCleared()) message = "ゲームクリアです！";
  if (!BOARD.isGameOver())    message = "ゲームオーバーです。";

  if (message != undefined) {
    setTimeout('alert("ss")', 300);
  }
}
