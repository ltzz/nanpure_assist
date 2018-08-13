let ui = ( function(){
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
          if( cdup || rdup || bdup ) {// 重複がある場合
            el.css('color', '#ff0000');
          }
          else {
            el.css('color', '#000000');
          }
        }
      }
    }

    function switchBoard(bnum){
      selectedBoard = bnum;
      for( let i　=　0; i　<　NUM_OF_CELLS; ++i ) {
        for( let j　=　0; j　<　NUM_OF_CELLS; ++j ) {
        const num = fields[selectedBoard].board[i][j];
          $( "#" + _cellid( j, i ) ).html( num ? num : "<br>" );
        }
      }
    };

    function clearBoard(){
      for( let i　=　0; i < NUM_OF_CELLS; ++i ) {
        for( let j　=　0; j < NUM_OF_CELLS; ++j ) {
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
