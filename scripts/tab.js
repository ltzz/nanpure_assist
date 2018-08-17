function Tabs() {
  for (let i = 0; i < document.getElementsByClassName('tab_title').length; ++i) {
    var f = (function() {
      const tab_i = i;
      return function() {
        for (let j = 0; j < document.getElementsByClassName('tab_content').length; ++j) {
          document.getElementsByClassName('tab_content')[j].style.zIndex = 1;
          document.getElementsByClassName('tab_title')[j].style.backgroundColor = "#ffffff";
        }
        // 選択されたタブに切り替える処理
        document.getElementsByClassName('tab_content')[tab_i].style.zIndex = 2;
        document.getElementsByClassName('tab_title')[tab_i].style.backgroundColor = "#cccccc";
      }
    })();
    document.getElementsByClassName('tab_title')[i].addEventListener('mousedown', f, false);
  }
}
