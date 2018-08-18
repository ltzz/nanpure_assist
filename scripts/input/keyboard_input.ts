class CellInput {
  static selectedPos = [0,0];
  static cellMove(dx: number, dy: number){
    CellInput.selectedPos[0] += dx;
    CellInput.selectedPos[1] += dy;
  }
}
