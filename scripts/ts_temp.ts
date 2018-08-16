/**
 * @fileoverview TypeScriptで記述した関数 現在は移行中のためここにまとめる
 */


interface MousePoint {
  mx: number;
  my: number;
}

interface MouseRelativePoint {
  mx: number;
  my: number;
}


 /**
  * getPointFromMouseEvent - マウスイベントから座標取得
  *
  * @param  {type} mouseEvent マウスイベント
  * @return MousePoint         座標
  */

 function getPointFromMouseEvent( evt, isTouchEvent ): MousePoint {
   const touchEvent = isTouchEvent ? evt.originalEvent.changedTouches[0] : null;
   var m_x = ( isTouchEvent ? touchEvent.pageX　:　evt.pageX );
   var m_y = ( isTouchEvent ? touchEvent.pageY　:　evt.pageY );
  return {
    "mx": m_x,
    "my": m_y
  };
 }

 /**
  * getRelativePoint - マウス座標をボード左上からの相対座標に変換
  *
  * @param  {type} mousePoint マウスイベント
  * @return MousePoint         相対座標
  */
 function getRelativePoint( mousePoint : MousePoint ) {

    var m_x = mousePoint.mx  - $('#main_canvas').offset().left;
    var m_y = mousePoint.my  - $('#main_canvas').offset().top;
  return {
    "mx": m_x,
    "my": m_y
  };
 }


 /**
  * getRelativePointFromMouseEvent - マウスイベントから相対座標取得
  *
  * @param  {type} mouseEvent マウスイベント
  * @return MouseRelativePoint         相対座標
  */

 function getRelativePointFromMouseEvent( evt, isTouchEvent ): MouseRelativePoint {
   const mousePoint = getPointFromMouseEvent( evt,  isTouchEvent );
   const mouseRPoint = getRelativePoint( mousePoint );
   return mouseRPoint;
 }


 /**
  * getRelativePointFG - マウス座標を合体ナンプレ用結合設定左上からの相対座標に変換
  *
  * @param  {type} mousePoint マウスイベント
  * @return MousePoint         相対座標
  */
 function getRelativePointFG( mousePoint : MousePoint ) {

  var m_x = mousePoint.mx  - $('#place_board').offset().left;
  var m_y = mousePoint.my  - $('#place_board').offset().top;
return {
  "mx": m_x,
  "my": m_y
};
}




/**
 * singleNumberKeyboardIsEnable - 単数字入力キーボードが有効か
 *
 * @return boolean        有効か無効か
 */
function singleNumberKeyboardIsEnable() : boolean {
  return document.getElementById("single_number_keyboard").checked;
}


/**
 * keycodeToDPos - キーコードを変位に変換
 *
 * @param  number keyCode キーコード
 * @return DPos         変位
 */

function keycodeToDPos( keyCode: number ) :DPos {
 const keys = {
   "left": 37,
   "up":		38,
   "right":39,
   "down":	40,
 };

 let dx = 0, dy = 0;
 if( keyCode === keys.left  ) dx = -1;
 if( keyCode === keys.right ) dx = 1;
 if( keyCode === keys.up    ) dy = -1;
 if( keyCode === keys.down  ) dy = 1;

 return {
   "dx": dx,
   "dy": dy
 };
}
