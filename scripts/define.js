
const BC = 3, BR = 3;
const NUM_OF_CELLS = BC * BR;
const WIDTH = 480;
const HEIGHT = 480;
const MARGIN = 60;
const CELL_SIZ = ( WIDTH - MARGIN * 2 ) / NUM_OF_CELLS;

const OUTER_RADIUS = CELL_SIZ * 2.0 * ( NUM_OF_CELLS / 10 );
const INNER_RADIUS = CELL_SIZ * 0.7 * ( NUM_OF_CELLS / 10 );
const KEY_RADIUS   = CELL_SIZ * 1.4 * ( NUM_OF_CELLS / 10 );
// 9x9で最適だったサイズの流用
// 
