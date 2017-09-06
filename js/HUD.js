function hudClass() {
    const DRAW_GAP = 2;
    const DRAW_OFFSET_X = 5;
    const DRAW_OFFSET_Y = 5;
    var heartPic;
    var heartsToDraw = 20;
    var sprite = new spriteClass();

    this.load = function() {
        heartPic = sprites.Hud.blueHeart;
        sprite.setSprite(heartPic, 7, 7, 1, 0);
    }

    this.draw = function() {
        var drawX = DRAW_OFFSET_X;
        var drawY = DRAW_OFFSET_Y;
        for (var i = 1; i <= heartsToDraw; i++) {
            //sprite.draw(drawX, drawY); // disabled because sprite isn't reading well
            colorRect(drawX, drawY, 7, 7, 'red');
            drawX += heartPic.width + DRAW_GAP;
            if (i > 0 && i%10 == 0) {
                drawX = DRAW_OFFSET_X;
                drawY += heartPic.height + DRAW_GAP;
            }
        }
    }
}
