var fillHole = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  var clabel = 0;
  var label = [];
  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      label[idx] = -1;
    }
  }

  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0xff) {
        var Q = [];
        Q.push([{
          x: x,
          y: y
        }]);
        while (Q.length) {
          var q = Q[Q.length - 1];
          Q.pop();
          var cidx = 4 * (q.y * w + q.x);
          if (label[cidx] == -1 && 0 <= q.x && q.x < w && 0 <= q.y && q.y < h) {
            label[cidx] = clabel;
            Q.push(q.x + 1, q.y);
            Q.push(q.x - 1, q.y);
            Q.push(q.x, q.y + 1);
            Q.push(q.x, q.y - 1);
          }
        }
      }
      clabel++;
    }
  }

  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      label[idx] = -1;
      if (data[idx] == 0xff && label[idx] >= 1) {
        data[idx] = 0x00;
      }
    }
  }
}

var calcCentroid = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  var sumx = 0,
    sumy = 0,
    sum = 0;
  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0x00) {
        sumx += x;
        sumy += y;
        sum++;
      }
    }
  }
  return [sumx / sum, sumy / sum];
}

var calcArea = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  var sum = 0;
  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0x00) {
        sum++;
      }
    }
  }
  return sum;
}

var permeter = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  var DIR = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0]
  ];
  var ret = 0;
  var f = true;
  for (var y = 1; y < h - 1 && f; ++y) {
    for (var x = 1; x < w - 1 && f; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0x00) {
        f = false;
        var sx = x,
          sy = y;
        var cx = x,
          cy = y;
        var olddir = 0;
        do {
          for (var n = 0; n < DIR.length; ++n) {
            var k = (olddir + 6 + n) % 8;
            if (cx + DIR[k][0] < 0 || w <= cx + DIR[k][0]) continue;
            if (cy + DIR[k][1] < 0 || h <= cy + DIR[k][1]) continue;
            var cidx = 4 * ((cy + DIR[k][1]) * w + cx + DIR[k][0]);
            if (data[cidx] == 0x00) {
              olddir = k;
              cx = cx + DIR[k][0];
              cy = cy + DIR[k][1];
              ret += Math.sqrt(DIR[k][0] * DIR[k][0] + DIR[k][1] * DIR[k][1]);
              break;
            }
          }
        } while (cx != sx || cy != sy);
      }
    }
  }
  return ret;
}

var erode = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  for (var y = 1; y < h - 1; ++y) {
    for (var x = 1; x < w - 1; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0xff) {
        for (var dx = -1; dx <= 1; ++dx) {
          for (var dy = -1; dy <= 1; ++dy) {
            if (!dx && !dy) continue;
            data[idx + 4 * (dy * w + dx)] = 0x10;
          }
        }
      }
    }
  }
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0x10) {
        data[idx] = data[idx + 1] = data[idx + 2] = 0xff;
      }
    }
  }
  return data;
}


var regularize = function(imagedata, width, height, rect) {
  var newCanvas = document.createElement("canvas");
  var ctx = newCanvas.getContext("2d");
  ctx.putImageData(imagedata, 0, 0);
  var trimmed = ctx.getImageData(rect.left, rect.top, rect.width, rect.height);

  var newCanvas = document.createElement("canvas");
  var ctx = newCanvas.getContext("2d");
  var maxRatio = Math.max(rect.width / width, rect.height / height);
  ctx.scale(1 / maxRatio, 1 / maxRatio);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  var dx = 0;
  if (rect.width < rect.height) dx = width * (1 - rect.width / rect.height) / 2 + 1;
  ctx.putImageData(trimmed, dx, 0);
  return ctx.getImageData(0, 0, width, height);
}

