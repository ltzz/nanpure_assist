/**
 * @fileoverview TypeScriptで記述した関数 現在は移行中のためここにまとめる
 */

/// <reference path="../typings/globals/jquery/index.d.ts" />

(function() {
	console.log( '$', $.fn.jquery );
}());

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


class Field {
  static each( callback ){
    for( let r = 0; r < NUM_OF_CELLS; ++r ) {
			for( let c = 0; c < NUM_OF_CELLS; ++c ) {
        callback(c, r);
      }
    }
  }
}

function mainMouseDownEvent( evt ){
  const isTouch = evt.type === "touchstart";
  const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

  const c = ((mouseRPoint.mx - MARGIN) / CELL_SIZ + 1|0) - 1
  const r = ((mouseRPoint.my - MARGIN) / CELL_SIZ + 1|0) - 1;
  MouseCellSelect.SetCurrentPosition(c, r);

  keyboardPossibleList = logic.suggest( ui.getCells() );
  if( ui._inrange(MouseCellSelect.nowC, MouseCellSelect.nowR) ) {
    if( circleKeyboardIsEnable() ){
      CircleKeyboard.mouseJob( ctx, keyboardPossibleList, MouseCellSelect.nowC, MouseCellSelect.nowR, 0, 0 );
    }
  }

}


function mainMouseMoveEvent( evt ){
  evt.preventDefault();
  const isTouch = evt.type === "touchmove";
  const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

  if( MouseCellSelect.nowC === null || MouseCellSelect.nowR === null
    || !(ui._inrange(MouseCellSelect.nowC, MouseCellSelect.nowR)) ){
    return;
  }

  const centerX = ui.getCellLeft( MouseCellSelect.nowC ) + CELL_SIZ/2
  const centerY = ui.getCellTop( MouseCellSelect.nowR )  + CELL_SIZ/2;

  if( circleKeyboardIsEnable() ){
    const r_x = mouseRPoint.mx - centerX;
    const r_y = mouseRPoint.my - centerY;
    CircleKeyboard.mouseJob( ctx, keyboardPossibleList, MouseCellSelect.nowC, MouseCellSelect.nowR, r_x, r_y );
  }
}


function mainMouseUpEvent( evt ){
  const isTouch = evt.type === "touchend";
  const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

  Render.clearScreen( ctx );

  if( singleNumberKeyboardIsEnable() ){
    ui.setCell( MouseCellSelect.nowC, MouseCellSelect.nowR, SingleNumberKeyboard.currentNumber );
  }

  if(document.getElementById("keyboard_input").checked){
  }

  MouseCellSelect.nowC = null;
  MouseCellSelect.nowR = null;
  Render.drawLine(ctx, WIDTH, 0, WIDTH, HEIGHT);
  ui.refresh();
  drawSuggest();
}


function drawSuggest(){
  const tbl = ui.getCells();
  const fsize = CELL_SIZ * 0.7 |0;
  ctx.font = fsize + "px Meiryo UI";

  const predict = logic.predict(tbl);
  const colors = [
    "rgba(0, 127, 255, 0.7)",
    "rgba(0, 255, 127, 0.7)",
    "rgba(255, 127, 0, 0.7)"
  ];

  Field.each( (c,r) => {
    const anstype = predict[ NUM_OF_CELLS * r + c].ansType;
    const number  = predict[ NUM_OF_CELLS * r + c].number;
    if( number == -1 ) return;
    ctx.fillStyle = colors[ anstype ];
    console.log( number );
    ctx.fillText( number, ui.getCellLeft( c ) + CELL_SIZ/2,
    ui.getCellTop( r ) + CELL_SIZ/2 );
  } );

  showCountNumbers();
  ctx.restore();
}

