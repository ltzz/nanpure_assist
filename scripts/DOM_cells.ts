
function setupCells(){
  for( let i = 0; i < NUM_OF_CELLS; ++i ) {
    for( let j = 0; j < NUM_OF_CELLS; ++j ) {
      var cell = $("<div>");
      const cellid = ui._cellid( j, i );
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
      if(CellInput.selectedPos[0] === j && CellInput.selectedPos[1] === i){
        cell.addClass("selectedCell");
      }
      cell.css( "top", ui.getCellTop( i ) + "px" );
      cell.css( "left", ui.getCellLeft( j ) + "px" );
      $("#nu").append( cell );
    }
    $(".cell").css( {
      "width": CELL_SIZ + "px",
      "height": CELL_SIZ + "px",
      "font-size": Math.floor( CELL_SIZ * 0.7 ).toString(10) + "px" } );
  }
}
