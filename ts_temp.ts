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
  * @return {type}         座標
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
  * @return {type}         相対座標
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
  * @return {type}         相対座標
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
  * @return {type}        色
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
