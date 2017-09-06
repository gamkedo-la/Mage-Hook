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

// NOTE(Cipherpunk): See template below to add to class
moveOnAxisAndCheckForTileCollisions = function(objectToMove, checksPerFrame, movePerCheck, axis) {
    for (var i = 0; i < checksPerFrame; i++) {
        var collisionDetected = false;
        var origin = objectToMove[axis];

        objectToMove[axis] += movePerCheck;
        objectToMove.updateColliders();

        for (var corner in objectToMove.collider.box) {
            var x = objectToMove.collider.box[corner].x;
            var y = objectToMove.collider.box[corner].y;
            var tileIndex = getTileIndexAtPixelCoord(x, y);
            collisionDetected = objectToMove.collisionHandler(tileIndex);

            if (collisionDetected) {
                objectToMove[axis] = origin;
                objectToMove.updateColliders();
                return;
            }
        }
    }
}

/* NOTE(Cipherpunk): Below is a template to add to each class
   so that it can use moveOnAxisAndCheckForTileCollisions().
   Cases that are not needed can be deleted from switch statement.

this.updateColliders = function() {
    this.collider.update(this.x, this.y);
    // More colliders can be added here.
}

this.collisionHandler = function(tileIndex) {
    var collisionDetected = false;
    var tileType = worldGrid[tileIndex];
    switch(tileType) {
        case TILE_GROUND:
            break;
        case TILE_KEY:
            break;
        case TILE_DOOR:
            break;
        case TILE_SKULL:
            collisionDetected = true;
            break;
        case TILE_DOOR:
            collisionDetected = true;
            break;
        case TILE_WALL:
            collisionDetected = true;
            break;
        default:
            break;
    }
    return collisionDetected;
}
*/
