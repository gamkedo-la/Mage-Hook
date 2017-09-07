function trapClass(x, y) {
    this.x = x;
    this.y = y;
    var sprite = new spriteClass();

    this.load = function() {
        var bladeTrapPic = worldPics[TILE_TRAP];
        sprite.setSprite(bladeTrapPic, 20, 20, 10, 10);
    }

    this.update = function() {
        sprite.update();
    }

    this.draw = function() {
        sprite.draw(this.x, this.y);
    }
}
