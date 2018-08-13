let selectedPos = [0,0];

class CellInput {
  static cellMove(dx, dy){
    selectedPos[0] += dx;
    selectedPos[1] += dy;
  }
}
