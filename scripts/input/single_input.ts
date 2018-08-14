

class SingleNumberKeyboard {
  static currentNumber = 0; //単数字入力の現在の選択数字
	static generateKey() {
		let str = "";
		for(let i = 0; i < NUM_OF_CELLS + 1; ++i){
			const onclickcode = "SingleNumberKeyboard.selectKey(" + i + ");";
			str += `<div id='key${i}' class='number_select_key noselectable'
	 onmousedown='${onclickcode}'>${i}</div>`;
		}
		str += "<div style='clear: both'></div>"; //float解除，はみ出し防止
		document.getElementById("number_keyboard").innerHTML = str;
	}
	static selectKey(num :number) {
		SingleNumberKeyboard.currentNumber = num;
		for(let i = 0; i < NUM_OF_CELLS + 1; ++i){
			// 非選択のキーは白で塗りつぶし
			document.getElementById("key"+i).style.backgroundColor = "#ffffff";
		}
		// 選択中のキーだけ塗っておく
		document.getElementById("key"+num).style.backgroundColor = "#cccccc";
	}
}
