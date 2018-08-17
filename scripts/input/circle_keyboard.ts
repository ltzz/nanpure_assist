class CircleKeyboard {

  static drawKeyboard( main_ctx, keyboardPossibleList, c, r, rx, ry ) {

		const centerX = ui.getCellLeft( c ) + CELL_SIZ / 2;
		const centerY = ui.getCellTop( r )  + CELL_SIZ / 2;

		main_ctx.save();
		Render.clearScreen( main_ctx );
		main_ctx.globalCompositeOperation = "source-over"; //重ねて描画(既定値)
		circleKeyboardStrokeOuterCircle( main_ctx, centerX, centerY, OUTER_RADIUS );

		main_ctx.globalCompositeOperation = "xor"; //重なって描画される時に透明になる
		circleKeyboardStrokeInnerCircle( main_ctx, centerX, centerY, INNER_RADIUS );

		// 設定を既定値に戻す
		main_ctx.globalCompositeOperation = "source-over"; //重ねて描画(既定値)
		// フォントの設定
		main_ctx.font = (CELL_SIZ * 0.7  |0) + "px Segoe UI";

    const sAngle = Math.PI * 2 / ( NUM_OF_CELLS + 1 );

    const cObj = CircleKeyboard.getSelectedNumberFromCoodinates(rx, ry);

		for( let num = 0; num <= NUM_OF_CELLS; ++num ) { // 各番号について
			const keyAngle = num * sAngle;
			const numchr : string = (num === 0) ? 'C' : String(num); // 0は"C"
			const chrWidth = main_ctx.measureText( numchr ).width;
			const keyRX =  KEY_RADIUS * Math.sin( keyAngle );
			const keyRY = -KEY_RADIUS * Math.cos( keyAngle );
			const keyX = centerX + keyRX
			const keyY = centerY + keyRY;

			if( cObj.selectedNumber === num && cObj.isInRange ) {
				main_ctx.translate( centerX, centerY );
				const keyLineAngle1 = ( num - 0.5 ) * sAngle;
				const keyLineAngle2 = ( num + 0.5 ) * sAngle;
				circleKeyboardStrokeBorderLine( main_ctx, keyLineAngle1, INNER_RADIUS, OUTER_RADIUS );
				circleKeyboardStrokeBorderLine( main_ctx, keyLineAngle2, INNER_RADIUS, OUTER_RADIUS );

				main_ctx.translate( -centerX, -centerY );
				//Render.circle(ctx,keyX,keyY,CELL_SIZ*0.4);ctx.stroke(); //fillに変更したい
			}

			main_ctx.fillStyle = getKeyboardColor( keyboardPossibleList[NUM_OF_CELLS * r + c][num-1], num );

			main_ctx.fillText( numchr, keyX - chrWidth/2, keyY + main_ctx.measureText( '1' ).width/2 );
		}

		main_ctx.restore();
  }

  static getSelectedNumberFromCoodinates (rx : number, ry : number){
    const sAngle = Math.PI * 2 / ( NUM_OF_CELLS + 1 );
    let mouseAngle = Math.atan2( rx, -ry );
    mouseAngle = ( mouseAngle > 0 ) ? mouseAngle : ( 2 * Math.PI + mouseAngle );
    const selectedNumber : number = ( mouseAngle / sAngle + 0.5 |0 ) % ( NUM_OF_CELLS + 1 );
    const dfc = Math.sqrt( rx * rx + ry * ry ); //中心からの距離
    const isInRange : boolean = INNER_RADIUS <= dfc && dfc < OUTER_RADIUS;
    return {
      selectedNumber: selectedNumber,
      isInRange     : isInRange
    }
  }

  static mouseJob ( ctx :any, keyboardPossibleList : any, c : number, r : number, rx : number, ry : number )
  	{
  		const main_ctx = ctx;
  		const cObj = CircleKeyboard.getSelectedNumberFromCoodinates(rx, ry);

  		CircleKeyboard.drawKeyboard( main_ctx, keyboardPossibleList, c, r, rx, ry );

  		if( cObj.isInRange ) {
  			ui.setCell( c, r, cObj.selectedNumber );
  		}

  	};
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
function circleKeyboardStrokeBorderLine(ctx : any, keyLineAngle: number, INNER_RADIUS: number, OUTER_RADIUS: number) {

  const sindata = Math.sin(keyLineAngle);
  const cosdata = Math.cos(keyLineAngle);

  Render.drawLine(ctx,
    +INNER_RADIUS * sindata, -INNER_RADIUS * cosdata,
    +OUTER_RADIUS * sindata, -OUTER_RADIUS * cosdata
  );
}
