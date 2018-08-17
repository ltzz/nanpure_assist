

window.onload = function(){

CircleKeyboard.nowC = null; //クリック中の列
CircleKeyboard.nowR = null; //行

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

	var testKeydown = function(){
    ctx.drawImage(drawUsedNumber(),0,0);//上書きするよりレイヤーの表示非表示のほうがよさそう
	}

	var testKeyUp = function(){
    Render.clearScreen( ctx );
    drawSuggest();
	}

	var ctx = $('#main_canvas').get(0).getContext('2d');
	setupCells(); // セルの要素生成、挿入


	$('#pctrl').bind({
		"mousedown touchstart": function(){
			suggestKeydown();
		},
		"mouseup touchend": function(){
			suggestKeyUp();
		}
	});

	$('#usednum').bind({
		"mousedown touchstart": function(){
			testKeydown();
		},
		"mouseup touchend": function(){
			testKeyUp();
		}
	});

	SingleNumberKeyboard.generateKey();
	SingleNumberKeyboard.selectKey(0);

	Tabs();
	let keyboardPossibleList;
	var circleKeyboardJob = function( c, r, rx, ry )
	{
		const main_ctx = ctx;

		const sAngle = Math.PI * 2 / ( NUM_OF_CELLS + 1 );
		let mouseAngle = Math.atan2( rx, -ry );
		mouseAngle = ( mouseAngle > 0 ) ? mouseAngle : ( 2 * Math.PI + mouseAngle );
		const selectedNumber = ( mouseAngle / sAngle + 0.5 |0 ) % ( NUM_OF_CELLS + 1 );
		const dfc = Math.sqrt( rx * rx + ry * ry ); //中心からの距離
		const isInRange = INNER_RADIUS <= dfc && dfc < OUTER_RADIUS;

		CircleKeyboard.drawKeyboard( main_ctx, keyboardPossibleList, c, r, rx, ry );

		if( isInRange ) {
			ui.setCell( c, r, selectedNumber );
		}

	};

	var showCountNumbers = function(){
		var tbl = ui.getCells();
		let numbers_count = new Array( NUM_OF_CELLS + 1 ).fill(0);
		for( let i = 0; i < NUM_OF_CELLS; ++i ) {
			for( let j = 0; j < NUM_OF_CELLS; ++j ) {
				const val = tbl[ i * NUM_OF_CELLS + j ] - 1; // そのセルの数字
				++numbers_count[val + 1]; // その数字の使用個数をインクリメント
			}
		}
		ctx.font = "10px Segoe UI";
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		for( let i = 1; i <= NUM_OF_CELLS; ++i ) { //個数表示
			const str = i + " : " + numbers_count[i] + " / " + NUM_OF_CELLS;
			ctx.fillText( str, 10, HEIGHT - 10 * ( NUM_OF_CELLS - i + 2) );
				//Render.tally( ctx, numbers_count[i] , i * 20 + 100, HEIGHT - 50 ); // 正の字
		}
		ctx.fillText( "remain : " + numbers_count[0], 10, HEIGHT - 10);
	}

	var drawSuggest = function(){
		var tbl = ui.getCells();
		var fsize = CELL_SIZ * 0.7 |0;
		ctx.font = fsize + "px Meiryo UI";

		var predict = logic.predict(tbl);
		const colors = [
			"rgba(0, 127, 255, 0.7)",
			"rgba(0, 255, 127, 0.7)",
			"rgba(255, 127, 0, 0.7)"
		];

		for( let i = 0; i < NUM_OF_CELLS; ++i ) {
			for( let j = 0; j < NUM_OF_CELLS; ++j ) {
				const anstype = predict[ NUM_OF_CELLS * i + j].ansType;
				const number  = predict[ NUM_OF_CELLS * i + j].number;
				if( number == -1 ) continue;
				ctx.fillStyle = colors[ anstype ];
				console.log( number );
				ctx.fillText( number, ui.getCellLeft( j ) + CELL_SIZ/2,
        ui.getCellTop( i ) + CELL_SIZ/2 );
			}
		}

		showCountNumbers();
		ctx.restore();
	}


	var drawPossible = function(){
		var possibleList = logic.suggest(ui.getCells());
    var cvs = document.getElementById("possible");
    cvs.width = WIDTH;
		cvs.height = HEIGHT;
    var pctx = cvs.getContext('2d');
		const fsize = ( CELL_SIZ * 0.7 / BC |0 );
		pctx.font = fsize + "px Meiryo UI";
		for( let i = 0; i < NUM_OF_CELLS; ++i ) {
			for( let j = 0; j < NUM_OF_CELLS; ++j ) {
				let cnt = 0, n;
				pctx.fillStyle = "rgba(255, 0, 0, 0.7)";
				for( let k = 0; k < NUM_OF_CELLS; ++k ) {
					if( !possibleList[NUM_OF_CELLS * i + j][k] ){
						continue;
					}

					const dx = ( fsize + 1 ) * ( k % BC | 0 );
					const dy = ( fsize + 1 ) * ( k / BC | 0 );
					pctx.fillText( k + 1, ui.getCellLeft( j ) + dx + fsize,
          	ui.getCellTop( i ) + dy + fsize );
					++cnt;
					n = k;
				}
			}
		}
	};


	var drawUsedNumber = function(){
		var tbl = ui.getCells();
    var cvs = document.createElement('canvas');
    cvs.width = WIDTH;
		cvs.height = HEIGHT;
    var ctx = cvs.getContext('2d');
		const fsize = ( CELL_SIZ * 0.7 / BC |0 );
		ctx.font = fsize + "px Meiryo UI";

		let chist = [], rhist = [], bhist = [];
		for( let i = 0; i < NUM_OF_CELLS; ++i ) {
			chist[i] = new Array(NUM_OF_CELLS).fill(0);
			rhist[i] = new Array(NUM_OF_CELLS).fill(0);
			bhist[i] = new Array(NUM_OF_CELLS).fill(0);
		}


		const possibleList = logic.suggest(tbl);
		for( let r = 0; r < NUM_OF_CELLS; ++r ) {//行，列，ブロックごとにヒストグラムを作る
			for( let c = 0; c < NUM_OF_CELLS; ++c ) {
				for( let num = 0; num < NUM_OF_CELLS; ++num ){
					if( !possibleList[ NUM_OF_CELLS * r + c ][num] ) continue;
					if( tbl[ r * NUM_OF_CELLS + c ] == 0 ){ // 入力可能な場合
            // 行、列、ブロックでその数字の箇所をインクリメント
						++chist[c][num];
						++rhist[r][num];
						++bhist[ logic.idxToBlock(c, r) ][num];
					}
				}
			}
		}

    // 端に入力可能な数を描画する
		for( let j = 0; j < NUM_OF_CELLS; ++j ) {
			ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
			for( let k = 0; k < NUM_OF_CELLS; ++k ) {
				const dx = ( fsize + 1 ) * ( k % BC | 0 ); // 表示用の小ブロック内での横位置
				const dy = ( fsize + 1 ) * ( k / BC | 0 ); // 表示用の小ブロック内での縦位置

        // 下端に列の入力可能な数を描画する
        if( chist[j][k] ) {
					ctx.fillText( k + 1, ui.getCellLeft( j ) + dx + fsize,
          ui.getCellTop( NUM_OF_CELLS ) + dy + fsize );
				}

        // 右端に行の入力可能な数を描画する
				if( rhist[j][k] ) {
					ctx.fillText( k + 1, ui.getCellLeft( NUM_OF_CELLS ) + dx + fsize,
          ui.getCellTop( j ) + dy + fsize );
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

	$(window).keydown(function( e ){
		const keyCode = e.keyCode;
		if( keyCode === keys.ctrl ){
			suggestKeydown();
    }
		if( keys.left <= keyCode && keyCode <= keys.down ){
			e.preventDefault();//prevent scroll

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

  $(window).keyup(function(e){
      if( e.keyCode === keys.ctrl ){
      	suggestKeyUp();
      }
  });

	$('#main_canvas').bind({
		'touchstart mousedown': function( evt ){
			const isTouch = evt.type === "touchstart";
			const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

			var c = ((mouseRPoint.mx - MARGIN) / CELL_SIZ + 1|0) - 1
			var r = ((mouseRPoint.my - MARGIN) / CELL_SIZ + 1|0) - 1;
			CircleKeyboard.SetCurrentPosition(c, r);

			keyboardPossibleList = logic.suggest( ui.getCells() );
			if( ui._inrange(CircleKeyboard.nowC, CircleKeyboard.nowR) ) {
				if( circleKeyboardIsEnable() ){
					circleKeyboardJob( CircleKeyboard.nowC, CircleKeyboard.nowR );
				}
			}
		},

		'touchmove mousemove': function( evt ){
			evt.preventDefault();
			const isTouch = evt.type === "touchmove";
			const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

			if( CircleKeyboard.nowC === null || CircleKeyboard.nowR === null
				|| !(ui._inrange(CircleKeyboard.nowC, CircleKeyboard.nowR)) ){
				return;
			}

			var centerX = ui.getCellLeft( CircleKeyboard.nowC ) + CELL_SIZ/2
      var centerY = ui.getCellTop( CircleKeyboard.nowR ) + CELL_SIZ/2;

			if( circleKeyboardIsEnable() ){
				const m_x = mouseRPoint.mx;
				const m_y = mouseRPoint.my;
				circleKeyboardJob( CircleKeyboard.nowC, CircleKeyboard.nowR, m_x - centerX, m_y - centerY );
			}
		},

		'touchend mouseup': function( evt ){
			const isTouch = evt.type === "touchend";
			const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

			Render.clearScreen( ctx );

			if( singleNumberKeyboardIsEnable() ){
				ui.setCell( CircleKeyboard.nowC, CircleKeyboard.nowR, SingleNumberKeyboard.currentNumber );
			}

			if(document.getElementById("keyboard_input").checked){
			}

			CircleKeyboard.nowC = null;
			CircleKeyboard.nowR = null;
			Render.drawLine(ctx, WIDTH, 0, WIDTH, HEIGHT);
			ui.refresh();
      drawSuggest();
		}
	});

};
