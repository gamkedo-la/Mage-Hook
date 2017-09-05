var _DEBUG_DRAW_COLLIDERS = false;

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

    this.centerX = function() {
        return this.x + offsetX;
    }
    this.centerY = function() {
        return this.y + offsetY;
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
        /*
        // proposed alternate way to write the above

        var myLeft = this.box.topLeft.x;
        var myRight = this.box.topLeft.x + this.width;
        var myTop = this.box.topLeft.y;
        var myBottom = this.box.topLeft.y + this.height;
        var theirLeft = boxCollider.box.topLeft.x;
        var theirRight = boxCollider.box.topLeft.x + boxCollider.width;
        var theirTop = boxCollider.box.topLeft.y;
        var theirBottom = boxCollider.box.topLeft.y + boxCollider.height;
        return ((myLeft > theirRight || // I'm right of them
                myRight < theirLeft || // I'm left of them
                myTop > theirBottom || // I'm below them
                myBottom < theirTop) // I'm above them
                == false); // if none of the above are true, boxes don't overlap
        */
    }

    this.draw = function() {
        for (var corner in this.box) {
            colorRect(this.box[corner].x, this.box[corner].y, 1, 1, 'yellow');
        }
        colorRect(this.x, this.y, 1, 1, 'orange');
        colorRect(this.centerX(), this.centerY(), 1, 1, 'lime');
    }
}
