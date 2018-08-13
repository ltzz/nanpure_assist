/* Webcam */
var localMediaStream = null;
var video = document.querySelector("video");
var offsetx = 60;
var offsety = 10
  $("#webcam_getmedia").mousedown(function(e){
    var cvs = $("#video_covering");
    var ctx = cvs.get(0).getContext('2d');
    ctx.strokeStyle = "#ff0000";
    for(let i = 0; i <= 3; ++i){
      ctx.moveTo( offsetx + 280 * i/3, offsety + 0);
      ctx.lineTo( offsetx + 280 * i/3, offsety + 280);
      ctx.moveTo( offsetx + 0      , offsety + 280*i/3);
      ctx.lineTo( offsetx + 280		 , offsety + 280*i/3);
    }
    ctx.stroke();
    console.log("Video Capture Started");

  navigator.getUserMedia = navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia; // vendor prefix

  navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }, function(error) {alert("カメラからの映像取得ができません")});
  });

  var nn = null;

  var imageToDataURL = function(a){
    var canvas = document.createElement("canvas");
    canvas.width  = a.width;
    canvas.height = a.height;
    var ctx = canvas.getContext("2d");
    ctx.putImageData(a, 0, 0);
    return canvas.toDataURL('image/png');
  }

  $("#webcam_getimg").mousedown(function(e){
    var timer_st = new Date;


    //リサイズの必要あり
  if (localMediaStream) {
    var cvs = $("<canvas>").get(0);
    cvs.width = 400;
    cvs.height = 300;
    var ctx = cvs.getContext('2d');
    ctx.drawImage(video, 0, 0, cvs.width, cvs.height);

    var dat = ctx.getImageData(60, 10, 280, 280);
    var inputData = dat.data;
    for( let y = 0; y < dat.height; ++y ){
      for( let x = 0; x < dat.width; ++x ){
        const th = 140;
        var idx = (y * dat.width + x);
        var valr = inputData[ idx * 4 + 0 ];
        var valg = inputData[ idx * 4 + 1 ];
        var valb = inputData[ idx * 4 + 2 ];
        const gray = (valr + valg + valb)/3|0;
        //var bin = (gray > th) ? 255 : 0;
        inputData[ idx * 4 + 0 ] = gray;
        inputData[ idx * 4 + 1 ] = gray;
        inputData[ idx * 4 + 2 ] = gray;

      }
    }

    var tmp = $("#recognition_result").get(0);
    tmp.width = 280;
    tmp.height = 280;
    var tctx = tmp.getContext('2d');
    tctx.putImageData(dat, 0, 0);


    var dbg = $("#webcam_debug_canvas").get(0);
    var dbgx = dbg.getContext('2d');


      if(!nn){
        nn = new NN(784,100,10);
        nn.load();
      }

      $("#webcam_message").text("preparing neural network...");
      var square_images = [];
      var NNloadCnt = 0;
      var NNload = function(){
        ++NNloadCnt;
        if( NNloadCnt == 1000 ) return;
        if(nn.prepare() == 2){
          $("#webcam_message").text("");
        var parr = [];
        for(let i = 0; i < 9; ++i){
          for(let j = 0; j < 9; ++j){
            var square = tctx.getImageData( j * 31+1, i*31+1, 28, 28 );
            var retarr = NNproc(square, nn);
            parr[i*9+j] = retarr[0];
            square_images[ i * 9 + j ] = retarr[1];
            dbgx.putImageData( retarr[1], j*33+1, i*33+1 );
          }
        }
        console.log((new Date).getTime() - timer_st + "ms");
        //self test
        var tmpl = new TempleteMatch("Arial");//test you
        var ans = ui.getCells();
        var testok = 0;
        for(var i=0; i < 9 * 9; ++i){
          var x = i % 9, y = i / 9 |0;
          tctx.font = "16px sans-serif";
          tctx.strokeStyle = "rgba(255,200,60,0.8)";
          tctx.strokeText(parr[i], x*31+1 +5,y*31+1 +10);
          if( parr[i] == ans[i] ){
            ++testok;
          }else{

            for(let j=0; j < 28*28; ++j){
              if( parr[i] ){
                var val1 = 0xff - tmpl.templates[ parr[i]-1 ][j];
                val1 = val1 > 0 ? 0 : val1;
                var val2 = val1 > 0xc0 ? 0 : square_images[i][ 4 * j + 0 ];
                var data1 = square_images;
                data1[i][ 4 * j + 0 ] = val2;
                data1[i][ 4 * j + 1 ] = val2;
                data1[i][ 4 * j + 2 ] = val1;
              }
            }

            $("#webcam_debug_elm").append("<img src='" + imageToDataURL(square_images[i])+"'>");
          }
        }
        ui.setCells( parr );
        console.log("self test result: " + testok + "/81 ( " + (testok/81*100).toFixed(1)+"% )");

        return;
        }else if(nn.prepare() == 1){
          $("#webcam_message").text("preparing neural network...1/2");
        }

        setTimeout(NNload,100);
      }
    setTimeout(NNload,100);
    //document.querySelector('img').src = cvs.toDataURL('image/png');
    }
  });
