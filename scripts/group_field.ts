let fields = [];
const GFBoardWidth = 100;

class FieldGroupManage {
  static selectedBoard = 0;
  static boardCnt = 0;
  static generateTable(x) {
    let ret = "<table class='gf_field'>";
    for (let i = 0; i < 3; ++i) {
      ret += "<tr>";
      for (let j = 0; j < 3; ++j) {
        if (i == 0 && j == 0) ret += "<td>" + x + "</td>";
        else ret += `<td class='grid${i}_${j}'><br></td>`;
      }
      ret += "</tr>";
    }
    ret += "</table>";
    return ret;
  }

  static switchBoard(bnum){
    FieldGroupManage.selectedBoard = bnum;
    ui.setCellsDim2( fields[FieldGroupManage.selectedBoard].board );
  }
}

function GF_Init() {

  var addBoard = function() {
    if (FieldGroupManage.boardCnt > 5) return;
    var newBoard = {
      dragging: false,
      selected: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      connect: [],
      board: []
    };

    const BoardColumns = NUM_OF_CELLS;
    const BoardRows    = NUM_OF_CELLS;

    for (let i = 0; i < BoardRows; ++i) {
      newBoard.board[i] = new Array(BoardColumns).fill(0);
    }

    fields.push(newBoard);

    $("<div>", {
      class: "test",
      id: "field" + FieldGroupManage.boardCnt,
      html: FieldGroupManage.generateTable(FieldGroupManage.boardCnt),
      style: "position:absolute;top:100px;left:200px;width:" + GFBoardWidth + "px;height:" + GFBoardWidth + "px;" +
        "border:none;box-sizing:border-box;",
      mousedown: function(evt) {
        const isTouchEvent = evt.type === "touchstart";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

        var b_x = mousePoint.mx - evt_parent.offset().left;
        var b_y = mousePoint.my - evt_parent.offset().top;

        const idx :number = parseInt( evt_parent.attr("id").substr(5) );
        fields[idx].dragOffsetX = b_x;
        fields[idx].dragOffsetY = b_y;
        fields[idx].dragging = true;

        for (let i in fields[idx].connect) { // 結合相手から自分を消す
          fields[i].connect.splice(idx, 1);
        }
        fields[idx].connect = [];

      },
      mousemove: function(evt) {
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        var selectedidx = parseInt( evt_parent.attr("id").substr(5) );
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        if (fields[selectedidx].dragging) {
          const isTouchEvent = evt.type === "touchmove";

          const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

          const idx = parseInt( evt_parent.attr("id").substr(5) );

          const oxy = getDragOffset( mousePoint, idx );
          evt_parent.offset({
            top:  oxy.oy,
            left: oxy.ox
          });
        }
      },
      mouseup: function(evt) {
        const isTouchEvent = evt.type === "touchend";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

        const idx = parseInt( evt_parent.attr("id").substr(5) );

        const oxy = getDragOffset( mousePoint, idx );
        evt_parent.offset({
          top: oxy.oy,
          left: oxy.ox
        });

        const con = {
          lefttop: 0,
          righttop: 1,
          leftbottom: 2,
          rightbottom: 3
        };
        const conclass = {
          lefttop: "grid0_0",
          righttop: "grid0_2",
          leftbottom: "grid2_0",
          rightbottom: "grid2_2"
        };
        const conclass2 = ["grid0_0", "grid0_2", "grid2_0", "grid2_2"];

        for (let from = 0; from < fields.length; ++from) {
          var fieldx = $("#field" + from);
          if (from === idx) continue;
          const moveBaseOffset = 2 * GFBoardWidth / 3;
          const dx1 = fieldx.offset().left + moveBaseOffset;
          const dy1 = fieldx.offset().top  + moveBaseOffset;
          const dx2 = fieldx.offset().left - moveBaseOffset;
          const dy2 = fieldx.offset().top  - moveBaseOffset;
          const ConnectThresSizePx = 15;
          //var con = {lefttop:4,righttop:2,leftbottom:3,rightbottom:1};
          if (Math.abs(dx1 - oxy.ox) < ConnectThresSizePx && Math.abs(dy1 - oxy.oy) < ConnectThresSizePx) {
            evt_parent.offset({
              top:  dy1,
              left: dx1
            });
            fields[from].connect[idx] = con.rightbottom;
            fields[idx].connect[from] = con.lefttop;
          } else if (Math.abs(dx1 - oxy.ox) < ConnectThresSizePx && Math.abs(dy2 - oxy.oy) < ConnectThresSizePx) {
            evt_parent.offset({
              top:  dy2,
              left: dx1
            });
            fields[from].connect[idx] = con.righttop;
            fields[idx].connect[from] = con.leftbottom;
          } else if (Math.abs(dx2 - oxy.ox) < ConnectThresSizePx && Math.abs(dy1 - oxy.oy) < ConnectThresSizePx) {
            evt_parent.offset({
              top:  dy1,
              left: dx2
            });
            fields[from].connect[idx] = con.leftbottom;
            fields[idx].connect[from] = con.righttop;
          } else if (Math.abs(dx2 - oxy.ox) < ConnectThresSizePx && Math.abs(dy2 - oxy.oy) < ConnectThresSizePx) {
            evt_parent.offset({
              top:  dy2,
              left: dx2
            });
            fields[from].connect[idx] = con.lefttop;
            fields[idx].connect[from] = con.rightbottom;
          }
        }

        for (let i = 0; i < fields.length; ++i) {
          fields[i].selected = false;
          $("#field" + i + " ." + conclass.rightbottom ).css("background-color", "none");
          $("#field" + i + " ." + conclass.righttop    ).css("background-color", "none");
          $("#field" + i + " ." + conclass.leftbottom  ).css("background-color", "none");
          $("#field" + i + " ." + conclass.lefttop     ).css("background-color", "none");

          $("#field" + i).css("border", "none");
          for (let j in fields[i].connect) {
            const connect = fields[i].connect[j];
            $("#field" + i + " ." + conclass2[connect]).css("background-color", "#ffffcc");
            const board1 = fields[i].board;
            const board2 = fields[j].board;
            const con_table = [ //★9*9前提になっている 要修正
              [0, 0, 6, 6],
              [6, 0, 0, 6],
              [6, 6, 6, 0],
              [6, 6, 0, 0]
            ];
            const x1 = con_table[connect][0];
            const y1 = con_table[connect][1];
            const x2 = con_table[connect][2];
            const y2 = con_table[connect][3];
            for (let a = 0; a < 3; ++a) {
              for (let b = 0; b < 3; ++b) {
                board2[y2 + a][x2 + b] = board1[y1 + a][x1 + b]; // 重なってるところは値のコピー
              }
            }

          }
        }
        fields[idx].dragging = false;
        FieldGroupManage.switchBoard(idx);
        $("#field" + idx).css("border", "thin solid #ff6666");
      }
    }).appendTo("#place_board");
    FieldGroupManage.boardCnt++;
    //$("#place_board").appendChild();
  }

  addBoard();

  $("#delete_board").mousedown(function() {
    if ( fields.length === 1 ) return;
    if ( confirm("盤面を消去します") ) {
      fields.splice(FieldGroupManage.selectedBoard, 1);
      $("#field" + FieldGroupManage.selectedBoard).remove();
      FieldGroupManage.selectedBoard = 0;
      FieldGroupManage.boardCnt -= 1;
      //clearBoard();
      for (let i in fields) {
        fields[i].dragging = false;
      }
    }
  });

  $('#place_board').mouseup(function(evt) {
    const isTouchEvent = evt.type === "touchend";
    for (let i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      moveBoardJob( evt, isTouchEvent, i );
      fields[i].dragging = false;
    }
  });

  $('#place_board').mousemove(function(evt) {
    const isTouchEvent = evt.type === "touchend";
    for (let i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      moveBoardJob( evt, isTouchEvent, i );
    }
  });

  $("#add_board").mousedown(addBoard);

}

function moveBoardJob(evt, isTouchEvent, boardId){
  const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);
  const mouseRPoint = getRelativePointFG( mousePoint );
  var ox = mouseRPoint.mx + $('#place_board').offset().left - fields[boardId].dragOffsetX;
  var oy = mouseRPoint.my + $('#place_board').offset().top  - fields[boardId].dragOffsetY;
  $("#field" + boardId).offset({
    top: oy,
    left: ox
  });
}


function getDragOffset( mousePoint, idx ){
  const mouseRPoint = getRelativePointFG( mousePoint );
  var ox = mouseRPoint.mx + $('#place_board').offset().left - fields[idx].dragOffsetX;
  var oy = mouseRPoint.my + $('#place_board').offset().top  - fields[idx].dragOffsetY;
  return {
    ox: ox,
    oy: oy
  };
}
