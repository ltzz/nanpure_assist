class Render {
  static circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    ctx.closePath();
  }
  static drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }
  static clearScreen(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  static tally(ctx, n, x, y) { //正の字
    var tally_cnt = n / 5 | 0;
    var stroke_cnt = n % 5;
    ctx.save();
    ctx.lineWidth = 0.5;
    x = x | 0, y = y | 0;
    x -= 0.5;
    y -= 0.5;
    ctx.beginPath();
    for (let i = 0; i < tally_cnt; ++i) {
      ctx.moveTo(x - 5, i * 12 + y - 5);
      ctx.lineTo(x + 5, i * 12 + y - 5);

      ctx.moveTo(x, i * 12 + y - 5);
      ctx.lineTo(x, i * 12 + y + 5);

      ctx.moveTo(x, i * 12 + y);
      ctx.lineTo(x + 5, i * 12 + y);

      ctx.moveTo(x - 3, i * 12 + y);
      ctx.lineTo(x - 3, i * 12 + y + 5);

      ctx.moveTo(x - 5, i * 12 + y + 5);
      ctx.lineTo(x + 5, i * 12 + y + 5);
    }
    for (let i = 0; i < stroke_cnt; ++i) {
      if (stroke_cnt < 1) break;
      ctx.moveTo(x - 5, tally_cnt * 12 + y - 5);
      ctx.lineTo(x + 5, tally_cnt * 12 + y - 5);

      if (stroke_cnt < 2) break;
      ctx.moveTo(x, tally_cnt * 12 + y - 5);
      ctx.lineTo(x, tally_cnt * 12 + y + 5);

      if (stroke_cnt < 3) break;
      ctx.moveTo(x, tally_cnt * 12 + y);
      ctx.lineTo(x + 5, tally_cnt * 12 + y);

      if (stroke_cnt < 4) break;
      ctx.moveTo(x - 3, tally_cnt * 12 + y);
      ctx.lineTo(x - 3, tally_cnt * 12 + y + 5);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}
