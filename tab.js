function Tabs() {
  for (var i = 0; i < document.getElementsByClassName('tab_title').length; ++i) {
    var f = (function() {
      var ii = i;
      return function() {
        for (var j = 0; j < document.getElementsByClassName('tab_content').length; ++j) {
          document.getElementsByClassName('tab_content')[j].style.zIndex = 1;
          document.getElementsByClassName('tab_title')[j].style.backgroundColor = "#ffffff";
        }
        document.getElementsByClassName('tab_content')[ii].style.zIndex = 2;
        document.getElementsByClassName('tab_title')[ii].style.backgroundColor = "#cccccc";
      }
    })();
    document.getElementsByClassName('tab_title')[i].addEventListener('mousedown', f, false);
  }
}
