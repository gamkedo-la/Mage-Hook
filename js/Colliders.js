function boxColliderClass(width, height, offsetX, offsetY) {
    var width = width;
    var height = height;
    this.corner = [];

    this.setCollider = function(posX, posY) {
		this.corner[0] = {
			x: posX - width + offsetX,
			y: posY - height + offsetY
		}
		this.corner[1] = {
			x: posX + width + offsetX,
			y: posY - height + offsetY
		}
		this.corner[2] = {
			x: posX - width + offsetX,
			y: posY + height + offsetY
		}
		this.corner[3] = {
			x: posX + width + offsetX,
			y: posY + height + offsetY
		}
	}

    this.draw = function() {
        canvasContext.fillStyle = 'yellow';
        for (i = 0; i < this.corner.length; i++) {
            canvasContext.fillRect(this.corner[i].x, this.corner[i].y, 1, 1);
        }
    }
}
