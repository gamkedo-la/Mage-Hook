function boxColliderClass(width, height) {
    var width = width;
    var height = height;
    this.corner = [];

    this.setCollider = function(posX, posY) {
		this.corner[0] = {
			x: posX - width,
			y: posY - height
		}
		this.corner[1] = {
			x: posX + width,
			y: posY - height
		}
		this.corner[2] = {
			x: posX - width,
			y: posY + height
		}
		this.corner[3] = {
			x: posX + width,
			y: posY + height
		}
	}

    this.draw = function() {
        for (i = 0; i < this.corner.length; i++) {
            canvasContext.fillRect(this.corner[i].x, this.corner[i].y, 1, 1);
        }
    }
}
