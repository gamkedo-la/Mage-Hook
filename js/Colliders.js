function boxColliderClass(x, y, width, height, offsetX, offsetY, blockedBy) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.box = {};
    this.blockedBy = blockedBy;

    this.update = function(posX, posY) {
        this.setCollider(posX, posY);
    }

    this.setCollider = function(posX, posY) {
        var x = posX - this.width/2 + offsetX;
        var y = posY - this.height/2 + offsetY;
		this.box.topLeft = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX + this.width/2 + offsetX;
        y = posY - this.height/2 + offsetY;
		this.box.topRight = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX - this.width/2 + offsetX;
        y = posY + this.height/2 + offsetY;
		this.box.bottomLeft = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
		}

        x = posX + this.width/2 + offsetX;
        y = posY + this.height/2 + offsetY;
		this.box.bottomRight = {
			x: x,
			y: y,
            index: getTileIndexAtPixelCoord(x, y)
    	}

        lastX = this.x;
        lastY = this.y;
        this.x = posX;
        this.y = posY;
	}

    this.getTileIndexes = function() {
        return {
            topLeft: this.box.topLeft.index,
            topRight: this.box.topRight.index,
            bottomLeft: this.box.bottomLeft.index,
            bottomRight: this.box.bottomRight.index
        }
    }

    this.isCollidingWith = function(boxCollider) {
        var isColliding = false;
        if (this.box.topLeft.x < boxCollider.box.topLeft.x + boxCollider.width &&
            this.box.topLeft.x + this.width > boxCollider.box.topLeft.x &&
            this.box.topLeft.y < boxCollider.box.topLeft.y + boxCollider.height &&
            this.box.topLeft.y + this.height> boxCollider.box.topLeft.y) {

                isColliding = true;
            }
        return isColliding;
    }

    this.draw = function() {
        /*
        canvasContext.strokeStyle = 'yellow';
        canvasContext.strokeRect(this.box.topLeft.x,
                                 this.box.topLeft.y,
                                 this.width, this.height);
        */
        for (var corner in this.box) {
            colorRect(this.box[corner].x, this.box[corner].y, 1, 1, 'yellow');
        }
    }
}

function checkForCollisionsWithPlayer() {
    for (var i = 0; i < currentRoom.enemyList.length; i++) {

        if(player.hitbox.isCollidingWith(currentRoom.enemyList[i].hitbox)) {
            console.log("COLLIDING!")
        }
    }
}