var centering = function(imagedata, nn) {
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;
  var sum = {
    x: 0,
    y: 0
  };
  var max = {
    x: 0,
    y: 0
  };
  var min = {
    x: 28,
    y: 28
  };
  var cnt = 0;
  for (var y = 0; y < h; ++y) {
    for (var x = 0; x < w; ++x) {
      var idx = 4 * (y * w + x);
      if (data[idx] == 0x00) {
        sum["x"] += x;
        sum["y"] += y;
        max["x"] = max["x"] < x ? x : max["x"];
        max["y"] = max["y"] < y ? y : max["y"];
        min["x"] = min["x"] > x ? x : min["x"];
        min["y"] = min["y"] > y ? y : min["y"];
        ++cnt;
      }
    }
  }
  var centroid = {
    x: sum.x / cnt,
    y: sum.y / cnt
  };

  //var dx = centroid["x"] - 13.5|0;//13.5?
  //var dy = centroid["y"] - 14.5|0;//14.5?
  // https://www.kaggle.com/c/digit-recognizer/forums/t/6366/normalization-and-centering-of-images-in-mnist

  var cvs = document.createElement("canvas");
  cvs.width = 48;
  cvs.height = 48;
  var ctx = cvs.getContext("2d");
  if (max["y"] - min["y"] <= 0 || max["x"] - min["x"] <= 0) return imagedata.data;
  var resized = regularize(imagedata, 20, 20, {
    left: min["x"],
    top: min["y"],
    width: max["x"] - min["x"] + 1,
    height: max["y"] - min["y"] + 1
  });

  for (var i = 0; i < 28; ++i) {
    for (var j = 0; j < 28; ++j) {
      imagedata.data[4 * (i * 28 + j)] = imagedata.data[4 * (i * 28 + j) + 1] = imagedata.data[4 * (i * 28 + j) + 2] = 0xff;
    }
  }

  for (var i = 0; i < 28; ++i) {
    for (var j = 0; j < 28; ++j) {
      if (28 / 2 - resized.height / 2 <= i &&
        28 / 2 - resized.width / 2 <= j &&
        i < 28 / 2 + resized.height / 2 &&
        j < 28 / 2 + resized.width / 2) {
        var rsy = i - (28 / 2 - resized.height / 2);
        var rsx = j - (28 / 2 - resized.width / 2);
        var idx = 4 * (rsy * resized.width + rsx);
        imagedata.data[4 * (i * 28 + j)] = imagedata.data[4 * (i * 28 + j) + 1] = imagedata.data[4 * (i * 28 + j) + 2] = resized.data[idx];
      }
    }
  }
  //ctx.putImageData(resized, 28/2-20/2, 28/2-20/2);
  //var ret = ctx.getImageData(24-28/2+dx,24-28/2+dy,28,28);

}

var thinning = function(imagedata) { //Zhang-Suen
  var w = imagedata.width;
  var h = imagedata.height;
  var data = imagedata.data;

  var flag = true;
  var odd = false;
  while (flag) {
    if (!odd) {
      flag = false;
    }
    for (var y = 1; y < h - 1; ++y) {
      for (var x = 1; x < w - 1; ++x) {
        var idx = 4 * (y * w + x);
        if (0 == data[idx]) {
          var a = 0;
          var b = 0;
          var P = [-w, -w + 1, 1, w + 1, w, w - 1, -1, -w - 1].map(function(xx) {
            return idx + 4 * xx;
          });
          var p = P.map(function(xx) {
            return (0 == data[xx]) ? 1 : 0;
          });
          for (var i = 0; i < p.length; ++i) {
            if (!p[i] && p[(i + 1) % p.length]) ++a;
            b += p[i];
          }

          if (a == 1 && 2 <= b && b <= 6) {
            if ((!odd && p[0] * p[2] * p[4] == 0 && p[2] * p[4] * p[6] == 0) ||
              (odd && p[0] * p[2] * p[6] == 0 && p[0] * p[4] * p[6] == 0)) {
              data[idx] = data[idx + 1] = data[idx + 2] = 0xff;
              flag = true;
            }
          }
        }
      }
    }
    odd = !odd;
  }
  return data;
}

var empiricalRecog = function(imagedata) {
  var w = imagedata.width;
  var h = imagedata.height;
  var p = permeter(imagedata);
  var centroid = calcCentroid(imagedata);
  var cx = centroid[0],
    cy = centroid[1];
  var rcx = (cx - w / 2) / (w / 2),
    rcy = (cy - h / 2) / (h / 2);
  var area = calcArea(imagedata);
  var ra = area / (w * h / 4);
  var rp = p / (w / 2 * Math.PI);
  //console.log(rp,rcx,rcy,ra);

  var P = [1, 1.10, 1.50, 1.55, 1.11, 1.70, 1.37, 1.33, 1.17, 1.31];
  var CX = [0.0, 0.0, 0.01, 0.04, -0.01, -0.03, -0.05, 0.01, -0.07, -0.03];
  var CY = [0.0, -0.07, -0.04, -0.12, -0.15, -0.11, -0.05, -0.21, -0.13, -0.17];
  var AREA = [0.3, 0.42, 0.56, 0.55, 0.60, 0.65, 0.70, 0.65, 0.84, 0.70];
  var belong = function(val, center, end) {
    var v = 1 - (Math.abs(val - center) - end) / end;
    if (v < 0) return 0
    return v;
  }
  var dist = [];
  var belongs = [];
  for (var i = 0; i <= 9; ++i) {
    dist[i] = Math.abs(rp - P[i]) + 4 * Math.abs(rcx - CX[i]) + 10 * Math.abs(rcy - CY[i]) + Math.abs(ra - AREA[i]);
    belongs[i] = belong(rp, P[i], 0.2) * belong(rcx, CX[i], 0.2) * belong(rcy, CY[i], 0.2) * belong(ra, AREA[i], 0.2);
  }


  var minv = 1e7,
    mina = 0;
  for (var i = 0; i <= 9; ++i) {
    if (minv > dist[i]) {
      minv = dist[i];
      mina = i;
    }
  }
  var maxv = 0,
    maxa = 0;
  for (var i = 0; i <= 9; ++i) {
    if (maxv < belongs[i]) {
      maxv = belongs[i];
      maxa = i;
    }
  }
  return maxa;
}

