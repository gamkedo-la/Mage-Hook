const X_AXIS = "x";
const Y_AXIS = "y";
var _DEBUG_DRAW_TILE_COLLIDERS = false;
var _DEBUG_DRAW_HITBOX_COLLIDERS = false;

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

    this.isCollidingWith = function(otherCollider) {

        var myLeft = this.box.topLeft.x;
        var myRight = this.box.topLeft.x + this.width;
        var myTop = this.box.topLeft.y;
        var myBottom = this.box.topLeft.y + this.height;
        var theirLeft = otherCollider.box.topLeft.x;
        var theirRight = otherCollider.box.topLeft.x + otherCollider.width;
        var theirTop = otherCollider.box.topLeft.y;
        var theirBottom = otherCollider.box.topLeft.y + otherCollider.height;
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

    this.draw = function(color) {
        canvasContext.strokeStyle = color;
        canvasContext.lineWidth = 1;
        var x = Math.floor(this.box.topLeft.x) + .5;
        var y = Math.floor(this.box.topLeft.y) + .5;
        // canvasContext.strokeRect(x, y, this.width, this.height);
    }
}

// NOTE(Cipherpunk): See template below to add to class
moveOnAxisAndCheckForTileCollisions = function(objectToMove, colliderToCheck, checksPerFrame, movePerCheck, axis) {
    for (var i = 0; i < checksPerFrame; i++) {
        var collisionDetected = false;
        var origin = objectToMove[axis];

        objectToMove[axis] += movePerCheck;
        objectToMove.updateColliders();

        for (var corner in colliderToCheck.box) {
            if (colliderToCheck.box[corner].x == undefined) {
                continue;
            }
            var x = colliderToCheck.box[corner].x;
            var y = colliderToCheck.box[corner].y;
            var tileIndex = getTileIndexAtPixelCoord(x, y);
            collisionDetected = objectToMove.collisionHandler(tileIndex);

            if (collisionDetected) {
                objectToMove[axis] = origin;
                objectToMove.updateColliders();
                return collisionDetected;
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
