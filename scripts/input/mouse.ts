class MouseCellSelect {
  static nowC = 0;
  static nowR = 0;
  static enable = false;

  static SetCurrentPosition(c : any, r : any) {
    MouseCellSelect.nowC = c;
    MouseCellSelect.nowR = r;
    MouseCellSelect.enable = true;
  }
}
