var _DEBUG_DRAW_COLLIDERS = true;

function boxColliderClass(x, y, width, height, offsetX, offsetY) {
    this.width = width;
    this.height = height;
    this.x = x + offsetX;
    this.y = y + offsetY;
    this.box = {};

    this.setCollider = function(posX, posY) {
        var x = posX - this.width/2 + offsetX;
        var y = posY - this.height/2 + offsetY;
		this.box.topLeft = {
			x: x,
			y: y,
		}

        x = posX + this.width/2 + offsetX;
        y = posY - this.height/2 + offsetY;
		this.box.topRight = {
			x: x,
			y: y,
		}

        x = posX - this.width/2 + offsetX;
        y = posY + this.height/2 + offsetY;
		this.box.bottomLeft = {
			x: x,
			y: y,
		}

        x = posX + this.width/2 + offsetX;
        y = posY + this.height/2 + offsetY;
		this.box.bottomRight = {
            x: x,
			y: y,
    	}
        this.x = posX + offsetX;
        this.y = posY + offsetY;
        //this.centerX = this.x + offsetX;
        //this.centerY = this.y + offsetY;
	}
    this.setCollider(this.x, this.y);

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
        //colorRect(this.centerX, this.centerY, 1, 1, 'lime');
    }
}
