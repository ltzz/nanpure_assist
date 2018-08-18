class ui {
    static getCellLeft( x ){
      return MARGIN + (CELL_SIZ-1) * x;
    }

    static getCellTop( y ){
      return MARGIN + (CELL_SIZ-1) * y;
    }

    static _cellid( c, r ){
      return "cell" + r + "_" + c;
    }

    static _inrange( c, r ){
      const inrangec = 0 <= c && c < NUM_OF_CELLS;
      const inranger = 0 <= r && r < NUM_OF_CELLS;
      return inrangec && inranger;
    }

    static getCellElement( x, y ){
      return $( "#" + ui._cellid( x, y ) );
    }

    static getCell( x, y ){
      return fields[selectedBoard].board[y][x];
      //return $( "#" + _cellid( x, y ) ).html()|0;
    }

    static getCells(){
      let tbl = new Array( NUM_OF_CELLS * NUM_OF_CELLS );
      Field.each( (c,r) => {
          tbl[r * NUM_OF_CELLS + c] = ui.getCell( c, r );
      } );
      return tbl;
    }

    static setCell( x, y, num ){
      $( "#" + ui._cellid( x, y ) ).html( ( num != 0 ) ? num : "<br>" );
      fields[selectedBoard].board[y][x] = num;
    }

    static setCells( tbl ){
        Field.each( (c,r) => {
            ui.setCell( c, r, tbl[r * NUM_OF_CELLS + c] );
        } );
    }

    static setCellsDim2( tbl ){
      // 入力を2次元配列とする場合こっち
        Field.each( (c,r) => {
            ui.setCell( c, r, tbl[r][c] );
        } );
    }


    static refresh(){
      const logic = new Logic(NUM_OF_CELLS, BC, BR);
      const wrong = logic.check( ui.getCells() );
      Field.each( (c,r) => {
        var el = ui.getCellElement( c, r );
        const n = ui.getCell( c, r );
        const cdup = wrong.chist[c][n-1] > 1;
        const rdup = wrong.rhist[r][n-1] > 1;
        const bdup = wrong.bhist[ logic.idxToBlock( c, r ) ][n-1] > 1;
        if( cdup || rdup || bdup ) {// 重複がある場合
          el.css('color', '#ff0000');
        }
        else {
          el.css('color', '#000000');
        }
      } );
    }

    static clearBoard(){
      Field.each( (c,r) => {
          ui.setCell( c, r, 0 );
      } );
    };

    static exportBoard(){
      const tbl = ui.getCells();
      $("textarea").val( tbl.join(',') );
    };

    static importBoard(){
      var arr = $("textarea").val().split(',');
      if( arr.length === NUM_OF_CELLS * NUM_OF_CELLS ) {
        arr.map( (x) => (x|0) );
        ui.setCells( arr );
      }
    }

  }
