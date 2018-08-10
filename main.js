

var selectedPos = [0,0];


var singleNumberKeyboard_currentNumber = 0; //単数字入力の現在の選択数字
var singleNumberKeyboard_generateKey = function(){
	let str = "";
	for(let i=0; i < NUM_OF_CELLS + 1; ++i){
		const onclickcode = "singleNumberKeyboard_selectKey(" + i + ");";
		str += `<div id='key${i}' class='number_select_key noselectable'
 onmousedown='${onclickcode}'>${i}</div>`;
	}
	str += "<div style='clear: both'></div>"; //float解除，はみ出し防止
	document.getElementById("number_keyboard").innerHTML = str;
}

var singleNumberKeyboard_selectKey = function(num){
	singleNumberKeyboard_currentNumber = num;
	for(let i=0; i < NUM_OF_CELLS + 1; ++i){
		document.getElementById("key"+i).style.backgroundColor = "#ffffff";
	}
	document.getElementById("key"+num).style.backgroundColor = "#cccccc";
}

var ui;
window.onload = function(){
	ui = ( function(){
			function getCellLeft( x ){
				return MARGIN + (CELL_SIZ-1) * x;
			};
			function getCellTop( y ){
				return MARGIN + (CELL_SIZ-1) * y;
			};
			function _cellid( c, r ){
				return "cell" + r + "_" + c;
			};
			function _inrange( c, r ){
				const inrangec = 0 <= c && c < NUM_OF_CELLS;
				const inranger = 0 <= r && r < NUM_OF_CELLS;
				return inrangec && inranger;
			};
			function getCellElement( x, y ){
				return $( "#" + _cellid( x, y ) );
			};

			function getCell( x, y ){
				return fields[selectedBoard].board[y][x];
				//return $( "#" + _cellid( x, y ) ).html()|0;
			};

			function getCells(){
				let tbl = new Array( NUM_OF_CELLS * NUM_OF_CELLS );
				for( let i = 0; i < NUM_OF_CELLS; ++i ){
					for( let j = 0; j < NUM_OF_CELLS; ++j ){
						tbl[i * NUM_OF_CELLS + j] = getCell( j, i );
					}
				}
				return tbl;
			};

			function setCell( x, y, num ){
				$( "#" + _cellid( x, y ) ).html( ( num != 0 ) ? num : "<br>" );
				fields[selectedBoard].board[y][x] = num;
			};

			function setCells( tbl ){
					for( let i = 0; i < NUM_OF_CELLS; ++i )
						for( let j = 0; j < NUM_OF_CELLS; ++j )
							setCell( j, i, tbl[i * NUM_OF_CELLS + j] );
			};

			function refresh(){
				const logic = new Logic(NUM_OF_CELLS, BC, BR);
				const wrong = logic.check( getCells() );
				for( let i = 0; i < NUM_OF_CELLS; ++i ) {
					for( let j = 0; j < NUM_OF_CELLS; ++j ) {
						var el = getCellElement( j, i );
						const n = getCell( j, i );
						const cdup = wrong.chist[j][n-1] > 1;
						const rdup = wrong.rhist[i][n-1] > 1;
						const bdup = wrong.bhist[ logic.idxToBlock( j, i ) ][n-1] > 1;
						if( cdup || rdup || bdup ){// 重複がある場合
							el.css('color', '#ff0000');
						}
						else
						{
							el.css('color', '#000000');
						}
					}
				}
			}

			function switchBoard(bnum){
				selectedBoard = bnum;
				for( let i　=　0; i　<　NUM_OF_CELLS; ++i ){
					for( let j　=　0; j　<　NUM_OF_CELLS; ++j ){
					const num = fields[selectedBoard].board[i][j];
						$( "#" + _cellid( j, i ) ).html( num ? num : "<br>" );
					}
				}
			};

			function clearBoard(){
				for( let i　=　0; i < NUM_OF_CELLS; ++i ){
					for( let j　=　0; j < NUM_OF_CELLS; ++j ){
						setCell( j, i, 0 );
					}
				}
			};

			function exportBoard(){
				const tbl = getCells();
				$("textarea").val( tbl.join(',') );
			};

			function importBoard(){
				var arr = $("textarea").val().split(',');
				if( arr.length === NUM_OF_CELLS * NUM_OF_CELLS ) {
					arr.map( function(x){return x|0;} );
					setCells( arr );
				}
			};

			return {
				getCellLeft: getCellLeft,
				getCellTop: getCellTop,
				_cellid: _cellid,
				_inrange: _inrange,
				getCellElement: getCellElement,
				getCell: getCell,
				getCells: getCells,
				setCell: setCell,
				setCells: setCells,
				refresh: refresh,
				switchBoard: switchBoard,
				clearBoard: clearBoard,
				exportBoard: exportBoard,
				importBoard: importBoard
			};
		}
	());

	var nowc = null, //クリック中の列
	nowr = null; //行

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
	for( let i = 0; i < NUM_OF_CELLS; ++i ) {
		for( let j = 0; j < NUM_OF_CELLS; ++j ) {
			var cell = $("<div>");
			var cellid = ui._cellid( j, i );
			cell.attr({
				id: cellid,
				html: "<br>",
			});
			cell.addClass("cell");
			if( j % BC === 0 ) { // ブロックの左端
				cell.addClass("cell_left");
			}
			if( j % BC === BC - 1 ){ // ブロックの右端
				cell.addClass("cell_right");
			}
			if( i % BR === 0 ) { // ブロックの上端
				cell.addClass("cell_top");
			}
			if( i % BR === BR - 1 ){  // ブロックの下端
				cell.addClass("cell_bottom");
			}
			if(selectedPos[0] === j && selectedPos[1] === i){
				cell.addClass("selectedCell");
			}
			cell.css( "top", ui.getCellTop( i ) + "px" );
			cell.css( "left", ui.getCellLeft( j ) + "px" );
			$("#nu").append( cell );
		}
		var cellw = CELL_SIZ;
		var cellh = CELL_SIZ;
		$(".cell").css( {
      "width": cellw + "px",
      "height": cellh + "px",
      "font-size": CELL_SIZ * 0.7 |0 + "px" } );
	}


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

	singleNumberKeyboard_generateKey();
	singleNumberKeyboard_selectKey(0);

	Tabs();
	let keyboardPossibleList;
	var drawKeyboard = function( c, r, rx, ry )
	{

		const KEY_RADIUS   = CELL_SIZ * 1.4 * ( NUM_OF_CELLS / 10 );
		// 9x9で最適だったサイズの流用

		const OUTER_RADIUS = CELL_SIZ * 2.0 * ( NUM_OF_CELLS / 10 );
		const INNER_RADIUS = CELL_SIZ * 0.7 * ( NUM_OF_CELLS / 10 );

		var centerX = ui.getCellLeft( c ) + CELL_SIZ / 2;
		var centerY = ui.getCellTop( r ) + CELL_SIZ / 2;

		ctx.save();
		Render.clearScreen( ctx );
		ctx.globalCompositeOperation = "source-over"; //重ねて描画(既定値)
		ctx.fillStyle = "rgba(255,255,255,0.9)";
		Render.circle( ctx, centerX, centerY, OUTER_RADIUS );
    ctx.fill();
    ctx.stroke();

		ctx.globalCompositeOperation = "xor"; //重なって描画される時に透明になる
		ctx.fillStyle = "rgba(255,255,255,1.0)";
		Render.circle( ctx, centerX, centerY, INNER_RADIUS );
    ctx.fill();
    ctx.stroke();

		ctx.globalCompositeOperation = "source-over"; //重ねて描画(既定値)
		ctx.font = (CELL_SIZ * 0.7  |0) + "px Segoe UI";

		const sAngle = Math.PI * 2 / ( NUM_OF_CELLS + 1 );
		var mouseAngle = Math.atan2( rx, -ry );
		mouseAngle = ( mouseAngle > 0 ) ? mouseAngle : ( 2 * Math.PI + mouseAngle );
		var selectedNumber = ( mouseAngle / sAngle + 0.5 |0 ) % ( NUM_OF_CELLS + 1 );
		var dfc = Math.sqrt( rx * rx + ry * ry ); //中心からの距離
		var isInRange = INNER_RADIUS <= dfc && dfc < OUTER_RADIUS;

		for( let i = 0; i <= NUM_OF_CELLS; ++i ) {
			var keyAngle = i * sAngle;
			const numchr = (i === 0) ? 'C' : i;
			var chrWidth = ctx.measureText( numchr ).width;
			var keyRX =  KEY_RADIUS * Math.sin( keyAngle );
			var keyRY = -KEY_RADIUS * Math.cos( keyAngle );
			var keyX = centerX + keyRX
			var keyY = centerY + keyRY;
			
			if( selectedNumber === i && isInRange ) {
				ctx.translate( centerX, centerY );
				const keyLineAngle1 = ( i - 0.5 ) * sAngle;
				const keyLineAngle2 = ( i + 0.5 ) * sAngle;

				const sindata1 = Math.sin( keyLineAngle1 );
				const cosdata1 = Math.cos( keyLineAngle1 );

				Render.drawLine( ctx,
					+INNER_RADIUS * sindata1, -INNER_RADIUS * cosdata1,
					+OUTER_RADIUS * sindata1, -OUTER_RADIUS * cosdata1
					);

				const sindata2 = Math.sin( keyLineAngle2 );
				const cosdata2 = Math.cos( keyLineAngle2 );
				Render.drawLine( ctx,
					+INNER_RADIUS * sindata2, -INNER_RADIUS * cosdata2,
					+OUTER_RADIUS * sindata2, -OUTER_RADIUS * cosdata2
					);
				ctx.translate( -centerX, -centerY );
				//Render.circle(ctx,keyX,keyY,CELL_SIZ*0.4);ctx.stroke(); //fillに変更したい
				ui.setCell( c, r, i );
			}

			ctx.fillStyle = getKeyboardColor( keyboardPossibleList[NUM_OF_CELLS * r + c][i-1], i );

			ctx.fillText( numchr, keyX - chrWidth/2, keyY + ctx.measureText( '1' ).width/2 );
		}
		ctx.restore();
	};

	var showCountNumbers = function(){
		var tbl = ui.getCells();
		var numbers_count = new Array( NUM_OF_CELLS+1 ).fill(0);
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
				const number = predict[ NUM_OF_CELLS * i + j].number;
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
    var ctx = cvs.getContext('2d');
		const fsize = ( CELL_SIZ * 0.7 / BC |0 );
		ctx.font = fsize + "px Meiryo UI";
		for( let i = 0; i < NUM_OF_CELLS; ++i ) {
			for( let j = 0; j < NUM_OF_CELLS; ++j ) {
				let cnt = 0, n;
				ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
				for( let k = 0; k < NUM_OF_CELLS; ++k ) {
					if( !possibleList[NUM_OF_CELLS * i + j][k] ){
						continue;
					}

					const dx = ( fsize + 1 ) * ( k % BC | 0 );
					const dy = ( fsize + 1 ) * ( k / BC | 0 );
					ctx.fillText( k + 1, ui.getCellLeft( j ) + dx + fsize,
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

			if( ui._inrange( selectedPos[0] + dx, selectedPos[1] + dy ) ){ // セルの移動可能なら
				selectedPos[0] += dx;
				selectedPos[1] += dy;
			}
			var cellid = ui._cellid(selectedPos[0], selectedPos[1]);
			$(".selectedCell").removeClass("selectedCell");
			$("#" + cellid).addClass("selectedCell");
		}
		if( keys["0"] <= keyCode && keyCode <= keys["0"] + 9 ){
			ui.setCell( selectedPos[0], selectedPos[1], keyCode-keys["0"] );
			ui.refresh();
		}
		if( keyCode === keys.backspace ){
			ui.setCell( selectedPos[0], selectedPos[1], 0 );
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
			nowc = c; nowr = r;
			keyboardPossibleList = logic.suggest( ui.getCells() );
			if( ui._inrange(nowc, nowr) ) {
				if(!document.getElementById("single_number_keyboard").checked){
					drawKeyboard( nowc, nowr );
				}
			}
		},

		'touchmove mousemove': function( evt ){
			evt.preventDefault();
			const isTouch = evt.type === "touchmove";
			const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );
			const m_x = mouseRPoint.mx;
			const m_y = mouseRPoint.my;

			if( nowc === null || nowr === null || !(ui._inrange(nowc, nowr)) ){
				return;
			}

			var centerX = ui.getCellLeft( nowc ) + CELL_SIZ/2
      var centerY = ui.getCellTop( nowr ) + CELL_SIZ/2;

			if(!document.getElementById("single_number_keyboard").checked){
				drawKeyboard( nowc, nowr, m_x - centerX, m_y - centerY );
			}
		},
		'touchend mouseup': function( evt ){
			const isTouch = evt.type === "touchend";
			const mouseRPoint = getRelativePointFromMouseEvent( evt,  isTouch );

			Render.clearScreen( ctx );

			if(document.getElementById("single_number_keyboard").checked){
				ui.setCell( nowc, nowr, singleNumberKeyboard_currentNumber );
			}

			if(document.getElementById("keyboard_input").checked){
			}

			nowc = null; nowr = null;
			Render.drawLine(ctx, WIDTH, 0, WIDTH, HEIGHT);
			ui.refresh();
      drawSuggest();
		}
	});


	/* Webcam */
	var localMediaStream = null;
	var video = document.querySelector("video");
	var offsetx = 60;
	var offsety = 10
    $("#webcam_getmedia").mousedown(function(e){
    	var cvs = $("#video_covering");
    	var ctx = cvs.get(0).getContext('2d');
    	ctx.strokeStyle = "#ff0000";
    	for(let i = 0; i <= 3; ++i){
    		ctx.moveTo( offsetx + 280 * i/3, offsety + 0);
    		ctx.lineTo( offsetx + 280 * i/3, offsety + 280);
    		ctx.moveTo( offsetx + 0      , offsety + 280*i/3);
    		ctx.lineTo( offsetx + 280		 , offsety + 280*i/3);
    	}
    	ctx.stroke();
    	console.log("Video Capture Started");

		navigator.getUserMedia = navigator.getUserMedia
				|| navigator.webkitGetUserMedia
				|| navigator.mozGetUserMedia
				|| navigator.msGetUserMedia; // vendor prefix

		navigator.getUserMedia({video: true}, function(stream) {
		  video.src = window.URL.createObjectURL(stream);
		  localMediaStream = stream;
		}, function(error) {alert("カメラからの映像取得ができません")});
    });

    var nn = null;

    var imageToDataURL = function(a){
    	var canvas = document.createElement("canvas");
    	canvas.width  = a.width;
			canvas.height = a.height;
    	var ctx = canvas.getContext("2d");
    	ctx.putImageData(a, 0, 0);
    	return canvas.toDataURL('image/png');
    }

    $("#webcam_getimg").mousedown(function(e){
    	var timer_st = new Date;


    	//リサイズの必要あり
		if (localMediaStream) {
			var cvs = $("<canvas>").get(0);
			cvs.width = 400;
			cvs.height = 300;
			var ctx = cvs.getContext('2d');
			ctx.drawImage(video, 0, 0, cvs.width, cvs.height);

			var dat = ctx.getImageData(60, 10, 280, 280);
			var inputData = dat.data;
			for( let y = 0; y < dat.height; ++y ){
				for( let x = 0; x < dat.width; ++x ){
					var th = 140;
					var idx = (y * dat.width + x);
					var valr = inputData[ idx * 4 + 0 ];
					var valg = inputData[ idx * 4 + 1 ];
					var valb = inputData[ idx * 4 + 2 ];
					var gray = (valr + valg + valb)/3|0;
					//var bin = (gray > th) ? 255 : 0;
					inputData[ idx * 4 + 0 ] = gray;
					inputData[ idx * 4 + 1 ] = gray;
					inputData[ idx * 4 + 2 ] = gray;

				}
			}

			var tmp = $("#recognition_result").get(0);
			tmp.width = 280;tmp.height = 280;
			var tctx = tmp.getContext('2d');
			tctx.putImageData(dat, 0, 0);


			var dbg = $("#webcam_debug_canvas").get(0);
			var dbgx = dbg.getContext('2d');


    		if(!nn){
    			nn = new NN(784,100,10);
    			nn.load();
    		}

    		$("#webcam_message").text("preparing neural network...");
    		var square_images = [];
    		var NNloadCnt = 0;
    		var NNload = function(){
    			++NNloadCnt;
    			if( NNloadCnt == 1000 ) return;
    			if(nn.prepare() == 2){
    				$("#webcam_message").text("");
    			var parr = [];
					for(let i = 0; i < 9; ++i){
						for(let j = 0; j < 9; ++j){
							var square = tctx.getImageData( j * 31+1, i*31+1, 28, 28 );
							var retarr = NNproc(square, nn);
							parr[i*9+j] = retarr[0];
							square_images[ i * 9 + j ] = retarr[1];
							dbgx.putImageData( retarr[1], j*33+1, i*33+1 );
						}
					}
					console.log((new Date).getTime() - timer_st + "ms");
					//self test
					var tmpl = new TempleteMatch("Arial");//test you
					var ans = ui.getCells();
					var testok = 0;
					for(var i=0; i < 9 * 9; ++i){
						var x = i % 9, y = i / 9 |0;
						tctx.font = "16px sans-serif";
						tctx.strokeStyle = "rgba(255,200,60,0.8)";
						tctx.strokeText(parr[i], x*31+1 +5,y*31+1 +10);
						if( parr[i] == ans[i] ){
							++testok;
						}else{

							for(let j=0; j < 28*28; ++j){
								if( parr[i] ){
									var val1 = 0xff - tmpl.templates[ parr[i]-1 ][j];
									val1 = val1 > 0 ? 0 : val1;
									var val2 = val1 > 0xc0 ? 0 : square_images[i][ 4 * j + 0 ];
									var data1 = square_images;
									data1[i][ 4 * j + 0 ] = val2;
									data1[i][ 4 * j + 1 ] = val2;
									data1[i][ 4 * j + 2 ] = val1;
								}
							}

							$("#webcam_debug_elm").append("<img src='" + imageToDataURL(square_images[i])+"'>");
						}
					}
					ui.setCells( parr );
					console.log("self test result: " + testok + "/81 ( " + (testok/81*100).toFixed(1)+"% )");

					return;
    			}else if(nn.prepare() == 1){
    				$("#webcam_message").text("preparing neural network...1/2");
    			}

    			setTimeout(NNload,100);
    		}
			setTimeout(NNload,100);
			//document.querySelector('img').src = cvs.toDataURL('image/png');
    	}
    });
};
