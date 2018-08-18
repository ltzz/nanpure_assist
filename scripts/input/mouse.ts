class MouseCellSelect {
  static nowC = null;
  static nowR = null;

  static SetCurrentPosition(c : any, r : any) {
    MouseCellSelect.nowC = c;
    MouseCellSelect.nowR = r;
  }
}
