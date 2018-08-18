/**
 * @fileoverview 計算用ロジック
 */


'use strict';

/**
 * Logic - セル数にかかわらず一般化できるロジック
 *
 * @param  {type} NUM_OF_CELLS 1行、1列、1ブロックのセル数
 * @param  {type} BC           ブロックの横のセル数
 * @param  {type} BR           ブロックの縦のセル数
 */
class Logic {

  constructor(NUM_OF_CELLS, BC, BR) {
    this.NUM_OF_CELLS = NUM_OF_CELLS;
    this.BC = BC;
    this.BR = BR;
    this.TOTAL_CELLS = NUM_OF_CELLS * NUM_OF_CELLS;
  }

  idxToBlock(c, r) {
    return (r / BR | 0) * BR + (c / BC | 0);
  }

  check(arr) {
    const NUM_OF_CELLS = this.NUM_OF_CELLS;
    const BC = this.BC,
      BR = this.BR;
    let ret = [];
    let chist = [],
      rhist = [],
      bhist = [];

    for (let i = 0; i < NUM_OF_CELLS; ++i) {
      //chist[i] = new Array(NUM_OF_CELLS).fill(0);
      //rhist[i] = new Array(NUM_OF_CELLS).fill(0);
      //bhist[i] = new Array(NUM_OF_CELLS).fill(0);
      chist[i] = new Array(NUM_OF_CELLS);
      rhist[i] = new Array(NUM_OF_CELLS);
      bhist[i] = new Array(NUM_OF_CELLS);
      for (let j = 0; j < NUM_OF_CELLS; ++j) {
        chist[i][j] = 0;
        bhist[i][j] = 0;
        rhist[i][j] = 0;
      }
    }

    let maxcnt = 0;
    for (let r = 0; r < NUM_OF_CELLS; ++r) {
      for (let c = 0; c < NUM_OF_CELLS; ++c) {
        const val = arr[r * NUM_OF_CELLS + c] - 1;
        if (val >= 0) {
          maxcnt = Math.max(++chist[c][val], maxcnt);
          maxcnt = Math.max(++rhist[r][val], maxcnt);
          maxcnt = Math.max(++bhist[this.idxToBlock(c, r)][val], maxcnt);
        }
      }
    }
    ret.chist = chist;
    ret.rhist = rhist;
    ret.bhist = bhist;
    ret.valid = (maxcnt >= 2) ? false : true;
    return ret;
  }

  solver(tbl) {
    const NUM_OF_CELLS = this.NUM_OF_CELLS;
    const TOTAL_CELLS = this.TOTAL_CELLS;
    let Q = [],
      ans = null;
    Q.push(tbl.concat());
    while ( Q.length ) {
      let arr = Q.pop(),
        i;
      if ( !this.check(arr).valid ) continue;
      for (i = 0; i < TOTAL_CELLS; ++i) {
        if (arr[i] == 0) {
          for (let j = 1; j <= NUM_OF_CELLS; ++j) {
            arr[i] = j;
            Q.push(arr.concat());
          }
          break;
        }
      }
      if (i === TOTAL_CELLS) {
        ans = arr;
        break;
      }
    }
    if (ans) { //解答を出力
      // console.log( ans.join(',') );
      return ans;
    }
  }

  suggest( tbl ) {
    let possibleList = new Array(NUM_OF_CELLS * NUM_OF_CELLS);
    for (let i = 0; i < NUM_OF_CELLS; ++i) {
      for (let j = 0; j < NUM_OF_CELLS; ++j) {
        possibleList[i * NUM_OF_CELLS + j] = new Array(NUM_OF_CELLS).fill(true);
        /*possibleList[i*NUM_OF_CELLS+j] = [];
        for( var k=0; k<NUM_OF_CELLS; ++k ) possibleList[i*NUM_OF_CELLS+j][k] = true;*/
      }
    }

    for (let r = 0; r < NUM_OF_CELLS; ++r) {
      for (let c = 0; c < NUM_OF_CELLS; ++c) {
        if (tbl[r * NUM_OF_CELLS + c]) {
          const val = tbl[r * NUM_OF_CELLS + c] - 1;
          const br = r / BR | 0,
            bc = c / BC | 0;
          for (let i = 0; i < NUM_OF_CELLS; ++i) {
            //該当ブロックのその数字を消す
            possibleList[NUM_OF_CELLS * (BC * br + (i / BC | 0)) + BC * bc + (i % BC)][val] = false;
            // ★↑ここの添字おかしい？
            //該当行のその数字を消す
            possibleList[NUM_OF_CELLS * r + i][val] = false;
            //該当列のその数字を消す
            possibleList[NUM_OF_CELLS * i + c][val] = false;
          }
        }
      }
    }
    return possibleList;
  };