function NNproc(square, nn) {
  var p = 0;
  var sdata = square.data;
  var smax = sdata.reduce(function(a, b) {
    return Math.max(a, b);
  });
  var smin = sdata.reduce(function(a, b) {
    return Math.min(a, b);
  });
  var sum = 0;
  var empty_flag = false;
  for (var k = 0; k < sdata.length; ++k) {
    if (k % 4 != 3) sum += square.data[k];
  }

  for (var k = 0; k < sdata.length; ++k) {
    if (k % 4 != 3) {
      if ((sdata[k] - sum / (3 * 28 * 28)) / (smax - smin) < -0.04) {
        //|| (sdata[k]-smin)/(smax-smin)<0.25){
        square.data[k] = 0;
      } else {
        square.data[k] = 255;
      }
    }
  }


  var number_island = [];
  var Q = [];
  for (var k = -4; k <= 4; ++k) { //���S�ߖT�̓����T��
    for (var l = -4; l <= 4; ++l) {
      if (square.data[((14 + k) * 28 + 14 + l) * 4] == 0) {
        number_island[(14 + k) * 28 + 14 + l] = true;
        Q.push((14 + k) * 28 + 14 + l);
      }
    }
  }

  while (Q.length) {
    var a = Q.pop();
    for (var y = -1; y <= 1; ++y) {
      for (var x = -1; x <= 1; ++x) {
        var ox = a % 28;
        var oy = (a / 28 | 0);
        if (oy + y >= 0 && oy + y < 28 &&
          ox + x >= 0 && ox + x < 28 &&
          square.data[((oy + y) * 28 + ox + x) * 4] == 0 &&
          !number_island[(oy + y) * 28 + ox + x]) {
          Q.push((oy + y) * 28 + ox + x);
          number_island[(oy + y) * 28 + ox + x] = true;
        }
      }
    }
    1

  }

  for (var k = 0; k < sdata.length; ++k) {
    if (k % 4 != 3 && !number_island[(k / 4) | 0]) square.data[k] = 0xff;
  }
  //square.data = thinning(square);
  //square.data = erode(square);

  sum = 0;
  for (var k = 0; k < sdata.length; ++k) {
    if (k % 4 != 3) sum += square.data[k];
  }
  if (sum >= 28 * 28 * 255 * 3 * 0.95) empty_flag = true;

  var data = [];
  for (var k = 0; k < square.data.length; k += 4) data[k / 4] = square.data[k];
  var maxval = data.reduce(function(a, b) {
    return Math.max(a, b) | 0;
  });
  var minval = data.reduce(function(a, b) {
    return Math.min(a, b) | 0;
  });
  data = data.map(function(x) {
    return (255 - x) / 255;
  });
  //data = data.map(function(x){return (x-minval)/(maxval-minval);});
  //data = data.map(function(x){return ((x-minval)/(maxval-minval) < 0.3)?0.0:1.0;});

  centering(square);
  fillHole(square);
  console.log(empiricalRecog(square));

  if (!empty_flag) {
    var tmpl_a = new TempleteMatch("Arial");
    //var tmpl_c = new TempleteMatch("sans-serif");
    var arr1 = nn.fire(data)[1];
    var arr2 = tmpl_a.match(data);
    //var arr4 = tmpl_c.match(data);
    var ip = [];
    var max_i = 0,
      max_val = 0;
    var arrmax = function(data) {
      return data.reduce(function(a, b) {
        return Math.max(a, b);
      });
    }
    //console.log(arrmax(arr1),arrmax(arr2));
    for (var i = 1; i < arr1.length; ++i) {
      ip[i - 1] = 0.7 * arr1[i] + 0.3 * arr2[i - 1] // + arr4[i-1];
      if (max_val < ip[i - 1]) {
        max_val = ip[i - 1];
        max_i = i;
      }
    }
    p = max_i;
    //p = tmpl_a.recog(data);
    //p = nn.predicate(data);
  }
  return [p, square];
}
