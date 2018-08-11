//簡易DPLL

var Ans;

function assign(F, v) {
  newF = F.concat()
  newF = newF.filter(function(cl) {
    return !cl.includes(v);
  });
  newF = newF.map(function(cl) {
    return cl.filter(function(lit) {
      return lit != -v
    })
  });
  return newF;
}

function unit_rule(F) {
  //1リテラル規則
  var F = F.concat();
  while (!F.every(function(cl) {
      return cl.length != 1
    })) {
    var units = F.filter(function(clause) {
      if (clause.length == 1) return true;
      else return false;
    })
    units = Array.prototype.concat.apply([], units);

    for (let unit of units) {
      ans.add(unit);
      F = F.filter(function(cl) {
        return !cl.includes(unit);
      });
      F = F.map(function(cl) {
        return cl.filter(function(lit) {
          return lit != -unit
        })
      });
    }
  }
  return F;
}

function DPLL(F, cnt) {
  var F = unit_rule(F);
  if (cnt > 1e6) return false;
  if (F.length == 0) {
    Ans = ans;
    return true;
  }
  if (F.every(function(cl) {
      return cl.length == 0;
    })) return false;

  var v = F[0][0];
  var ans = Object.assign({}, ans);
  if (DPLL(assign(F, v), cnt + 1) || DPLL(assign(F, -v), cnt + 1)) {
    return true;
  }
  return false;
}

function solveDPLL(board) { //ナンプレの問題を変換する
  var CNFs = [];
  var ans = new Set();
  for (var i = 0; i < 9; ++i) { //既にある数字を入れる
    for (var j = 0; j < 9; ++j) {
      var val = board[i * 9 + j];
      if (val > 0) CNFs.push([i * 9 * 9 + j * 9 + val - 1]); //1リテラルのみの節を入れる
    }
  }

  for (var i = 0; i < board.length; ++i) { //1マスに1から9まで数字が入る論理式
    for (var j = 0; j < board[i].length; ++j) {
      var clause = [];
      for (var n = 0; n < 9; ++n) {
        clause.push(i * 9 * 9 + j * 9 + n);
      }
      CNFs.push(clause);
    }
  }

  for (var i = 0; i < board.length; ++i) { //1マスに1つしか数字が入らない論理式
    for (var j = 0; j < board[i].length; ++j) {
      for (var a = 0; a < 9; ++a) {
        for (var b = 0; b < 9; ++b) {
          if (b <= a) continue;
          var clause = [];
          clause.push(-(i * 9 * 9 + j * 9 + a));
          clause.push(-(i * 9 * 9 + j * 9 + b));
          CNFs.push(clause);
        }
      }
    }
  }

  for (var n = 0; n < 9; ++n) {
    for (var i = 0; i < 9; ++i) { //同じ固まりの中では同じ数字が入らない
      for (var j = 0; j < 9; ++j) {
        for (var k = 0; k < 9; ++k) {
          var clause_r = [];
          clause_r.push(-(i * 9 * 9 + j * 9 + n));
          clause_r.push(-(k * 9 * 9 + j * 9 + n));
          if (i != k) CNFs.push(clause_r);

          var clause_c = [];
          clause_c.push(-(i * 9 * 9 + j * 9 + n));
          clause_c.push(-(i * 9 * 9 + k * 9 + n));
          if (j != k) CNFs.push(clause_c);

          var blocki = i / 3 | 0;
          var blockj = j / 3 | 0;
          var di = k / 3 | 0;
          var dj = k % 3;
          var clause_b = [];
          clause_b.push(-(i * 9 * 9 + j * 9 + n));
          clause_b.push(-((blocki * 3 + di) * 9 * 9 + (blockj * 3 + dj) * 9 + n));
          if (blocki * 3 + di != i && blockj * 3 + dj != j) {
            CNFs.push(clause_b);
          }
        }
      }
    }
  }

  return DPLL(CNFs, 0);
}
