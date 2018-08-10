function TempleteMatch(font) {
  this.templates = [];
  var template = $("<canvas>").get(0);
  template.width = 28;
  template.height = 28;
  var ctx = template.getContext('2d');
  ctx.font = "20px " + font;
  ctx.textAlign = 'center';
  for (var i = 1; i <= 9; ++i) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 28, 28);
    //console.log(ctx.measureText(text[0]).width);
    ctx.fillStyle = "#000000";
    ctx.fillText(i, 13, 27 - 4 - 1);
    var data = ctx.getImageData(0, 0, 28, 28).data;
    this.templates[i - 1] = new Uint8Array(28 * 28);
    for (var j = 0; j < 28 * 28; ++j) {
      this.templates[i - 1][j] = data[4 * j];
    }

  }

  //$("#aaa").attr("src",imageToDataURL(ctx.getImageData(0,0,28,28)));

  this.match = function(dat) {
    var dat2 = new Uint8Array(dat);
    //data.reduce(function(a,b,idx){return a+(255-templates[i].data[4*idx]/255) * dat2[idx];},0);
    var dat_sum = 0;
    for (var j = 0; j < dat2.length; ++j) {
      dat_sum += dat2[j];
    }
    var ret = [];
    for (var i = 0; i < 9; ++i) {
      var sum = 0;
      var tmp = this.templates[i];
      for (var j = 0; j < dat2.length; ++j) {
        sum += Math.abs(((255 - tmp[j]) / 255) - dat2[j]);
      }
      //sum = (dat_sum - sum)/dat_sum;
      sum = (28 * 28 - sum) / (28 * 28);
      //console.log(sum,i);
      ret[i] = sum;
    }
    //console.log(ip_max, ip_max_i);
    return ret;
  }

  this.recog = function(dat) {
    var arr = this.match(dat);
    var ip_max = 0,
      ip_max_i = 0;
    for (var i = 0; i < arr.length; ++i) {
      if (ip_max < arr[i]) {
        ip_max = arr[i];
        ip_max_i = i;
      }
    }
    return ip_max_i + 1;
  }
}
