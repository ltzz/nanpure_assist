var fields = [];
var BoardCnt = 0;
var selectedBoard = 0;
var GFBoardWidth = 100;

function GF_Init() {

  var table = function(x) {
    var ret = "<table class='gf_field'>";
    for (var i = 0; i < 3; ++i) {
      ret += "<tr>";
      for (var j = 0; j < 3; ++j) {
        if (i == 0 && j == 0) ret += "<td>" + x + "</td>";
        else ret += "<td class='grid" + i + "_" + j + "'><br></td>";
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
    for (var i = 0; i < 9; ++i) {
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
        var isTouch = evt.type === "touchstart";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        var pageX = (isTouch ? evt.originalEvent.changedTouches[0].pageX : evt.pageX);
        var pageY = (isTouch ? evt.originalEvent.changedTouches[0].pageY : evt.pageY);
        var m_x = pageX - $('#place_board').offset().left;
        var m_y = pageY - $('#place_board').offset().top;
        var b_x = pageX - evt_parent.offset().left;
        var b_y = pageY - evt_parent.offset().top;

        var idx = evt_parent.attr("id").substr(5) | 0;
        fields[idx].dragoffsetx = b_x;
        fields[idx].dragoffsety = b_y;
        fields[idx].dragging = true;

        for (var i in fields[idx].connect) { // 結合相手から自分を消す
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
          var isTouch = evt.type === "touchmove";

          var pageX = (isTouch ? evt.originalEvent.changedTouches[0].pageX : evt.pageX);
          var pageY = (isTouch ? evt.originalEvent.changedTouches[0].pageY : evt.pageY);
          var m_x = pageX - $('#place_board').offset().left;
          var m_y = pageY - $('#place_board').offset().top;
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
        var isTouch = evt.type === "touchend";
        var evt_parent_id = $(evt.target).parents("div")[0].id;
        var evt_parent = $("#" + evt_parent_id);
        if (evt_parent_id.substr(0, 5) != "field") return; //端で親要素のIDが返る対策
        var pageX = (isTouch ? evt.originalEvent.changedTouches[0].pageX : evt.pageX);
        var pageY = (isTouch ? evt.originalEvent.changedTouches[0].pageY : evt.pageY);
        var m_x = pageX - $('#place_board').offset().left;
        var m_y = pageY - $('#place_board').offset().top;
        var idx = evt_parent.attr("id").substr(5) | 0;
        var ox = m_x + $('#place_board').offset().left - fields[idx].dragoffsetx;
        var oy = m_y + $('#place_board').offset().top - fields[idx].dragoffsety;
        evt_parent.offset({
          top: oy,
          left: ox
        });

        var con = {
          lefttop: 0,
          righttop: 1,
          leftbottom: 2,
          rightbottom: 3
        };
        var conclass = {
          lefttop: "grid0_0",
          righttop: "grid0_2",
          leftbottom: "grid2_0",
          rightbottom: "grid2_2"
        };
        var conclass2 = ["grid0_0", "grid0_2", "grid2_0", "grid2_2"];

        for (var i = 0; i < fields.length; ++i) {
          var fieldx = $("#field" + i);
          if (i == idx) continue;
          var dx1 = fieldx.offset().left + 2 * GFBoardWidth / 3;
          var dy1 = fieldx.offset().top + 2 * GFBoardWidth / 3;
          var dx2 = fieldx.offset().left - 2 * GFBoardWidth / 3;
          var dy2 = fieldx.offset().top - 2 * GFBoardWidth / 3;
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
        for (var i = 0; i < fields.length; ++i) {
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
            var con_table = [
              [0, 0, 6, 6],
              [6, 0, 0, 6],
              [6, 6, 6, 0],
              [6, 6, 0, 0]
            ];
            var x1 = con_table[connect][0];
            var y1 = con_table[connect][1];
            var x2 = con_table[connect][2];
            var y2 = con_table[connect][3];
            for (var a = 0; a < 3; ++a) {
              for (var b = 0; b < 3; ++b) {
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
      for (var i in fields) {
        fields[i].dragging = false;
      }
    }
  });

  $('#place_board').mouseup(function(evt) {
    for (var i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      var isTouch = evt.type === "touchend";
      var pageX = (isTouch ? evt.originalEvent.changedTouches[0].pageX : evt.pageX);
      var pageY = (isTouch ? evt.originalEvent.changedTouches[0].pageY : evt.pageY);
      var m_x = pageX - $('#place_board').offset().left;
      var m_y = pageY - $('#place_board').offset().top;
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
    for (var i = 0; i < fields.length; ++i) {
      if (!fields[i].dragging) continue;
      var isTouch = evt.type === "touchend";
      var pageX = (isTouch ? evt.originalEvent.changedTouches[0].pageX : evt.pageX);
      var pageY = (isTouch ? evt.originalEvent.changedTouches[0].pageY : evt.pageY);
      var m_x = pageX - $('#place_board').offset().left;
      var m_y = pageY - $('#place_board').offset().top;
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
