class CellInput {
  static selectedPos = [0,0];
  static cellMove(dx, dy){
    CellInput.selectedPos[0] += dx;
    CellInput.selectedPos[1] += dy;
  }
}
