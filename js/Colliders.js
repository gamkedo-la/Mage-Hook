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
    this.uniqueTileTypes = [];

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
        canvasContext.strokeRect(x, y, this.width, this.height);
    }
}

function calculateAngleFrom(object1, object2) {
    var x1 = object1.x;
    var x2 = object2.x;
    var y1 = object1.y;
    var y2 = object2.y;
    var angle = Math.atan2(y2-y1,x2-x1);
    return angle;
}

function calculateCenterCoordOfTileIndex(tileIndex) {
    var topLeftX = (tileIndex % WORLD_COLS) * WORLD_W;
    var topLeftY = Math.floor(tileIndex / WORLD_COLS) * WORLD_H;
    var centerX = topLeftX + WORLD_W/2;
    var centerY = topLeftY + WORLD_H/2;
    return {
        x: centerX,
        y: centerY
    };
}

// NOTE(Cipherpunk): See template below to add to class
moveOnAxisAndCheckForTileCollisions = function(objectToMove, colliderToCheck,
                                               checksPerFrame, movePerCheck, axis) {
    for (var i = 0; i < checksPerFrame; i++) {
        var collisionDetected = false;
        var wallCollisionDetected = false;
        var origin = objectToMove[axis];

        objectToMove[axis] += movePerCheck;
        objectToMove.updateColliders();


        for (var corner in colliderToCheck.box) {
            var x = colliderToCheck.box[corner].x;
            var y = colliderToCheck.box[corner].y;
            var tileIndex = getTileIndexAtPixelCoord(x, y);
            // check if there's a collision at the new corner coord
            collisionDetected = objectToMove.collisionHandler(tileIndex);

            if (this.uniqueTileTypes == undefined) {
                this.uniqueTileTypes = [];
            }
            if (this.uniqueTileTypes.indexOf(worldGrid[tileIndex]) != -1) {
                this.uniqueTileTypes.push(worldGrid[tileIndex]);
            }
            if (collisionDetected) {
                // revert object position
                objectToMove[axis] = origin;
                objectToMove.updateColliders();

                // make another check to see if this started in wall
                x = colliderToCheck.box[corner].x;
                y = colliderToCheck.box[corner].y;
                tileIndex = getTileIndexAtPixelCoord(x, y);
                wallCollisionDetected = objectToMove.collisionHandler(tileIndex);

                if (wallCollisionDetected) {
                    //TODO: Set this[axis] to the edge of the wall
                    var offset;
                    var result = calculateCenterCoordOfTileIndex(tileIndex);
                    if (axis == X_AXIS) {
                        offset = colliderToCheck.width/2 + WORLD_W/2 + 1;
                    } else {
                        offset = colliderToCheck.height/2 + WORLD_H/2 + 1;
                    }
                    if (colliderToCheck[axis] > result[axis]) {
                        objectToMove[axis] = result[axis] + offset;
                    } else {
                        objectToMove[axis] = result[axis] - offset;
                    }
                    objectToMove.updateColliders();
                }
                return collisionDetected;
            }
        }
    }
    return collisionDetected;
}

/* NOTE(Cipherpunk): Below is a template to add to each class
   so that it can use moveOnAxisAndCheckForTileCollisions().
   Cases that are not needed can be deleted from switch statement.

this.updateColliders = function() {
    this.collider.update(this.x, this.y);
    // More colliders can be added here.
}

this.tileBehaviorHandler = function() {
    for (var i = 0; i < this.uniqueTileTypes.length; i++) {
        switch (collidedWithTheseTileTypes[i]) {
            case TILE_GROUND:
                break;
            case TILE_WALL:
                break;
            case TILE_OOZE:
                break;
            case TILE_WEB:
                break;
            case TILE_DOOR:
                break;
            default:
                break;
        }
    }
    this.uniqueTileTypes = [];
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
