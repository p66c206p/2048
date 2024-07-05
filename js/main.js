/**
 * @file main.js
 * @brief 操作の受付、ゲームクリア/ゲームオーバー時のメッセージ表示
 */

// - グローバル -
const BOARD = new Board();
let touchStartX, touchStartY, touchEndX, touchEndY;

// - メイン -
window.onload = function() {
  gameStart();

  // 操作の受付
  const NEW_GAME = document.getElementById('new-game');
  const GAME_BOARD = document.getElementById('game-board');
  NEW_GAME.addEventListener('click', gameStart);
  window.addEventListener('keydown', keyAction);
  GAME_BOARD.addEventListener('touchstart', flickStart);
  GAME_BOARD.addEventListener('touchmove', flicking);
  GAME_BOARD.addEventListener('touchend', flickAction);
}

// - イベント -
function gameStart() {
  BOARD.initialize();
}

function keyAction(event) {
  let key = event.keyCode;
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
  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;

  let dir = '';
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < -50) dir = 'left';
    if (deltaX > 50)  dir = 'right';
  } else {
    if (deltaY < -50) dir = 'up';
    if (deltaY > 50)  dir = 'down';
  }

  if (dir != '') {
    BOARD.slideTiles(dir);
    checkGameState();
  }
}

function checkGameState() {
  // TODO: 判定とメッセージ表示を分離できそうだが、問題あり
  
  if (BOARD.isJustCleared()) {
    setTimeout('alert("ゲームクリアです！")', 300);
  }
  if (BOARD.isGameOver()) {
    setTimeout('alert("ゲームオーバーです。")', 300);
  }
}