  PL2Ans(possibleList, tbl) {
    let chist = [],
      rhist = [],
      bhist = [];

    for (let i = 0; i < NUM_OF_CELLS; ++i) {
      chist[i] = new Array(NUM_OF_CELLS).fill(0);
      rhist[i] = new Array(NUM_OF_CELLS).fill(0);
      bhist[i] = new Array(NUM_OF_CELLS).fill(0);
    }

    for (let r = 0; r < NUM_OF_CELLS; ++r) { //行，列，ブロックごとにヒストグラムを作る
      for (let c = 0; c < NUM_OF_CELLS; ++c) {
        for (let num = 0; num < NUM_OF_CELLS; ++num) {
          if (possibleList[NUM_OF_CELLS * r + c][num] && tbl[r * NUM_OF_CELLS + c] == 0) {
            ++chist[c][num];
            ++rhist[r][num];
            ++bhist[this.idxToBlock(c, r)][num];
          }
        }
      }
    }

    let result = [];
    for (let i = 0; i < NUM_OF_CELLS; ++i) {
      for (let j = 0; j < NUM_OF_CELLS; ++j) {
        result[NUM_OF_CELLS * i + j] = {
          "number": -1,
          "ansType": -1
        };
        var val = tbl[i * NUM_OF_CELLS + j];
        if (val != 0) continue; //既に数字がある時は候補を出さない
        let cnt = 0,
          n;
        for (var k = 0; k < NUM_OF_CELLS; ++k) {
          if (possibleList[NUM_OF_CELLS * i + j][k]) {
            ++cnt;
            n = k;
          }
        }

        if (cnt === 1) { //あるマスで可能な数字が1つのみ
          result[NUM_OF_CELLS * i + j] = {
            "number": n + 1,
            "ansType": 0
          };
        }

        for (let k = 0; k < NUM_OF_CELLS; ++k) {
          if (possibleList[NUM_OF_CELLS * i + j][k] &&
            (chist[j][k] === 1 || rhist[i][k] === 1 || bhist[this.idxToBlock(j, i)][k] === 1)
          ) { //まとまりの中でそのマスしかその数字が入らない時
            result[NUM_OF_CELLS * i + j] = {
              "number": k + 1,
              "ansType": 1
            };
            break;
          }
        }

      }
    }
    return result;
  };

  TKMethod(tbl) { //T.K氏の方法
    var possibleList = this.suggest(tbl);
    var row_possible = []; //行について、，入る事が分かっている数字
    var col_possible = [];
    for (var i = 0; i < NUM_OF_CELLS; ++i) {
      row_possible[i] = new Array(NUM_OF_CELLS).fill(true);
      col_possible[i] = new Array(NUM_OF_CELLS).fill(true);
      /*
        row_possible[i] = [];
        col_possible[i] = [];
        for( var j=0; j<NUM_OF_CELLS; ++j ) {
            row_possible[i][j] = true;
            col_possible[i][j] = true;
        }
      */
    }

    let ok = true;
    var turn = 0;
    do {
      ok = true;
      for (let num = 0; num < NUM_OF_CELLS; ++num) {
        for (let i = 0; i < BR; ++i) {
          for (let j = 0; j < BC; ++j) {
            let minx = NUM_OF_CELLS,
              miny = NUM_OF_CELLS;
            let maxx = 0,
              maxy = 0;
            //各ブロックについて
            for (let k = 0; k < BC; ++k) {
              for (let l = 0; l < BR; ++l) {
                var cy = i * BC + k,
                  cx = j * BR + l;
                if (possibleList[cy * NUM_OF_CELLS + cx][num]
                  　&& tbl[cy * NUM_OF_CELLS + cx] == 0) {
                  minx = Math.min(minx, cx);
                  maxx = Math.max(maxx, cx);
                  miny = Math.min(miny, cy);
                  maxy = Math.max(maxy, cy);
                }
              }
            }
            if (minx == maxx && miny != maxy) {
              console.log("x = " + maxx, "y = " + [miny, maxy].join(","), "num=" + (num + 1));
              col_possible[maxx][num] = false;
              for (let p = 0; p < NUM_OF_CELLS; ++p) {
                if (miny <= p && p <= maxy) continue;
                possibleList[p * NUM_OF_CELLS + maxx][num] = false;
                ok = false; // 次のループ
              }

            }
            if (minx != maxx && miny == maxy) {
              console.log("x = " + [minx, maxx].join(","), "y = " + maxy, "num=" + (num + 1))
              row_possible[maxy][num] = false;
              for (let p = 0; p < NUM_OF_CELLS; ++p) {
                if (minx <= p && p <= maxx) continue;
                possibleList[maxy * NUM_OF_CELLS + p][num] = false;
                ok = false; // 次のループ
              }
            }
          }
        }
      }
      ++turn;
    } while ( !ok );
    return possibleList;
  };

  predict(tbl) {
    var possibleList = this.suggest(tbl);
    var possibleList2 = this.suggest(tbl);
    //var possibleList2 = this.TKMethod(tbl);

    var ans1 = this.PL2Ans(possibleList, tbl);
    var ans2 = this.PL2Ans(possibleList2, tbl);

    for (let i = 0; i < NUM_OF_CELLS; ++i) {
      for (let j = 0; j < NUM_OF_CELLS; ++j) {
        if (ans1[NUM_OF_CELLS * i + j].ansType == -1) continue;
        if (ans2[NUM_OF_CELLS * i + j].ansType == -1) continue;
        if (ans1[NUM_OF_CELLS * i + j].ansType !=
          ans2[NUM_OF_CELLS * i + j].ansType) {
          ans1[NUM_OF_CELLS * i + j].ansType = 2;
          ans1[NUM_OF_CELLS * i + j].number = ans2[NUM_OF_CELLS * i + j].number;
        }
      }
    }
    return ans1;
  }
}
