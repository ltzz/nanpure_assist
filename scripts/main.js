
window.onload = function(){

	MouseCellSelect.nowC = 0; //クリック中の列
	MouseCellSelect.nowR = 0; //行
	MouseCellSelect.enable = false;

	GF_Init();

	//var ui = new UI();
	logic = new Logic(NUM_OF_CELLS, BC, BR);

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
		ctx.save();
		drawUsedNumber(ctx);
		ctx.restore();
	}

	var usedNumberKeyUp = function(){
    Render.clearScreen( ctx );
    drawSuggest();
	}

	ctx = CanvasManage.mainCanvasInit();
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
		'touchstart mousedown': mainMouseDownEvent,
		'touchmove mousemove' : mainMouseMoveEvent,
		'touchend mouseup'    : mainMouseUpEvent
	});

};
