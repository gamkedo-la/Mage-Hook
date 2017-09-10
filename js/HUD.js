function hudClass() {
    const DRAW_GAP = 2;
    const DRAW_OFFSET_X = 5;
    const DRAW_OFFSET_Y = 5;
    var heartPic;
    var heartsToDraw;
    var heartFullSprite = new spriteClass();
	var heartHalfSprite = new spriteClass();
	var heartEmptySprite = new spriteClass();
    var keySprite = new spriteClass();
	var keyRubySprite = new spriteClass();
	var keyEmeraldSprite = new spriteClass();

    this.load = function() {
        heartEmptyPic = sprites.Hud.heartEmpty;
		heartFullPic = sprites.Hud.heartFull;
		heartHalfPic = sprites.Hud.heartHalf;
        keyPic = worldPics[TILE_KEY];
		keyRubyPic = worldPics[TILE_KEY_RUBY];
		keyEmeraldPic = worldPics[TILE_KEY_EMERALD];
        heartEmptySprite.setSprite(heartEmptyPic, 7, 7, 1, 0);
		heartFullSprite.setSprite(heartFullPic, 7, 7, 1, 0);
		heartHalfSprite.setSprite(heartHalfPic, 7, 7, 1, 0);
        keySprite.setSprite(keyPic, 20, 20, 1, 0);
		keyRubySprite.setSprite(keyRubyPic, 20, 20, 1, 0);
		keyEmeraldSprite.setSprite(keyEmeraldPic, 20, 20, 1, 0);
    }

    this.draw = function() {
        heartsToDraw = Math.floor(player.maxHealth/2);
		currentFullHearts = Math.floor(player.currentHealth/2);
        keysToDraw = player.inventory.keys;
        var drawX = DRAW_OFFSET_X;
        var drawY = DRAW_OFFSET_Y;

        // Draw hearts
        for (var i = 1; i <= heartsToDraw; i+=1) {
			if (player.currentHealth%2==1 && i==currentFullHearts+1)
			{
                heartHalfSprite.draw(drawX, drawY);
            } else if (i > currentFullHearts)
            {
                heartEmptySprite.draw(drawX, drawY);
            } else {
                heartFullSprite.draw(drawX, drawY);
            }
            drawX += heartEmptyPic.width + DRAW_GAP;
            if (i > 0 && i%5 == 0) {
                drawX = DRAW_OFFSET_X + DRAW_GAP*2;
                drawY += heartEmptyPic.height + DRAW_GAP;
            }
        }

        // Draw keys
        var drawX = canvas.width - 30;
        var drawY = 12;
        keySprite.draw(drawX, drawY);
        colorText(" x " + player.inventory.keys, drawX + 3, drawY + 5, 'white');
		drawY += 15;
		keyRubySprite.draw(drawX, drawY);
        colorText(" x " + player.inventory.keysRuby, drawX + 3, drawY + 5, 'white');
		drawY += 15;
		keyEmeraldSprite.draw(drawX, drawY);
        colorText(" x " + player.inventory.keysEmerald, drawX + 3, drawY + 5, 'white');
        // (temp?) draw score mostly so we know if attacks are working =)
		drawX = canvas.width - 100;
		drawY = 12;
        colorText("SCORE: " + player.enemyHitCount + "00", drawX, drawY, 'white');

    }
}
