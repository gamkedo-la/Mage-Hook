var _DEBUG_DRAW_COLLIDERS = false;

function boxColliderClass(x, y, width, height, offsetX, offsetY) {
    this.width = width;
    this.height = height;
    this.x = x + offsetX;
    this.y = y + offsetY;
    this.box = {};

    this.setCollider = function(posX, posY) {

		this.box.topLeft = {
			x: posX - this.width/2 + offsetX,
			y: posY - this.height/2 + offsetY
		}

		this.box.topRight = {
			x: posX + this.width/2 + offsetX,
			y: posY - this.height/2 + offsetY
		}

		this.box.bottomLeft = {
			x: posX - this.width/2 + offsetX,
			y: posY + this.height/2 + offsetY
		}

		this.box.bottomRight = {
            x: posX + this.width/2 + offsetX,
			y: posY + this.height/2 + offsetY
    	}
        this.x = posX + offsetX;
        this.y = posY + offsetY;
	}
    this.setCollider(x, y);

    this.isCollidingWith = function(rectX, rectY, rectWidth, rectHeight) {

        var myLeft = this.box.topLeft.x;
        var myRight = this.box.topLeft.x + this.width;
        var myTop = this.box.topLeft.y;
        var myBottom = this.box.topLeft.y + this.height;
        var theirLeft = rectX;
        var theirRight = rectX + rectWidth;
        var theirTop = rectY;
        var theirBottom = rectY + rectHeight;
        return ((myLeft > theirRight || // I'm right of them
                myRight < theirLeft || // I'm left of them
                myTop > theirBottom || // I'm below them
                myBottom < theirTop) // I'm above them
                == false); // if none of the above are true, boxes don't overlap

        // NOTE(Cipherpunk): Thanks, Chris!
    }

    this.update = function(posX, posY) {
        this.setCollider(posX, posY);
    }

    this.draw = function() {
        for (var corner in this.box) {
            colorRect(this.box[corner].x, this.box[corner].y, 1, 1, 'yellow');
        }
        colorRect(this.x, this.y, 1, 1, 'lime');
    }
}
