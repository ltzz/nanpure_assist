

window.onload = function(){

MouseCellSelect.nowC = null; //クリック中の列
MouseCellSelect.nowR = null; //行

	GF_Init();

	//var ui = new UI();
	var logic = new Logic(NUM_OF_CELLS, BC, BR);

	var suggestKeydown = function(){
    $('#pctrl').text("入力可能な数字を表示中");
		drawPossible();
		document.getElementById("possible").style.display = "block";
    //ctx.drawImage(drawPossible(),0,0);//上書きするよりレイヤーの表示非表示のほうがよさそう
	}

	var suggestKeyUp = function(){
		$('#pctrl').text("候補を表示 (Ctrl)");
		document.getElementById("possible").style.display = "none";
    Render.clearScreen( ctx );
    drawSuggest();
	}

	var usedNumberKeyDown = function(){
    ctx.drawImage(drawUsedNumber(),0,0);//上書きするよりレイヤーの表示非表示のほうがよさそう
	}

	var usedNumberKeyUp = function(){
    Render.clearScreen( ctx );
    drawSuggest();
	}

	var ctx = $('#main_canvas').get(0).getContext('2d');
	setupCells(); // セルの要素生成、挿入


	$('#pctrl').bind({
		"mousedown touchstart": suggestKeydown,
		"mouseup touchend"    : suggestKeyUp
	});

	$('#usednum').bind({
		"mousedown touchstart": usedNumberKeyDown,
		"mouseup touchend"    : usedNumberKeyUp
	});

	SingleNumberKeyboard.generateKey();
	SingleNumberKeyboard.selectKey(0);

	Tabs();
	let keyboardPossibleList;

	var showCountNumbers = function(){
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

	var drawSuggest = function(){
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


	var drawPossible = function(){
		const possibleList = logic.suggest(ui.getCells());
    var cvs = document.getElementById("possible");
    cvs.width = WIDTH;
		cvs.height = HEIGHT;
    const pctx = cvs.getContext('2d');
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

	};


	var drawUsedNumber = function(){

    var cvs = document.createElement('canvas');
    cvs.width = WIDTH;
		cvs.height = HEIGHT;
    var ctx = cvs.getContext('2d');
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
        return cvs;
	};

	$("#import_board").mousedown( ui.importBoard );
	$("#export_board").mousedown( ui.exportBoard );
	$("#clear_board").mousedown( function(){
	if(confirm("盤面を全消去します"))
		ui.clearBoard();
	} );
	$("#solve").mousedown( function(){
		let tbl = ui.getCells();
		ui.setCells( logic.solver( tbl ) );
	} );

	const keys = {
		"ctrl": 17,
		"left": 37,
		// "up":		38,
		// "right":39,
		"down":	40,
		"0":		48,
		"backspace": 8,
	};

	$(window).keydown( function( evt ){
		const keyCode = evt.keyCode;
		if( keyCode === keys.ctrl ){
			suggestKeydown();
    }

		if( keys.left <= keyCode && keyCode <= keys.down ){
			evt.preventDefault();//prevent scroll

			const DPos = keycodeToDPos( keyCode );
			const dx = DPos.dx;
			const dy = DPos.dy;

			if( ui._inrange( CellInput.selectedPos[0] + dx, CellInput.selectedPos[1] + dy ) ){ // セルの移動可能なら
				CellInput.cellMove(dx, dy);
			}

			const cellid = ui._cellid(CellInput.selectedPos[0], CellInput.selectedPos[1]);
			$(".selectedCell").removeClass("selectedCell");
			$("#" + cellid).addClass("selectedCell");
		}

		if( keys["0"] <= keyCode && keyCode <= keys["0"] + 9 ){ // 数字キー
			ui.setCell( CellInput.selectedPos[0], CellInput.selectedPos[1], keyCode-keys["0"] ); // 数字入れる
			ui.refresh();
		}

		if( keyCode === keys.backspace ){
			ui.setCell( CellInput.selectedPos[0], CellInput.selectedPos[1], 0 ); // そのセルの数字消す
			ui.refresh();
		}

		//console.log(keyCode);
	});

  $(window).keyup( function(evt){
      if( evt.keyCode === keys.ctrl ){
      	suggestKeyUp();
      }
  });

	$('#main_canvas').bind({
		'touchstart mousedown': function( evt ){
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

		},

		'touchmove mousemove': function( evt ){
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
		},

		'touchend mouseup': function( evt ){
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
	});

};
