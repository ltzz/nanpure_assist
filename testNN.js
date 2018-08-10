// http://qiita.com/ginrou@github/items/07b52a8520efcaebce37
// �d�݂͕ʂ̊��œ������̂��g���ׂ�����

function sigmoid(x) {
  return 1.0 / (1.0 + Math.exp(-x));
}

function NN(inSize, hiddenSize, outSize) {
  var hiddenWeight = new Array(hiddenSize);
  var outputWeight = new Array(outSize);
  var prepared = 0;

  this.prepare = function() {
    return prepared;
  }

  this._init_ = function() {
    for (var i = 0; i < hiddenSize; ++i) {
      hiddenWeight[i] = new Float64Array(inSize + 1); //Float64Array�ɂ���������10�{�ȏ��̍������H�i5�`10�b�������Ă��̂�1�b�����j
      for (var j = 0; j < inSize + 1; ++j) {
        0.1 * (hiddenWeight[i][j] = Math.random() - 0.5);
      }
    }
    for (var i = 0; i < outSize; ++i) {
      outputWeight[i] = new Float64Array(hiddenSize + 1);
      for (var j = 0; j < hiddenSize + 1; ++j) {
        0.1 * (outputWeight[i][j] = Math.random() - 0.5);
      }
    }
  }

  var _argmax_ = function(arr) {
    var arg = 0;
    var val = -Infinity;
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] > val) {
        val = arr[i];
        arg = i;
      }
    }
    return arg;
  }

  this.fit = function(x, t, updateRatio) {
    if (!updateRatio) updateRatio = 0.1;
    var zy = this.fire(x);
    var z = zy[0],
      y = zy[1];

    //���̕ӂ��牺�̏d�ݍX�V�����ł��ĂȂ�
    var dy = (y - t) * y * (1 - y);
    var dz = outputWeight * z * (1 - z); //�{���͓]�u�����Ăčs�����o�͑w��-1,�񐔂�y�̃x�N�g���v�f��? y���x�N�g���ɂ����K�v���邩���H

    var outputInput = [1].concat(z);
    var hiddenInput = [1].concat(x)
  }

  this.fire = function(x) {
    var input1 = [1].concat(x);
    var dot1 = [];
    for (var i = 0; i < hiddenSize; i = (i + 1) | 0) { //������
      var val = 0;
      for (var j = 0; j < inSize + 1; j = (j + 1) | 0) {
        val += hiddenWeight[i][j] * input1[j];
      }
      dot1[i] = val;
    }
    var z = dot1.map(sigmoid);

    var input2 = [1].concat(z);
    var dot2 = [];
    for (var i = 0; i < outSize; i = (i + 1) | 0) {
      var val = 0;
      for (var j = 0; j < hiddenSize + 1; j = (j + 1) | 0) {
        val += outputWeight[i][j] * input2[j];
      }
      dot2[i] = val;
    }
    var y = dot2.map(sigmoid);

    return [z, y];
  }

  this.predicate = function(x) {
    var zy = this.fire(x);
    //console.log(zy[1]);
    return _argmax_(zy[1]);
  }

  this.save = function() {
    //�d�݂̕ۑ�
  }

  var setHiddenWeight = function(arr) {
    for (var i = 0; i < hiddenSize; ++i) {
      for (var j = 0; j < inSize + 1; ++j) {
        hiddenWeight[i][j] = arr[i][j];
      }
    }
    ++prepared;
  }

  var setOutputWeight = function(arr) {
    for (var i = 0; i < outSize; ++i) {
      for (var j = 0; j < hiddenSize + 1; ++j) {
        outputWeight[i][j] = arr[i][j];
      }
    }
    ++prepared;
  }

  this.load = function() {
    //�d�݂̓ǂݍ���
    console.log("Start loading weight file of NN");
    var fname_hidden = "./hidden.csv";
    var fname_output = "./output.csv"

    $.ajax({
      url: fname_hidden,
      dataType: "text",
      dataFilter: function(data, type) {
        var arr = data.split("\n");
        for (var i = 0; i < arr.length; ++i) {
          arr[i] = arr[i].split(" ");
          arr[i].map(parseFloat);
        }
        return arr;
      },
      success: setHiddenWeight
    });

    $.ajax({
      url: fname_output,
      dataType: "text",
      dataFilter: function(data, type) {
        var arr = data.split("\n");
        for (var i = 0; i < arr.length; ++i) {
          arr[i] = arr[i].split(" ");
          arr[i].map(parseFloat);
        }
        return arr;
      },
      success: setOutputWeight
    });
  }
  this._init_();
}
