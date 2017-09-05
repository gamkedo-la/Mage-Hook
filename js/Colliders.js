function boxColliderClass(x, y, width, height, offsetX, offsetY, blockedBy) {
    var width = width;
    var height = height;
    var corners = {};
    var lastX = x;
    var lastY = y;
    this.x = x;
    this.y = y;
    this.blockedBy = blockedBy;

    this.update = function(posX, posY) {
        this.setCollider(posX, posY);
    }

    this.setCollider = function(posX, posY) {
        var x = posX - width + offsetX;
        var y = posY - height + offsetY;
		corners.topLeft = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX + width + offsetX;
        y = posY - height + offsetY;
		corners.topRight = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX - width + offsetX;
        y = posY + height + offsetY;
		corners.bottomLeft = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX + width + offsetX;
        y = posY + height + offsetY;
		corners.bottomRight = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        lastX = this.x;
        lastY = this.y;
        this.x = posX;
        this.y = posY;
	}

    this.checkCollider = function() {
        return {
            topLeft: corners.topLeft.index,
            topRight: corners.topRight.index,
            bottomLeft: corners.bottomLeft.index,
            bottomRight: corners.bottomRight.index
        }
    }

    this.draw = function() {
        canvasContext.fillStyle = 'yellow';
        for (var corner in corners) {
            canvasContext.fillRect(corners[corner].x, corners[corner].y, 1, 1);
        }
    }
}
