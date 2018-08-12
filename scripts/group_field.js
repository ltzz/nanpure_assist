var fields = [];
var BoardCnt = 0;
var selectedBoard = 0;
var GFBoardWidth = 100;

function GF_Init() {

  const table = (x) => {
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

  var addBoard = function() {
    if (BoardCnt > 5) return;
    var newBoard = {
      dragging: false,
      selected: false,
      dragoffsetx: 0,
      dragoffsety: 0,
      selected: false,
      connect: [],
      board: []
    };
    for (let i = 0; i < 9; ++i) {
      newBoard.board[i] = new Array(9).fill(0);
    }

    fields.push(newBoard);

    $("<div>", {
      class: "test",
      id: "field" + BoardCnt,
      html: table(BoardCnt),
      style: "position:absolute;top:100px;left:200px;width:" + GFBoardWidth + "px;height:" + GFBoardWidth + "px;" +
        "border:none;box-sizing:border-box;",
      mousedown: function(evt) {
        const isTouchEvent = evt.type === "touchstart";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

        var m_x = mousePoint.mx - $('#place_board').offset().left;
        var m_y = mousePoint.my - $('#place_board').offset().top;
        var b_x = mousePoint.mx - evt_parent.offset().left;
        var b_y = mousePoint.my - evt_parent.offset().top;

        const idx = evt_parent.attr("id").substr(5) | 0;
        fields[idx].dragoffsetx = b_x;
        fields[idx].dragoffsety = b_y;
        fields[idx].dragging = true;

        for (let i in fields[idx].connect) { // 結合相手から自分を消す
          fields[i].connect.splice(idx, 1);
        }
        fields[idx].connect = [];

      },
      mousemove: function(evt) {
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        var selectedidx = evt_parent.attr("id").substr(5) | 0;
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        if (fields[selectedidx].dragging) {
          const isTouchEvent = evt.type === "touchmove";

          const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

          var m_x = mousePoint.mx - $('#place_board').offset().left;
          var m_y = mousePoint.my - $('#place_board').offset().top;
          var idx = evt_parent.attr("id").substr(5) | 0;
          var ox = m_x + $('#place_board').offset().left - fields[idx].dragoffsetx;
          var oy = m_y + $('#place_board').offset().top - fields[idx].dragoffsety;
          evt_parent.offset({
            top: oy,
            left: ox
          });
        }
      },
      mouseup: function(evt) {
        const isTouchEvent = evt.type === "touchend";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);

        var m_x = mousePoint.mx - $('#place_board').offset().left;
        var m_y = mousePoint.my - $('#place_board').offset().top;
        var idx = evt_parent.attr("id").substr(5) | 0;
        var ox = m_x + $('#place_board').offset().left - fields[idx].dragoffsetx;
        var oy = m_y + $('#place_board').offset().top - fields[idx].dragoffsety;
        evt_parent.offset({
          top: oy,
          left: ox
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

        for (let i = 0; i < fields.length; ++i) {
          var fieldx = $("#field" + i);
          if (i == idx) continue;
          var dx1 = fieldx.offset().left + 2 * GFBoardWidth / 3;
          var dy1 = fieldx.offset().top  + 2 * GFBoardWidth / 3;
          var dx2 = fieldx.offset().left - 2 * GFBoardWidth / 3;
          var dy2 = fieldx.offset().top  - 2 * GFBoardWidth / 3;
          //var con = {lefttop:4,righttop:2,leftbottom:3,rightbottom:1};
          if (Math.abs(dx1 - ox) < 15 && Math.abs(dy1 - oy) < 15) {
            evt_parent.offset({
              top: dy1,
              left: dx1
            });
            fields[i].connect[idx] = con.rightbottom;
            fields[idx].connect[i] = con.lefttop;
          } else if (Math.abs(dx1 - ox) < 15 && Math.abs(dy2 - oy) < 15) {
            evt_parent.offset({
              top: dy2,
              left: dx1
            });
            fields[i].connect[idx] = con.righttop;
            fields[idx].connect[i] = con.leftbottom;
          } else if (Math.abs(dx2 - ox) < 15 && Math.abs(dy1 - oy) < 15) {
            evt_parent.offset({
              top: dy1,
              left: dx2
            });
            fields[i].connect[idx] = con.leftbottom;
            fields[idx].connect[i] = con.righttop;
          } else if (Math.abs(dx2 - ox) < 15 && Math.abs(dy2 - oy) < 15) {
            evt_parent.offset({
              top: dy2,
              left: dx2
            });
            fields[i].connect[idx] = con.lefttop;
            fields[idx].connect[i] = con.rightbottom;
          }
        }
        for (let i = 0; i < fields.length; ++i) {
          fields[i].selected = false;
          $("#field" + i + " ." + conclass.rightbottom).css("background-color", "none");
          $("#field" + i + " ." + conclass.righttop).css("background-color", "none");
          $("#field" + i + " ." + conclass.leftbottom).css("background-color", "none");
          $("#field" + i + " ." + conclass.lefttop).css("background-color", "none");

          $("#field" + i).css("border", "none");
          for (var j in fields[i].connect) {
            var connect = fields[i].connect[j];
            $("#field" + i + " ." + conclass2[connect]).css("background-color", "#ffffcc");
            var board1 = fields[i].board;
            var board2 = fields[j].board;
            const con_table = [
              [0, 0, 6, 6],
              [6, 0, 0, 6],
              [6, 6, 6, 0],
              [6, 6, 0, 0]
            ];
            var x1 = con_table[connect][0];
            var y1 = con_table[connect][1];
            var x2 = con_table[connect][2];
            var y2 = con_table[connect][3];
            for (let a = 0; a < 3; ++a) {
              for (let b = 0; b < 3; ++b) {
                board2[y2 + a][x2 + b] = board1[y1 + a][x1 + b];
              }
            }

          }
        }
        fields[idx].dragging = false;
        (new UI()).switchBoard(idx);
        $("#field" + idx).css("border", "thin solid #ff6666");
      }
    }).appendTo("#place_board");
    BoardCnt++;
    //$("#place_board").appendChild();
  }

  addBoard();

  $("#delete_board").mousedown(function() {
    if (fields.length === 1) return;
    if (confirm("盤面を消去します")) {
      fields.splice(selectedBoard, 1);
      $("#field" + selectedBoard).remove();
      selectedBoard = 0;
      BoardCnt -= 1;
      //clearBoard();
      for (let i in fields) {
        fields[i].dragging = false;
      }
    }
  });

  $('#place_board').mouseup(function(evt) {
    for (let i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      const isTouchEvent = evt.type === "touchend";
      const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);
      var m_x = mousePoint.mx - $('#place_board').offset().left;
      var m_y = mousePoint.my - $('#place_board').offset().top;
      var ox = m_x + $('#place_board').offset().left - fields[i].dragoffsetx;
      var oy = m_y + $('#place_board').offset().top - fields[i].dragoffsety;
      $("#field" + i).offset({
        top: oy,
        left: ox
      });
      fields[i].dragging = false;
    }
  });

  $('#place_board').mousemove(function(evt) {
    for (let i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      const isTouchEvent = evt.type === "touchend";
      const mousePoint = getPointFromMouseEvent(evt, isTouchEvent);
      var m_x = mousePoint.mx - $('#place_board').offset().left;
      var m_y = mousePoint.my - $('#place_board').offset().top;
      var ox = m_x + $('#place_board').offset().left - fields[i].dragoffsetx;
      var oy = m_y + $('#place_board').offset().top - fields[i].dragoffsety;
      $("#field" + i).offset({
        top: oy,
        left: ox
      });
    }
  });

  $("#add_board").mousedown(addBoard);

}
