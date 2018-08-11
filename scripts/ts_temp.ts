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
  * getKeyboardColor - 円形キーボードの色を取得
  *
  * @param  {type} possible 入力可能な数字かどうか(numが1以上のとき有効)
  * @param  {type} num 数字
  * @return string        色
  */
function getKeyboardColor(possible, num) : string {
  let ret_val = "rgba(0, 0, 0, 0.7)";
  if( num === 0 ) {
    // 0はクリアは見えやすい色
    ret_val = "rgba(0, 0, 0, 0.7)";
  }
  else if( possible ){
    // 入力可能な数字も見えやすい色
    ret_val = "rgba(0, 0, 0, 0.7)";
  }
  else {
    //入力できない文字を灰色に
    ret_val = "rgba(192, 192, 192, 0.7)";
  }
  return ret_val;
}


/**
 * circleKeyboardIsEnable - 円形キーボードが有効か
 *
 * @return boolean        有効か無効か
 */
function circleKeyboardIsEnable() : boolean {
  // 単数字入力と排他
  return !document.getElementById("single_number_keyboard").checked;
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
 * circleKeyboardStrokeInnerCircle - 円形キーボードの内側の円描画
 *
 */
function circleKeyboardStrokeInnerCircle( ctx, centerX, centerY, radius ) {
  ctx.fillStyle = "rgba(255,255,255,1.0)";
  Render.circle( ctx, centerX, centerY, radius );
  ctx.fill();
  ctx.stroke();
}



/**
 * circleKeyboardStrokeOuterCircle - 円形キーボードの内側の円描画
 *
 */
function circleKeyboardStrokeOuterCircle( ctx, centerX, centerY, radius ) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  Render.circle( ctx, centerX, centerY, radius );
  ctx.fill();
  ctx.stroke();
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