/**
 * @fileoverview その他
 */


 /**
  * keycodeToDPos - キーコードを変位に変換
  *
  * @param  {type} keyCode キーコード
  * @return {type}         変位
  */

function keycodeToDPos( keyCode ){
  const keys = {
		"left": 37,
		"up":		38,
		"right":39,
		"down":	40,
	};

  let dx = 0, dy = 0;
  if( keyCode === keys.left  ) dx = -1;
  if( keyCode === keys.right ) dx = 1;
  if( keyCode === keys.up    ) dy = -1;
  if( keyCode === keys.down  ) dy = 1;

  return {
    "dx": dx,
    "dy": dy
  };
}
