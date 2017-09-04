function boxColliderClass(x, y, width, height, offsetX, offsetY) {
    var width = width;
    var height = height;
    var corner = [];
    var lastX = x;
    var lastY = y;
    this.x = x;
    this.y = y;

    this.update = function(posX, posY) {
        this.setCollider(posX, posY);
        for (i = 0; i < corner.length; i++) {
            var tileIndex = getTileIndexAtPixelCoord(corner[i].x, corner[i].y);
            corner[i].collisionIndex = tileIndex;
        }
    }

    this.setCollider = function(posX, posY) {
		corner[0] = {
			x: posX - width + offsetX,
			y: posY - height + offsetY
		}
		corner[1] = {
			x: posX + width + offsetX,
			y: posY - height + offsetY
		}
		corner[2] = {
			x: posX - width + offsetX,
			y: posY + height + offsetY
		}
		corner[3] = {
			x: posX + width + offsetX,
			y: posY + height + offsetY
		}
        lastX = this.x;
        lastY = this.y;
        this.x = posX;
        this.y = posY;
	}

    this.checkCollider = function() {
        return {
            topLeft: corner[0].collisionIndex,
            topRight: corner[1].collisionIndex,
            bottomLeft: corner[2].collisionIndex,
            bottomRight: corner[3].collisionIndex
        }
    }

    // TODO: undoCollision() needs to be rewritten
    this.undoCollision = function(tileType, cornerIndex) {
        var emergencyTimer = 10;
        var originalTileType = tileType;
        while (tileType == originalTileType) {
            var angle = Math.atan2(lastY - this.y, lastX - this.x);
            this.x += Math.cos(angle);
            this.y += Math.sin(angle);
            this.setCollider(this.x, this.y);
            var tileIndex = getTileIndexAtPixelCoord(corner[i].x, corner[i].y);
            tileType = worldGrid[tileIndex];
            emergencyTimer--;
            if(emergencyTimer == 0) {
                this.x = lastX;
                this.y = lastY;
                break;
            }
        }
        return {
            x: this.x,
            y: this.y
        }
    }

    this.draw = function() {
        //this.setCollider(lastX, lastY);
        canvasContext.fillStyle = 'yellow';
        for (i = 0; i < corner.length; i++) {
            canvasContext.fillRect(corner[i].x, corner[i].y, 1, 1);
        }
        //this.setCollider(lastX, lastY);
    }
}
