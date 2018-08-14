class CircleKeyboard {
  static nowC = null;
  static nowR = null;
  static SetCurrentPosition(c : any, r : any) {
    CircleKeyboard.nowC = c;
    CircleKeyboard.nowR = r;
  }
}


/**
 * getKeyboardColor - 円形キーボードの色を取得
 *
 * @param  boolean possible 入力可能な数字かどうか(numが1以上のとき有効)
 * @param  number num 数字
 * @return string        色
 */
function getKeyboardColor(possible : boolean, num : number): string {
  let ret_val = "rgba(0, 0, 0, 0.7)";
  if (num === 0) {
    // 0はクリアなので見えやすい色
    ret_val = "rgba(0, 0, 0, 0.7)";
  }
  else if (possible) {
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
function circleKeyboardIsEnable(): boolean {
  // 単数字入力と排他
  return !document.getElementById("single_number_keyboard").checked;
}




/**
 * circleKeyboardStrokeInnerCircle - 円形キーボードの内側の円描画
 *
 */
function circleKeyboardStrokeInnerCircle(ctx, centerX, centerY, radius) {
  ctx.fillStyle = "rgba(255,255,255,1.0)";
  Render.circle(ctx, centerX, centerY, radius);
  ctx.fill();
  ctx.stroke();
}



/**
 * circleKeyboardStrokeOuterCircle - 円形キーボードの外側の円描画
 *
 */
function circleKeyboardStrokeOuterCircle(ctx, centerX, centerY, radius) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  Render.circle(ctx, centerX, centerY, radius);
  ctx.fill();
  ctx.stroke();
}

/**
 * circleKeyboardStrokeBorderLine - 円形キーボードの間の境界線描画
 *
 */
function circleKeyboardStrokeBorderLine(ctx, keyLineAngle: number, INNER_RADIUS: number, OUTER_RADIUS: number) {

  const sindata = Math.sin(keyLineAngle);
  const cosdata = Math.cos(keyLineAngle);

  Render.drawLine(ctx,
    +INNER_RADIUS * sindata, -INNER_RADIUS * cosdata,
    +OUTER_RADIUS * sindata, -OUTER_RADIUS * cosdata
  );
}