function showCountNumbers() {
		var tbl = ui.getCells();
		let numbers_count = new Array( NUM_OF_CELLS + 1 ).fill(0);
		Field.each( (c,r) => {
			const val = tbl[ r * NUM_OF_CELLS + c ] - 1; // そのセルの数字
			++numbers_count[val + 1]; // その数字の使用個数をインクリメント
		} );
		ctx.font = "10px Segoe UI";
		ctx.fillStyle = COLORS.black;
		for( let i = 1; i <= NUM_OF_CELLS; ++i ) { //個数表示
			const str = i + " : " + numbers_count[i] + " / " + NUM_OF_CELLS;
			ctx.fillText( str, 10, HEIGHT - 10 * ( NUM_OF_CELLS - i + 2) );
				//Render.tally( ctx, numbers_count[i] , i * 20 + 100, HEIGHT - 50 ); // 正の字
		}
		ctx.fillText( "remain : " + numbers_count[0], 10, HEIGHT - 10);
}

function drawPossible(){
  const possibleList = logic.suggest(ui.getCells());
  var cvs = document.getElementById("possible");
  const scale = window.devicePixelRatio || 1;
  cvs.width = WIDTH * scale; 		// Canvas要素としてのサイズ
  cvs.height = HEIGHT * scale;	// Canvas要素としてのサイズ
  cvs.style.width  = WIDTH  + "px"; 	// CSSでのサイズ
  cvs.style.height = HEIGHT + "px";	 	// CSSでのサイズ
  const pctx = cvs.getContext('2d');
  pctx.scale(scale, scale); // 高DPI対応
  pctx.font = FONTSIZE_MININUMBER + "px Meiryo UI";
  pctx.fillStyle = COLORS.red;

  Field.each( (c,r) => {
    let cnt = 0, n;
    for( let k = 0; k < NUM_OF_CELLS; ++k ) {
      if( !possibleList[NUM_OF_CELLS * r + c][k] ){
        continue;
      }
      Render.drawMiniNumber( pctx, r, c, k / BC | 0, k % BC |0, FONTSIZE_MININUMBER, k + 1 );
      ++cnt;
      n = k;
    }
  } );

}



function drawUsedNumber( ctx ){
  ctx.font = FONTSIZE_MININUMBER + "px Meiryo UI";

  let chist = [], rhist = [], bhist = [];
  for( let i = 0; i < NUM_OF_CELLS; ++i ) {
    chist[i] = new Array(NUM_OF_CELLS).fill(0);
    rhist[i] = new Array(NUM_OF_CELLS).fill(0);
    bhist[i] = new Array(NUM_OF_CELLS).fill(0);
  }

  const tbl = ui.getCells();
  const possibleList = logic.suggest(tbl);

  Field.each( (c,r) => { //行，列，ブロックごとにヒストグラムを作る
    for( let num = 0; num < NUM_OF_CELLS; ++num ){
      if( !possibleList[ NUM_OF_CELLS * r + c ][num] ) continue;
      if( tbl[ r * NUM_OF_CELLS + c ] == 0 ){ // 入力可能な場合
        // 行、列、ブロックでその数字の箇所をインクリメント
        ++chist[c][num];
        ++rhist[r][num];
        ++bhist[ logic.idxToBlock(c, r) ][num];
      }
    }
  } );

  ctx.fillStyle = COLORS.red;
  // 端に入力可能な数を描画する
  for( let j = 0; j < NUM_OF_CELLS; ++j ) {
    for( let k = 0; k < NUM_OF_CELLS; ++k ) {
      const str = k + 1;
      const innerR = k / BC | 0;
      const innerC = k % BC | 0;

      // 下端にj列の入力可能な数k+1を描画する
      if( chist[j][k] ) {
        Render.drawMiniNumber( ctx, NUM_OF_CELLS, j, innerR, innerC, FONTSIZE_MININUMBER, str );
      }

      // 右端にj行の入力可能な数k+1を描画する
      if( rhist[j][k] ) {
        Render.drawMiniNumber( ctx, j, NUM_OF_CELLS, innerR, innerC, FONTSIZE_MININUMBER, str );
      }
    }
  }
}
