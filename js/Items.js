const ITEMS_DROPPED_PER_KILL = 3;
const MIN_ITEM_SPEED = 5;
const MAX_ITEM_SPEED = 10;

function itemClass(posX, posY) {
    var x = posX;
    var y = posY;
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var angle = Math.random() * Math.PI * 2;
    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();

    var colliderWidth = 5;
	var colliderHeight = 10;
	var colliderOffsetX = 0;
	var colliderOffsetY = 0;

	this.collider = new boxColliderClass(x, y,
								         colliderWidth, colliderHeight,
						                 colliderOffsetX, colliderOffsetY);

    this.update = function() {
        var checksPerFrame = 5;
        var movePerCheck = velX / checksPerFrame;
        moveOnAxisAndCheckForTileCollisions(this, this.collider, checksPerFrame, movePerCheck, X_AXIS);
        movePerCheck = velY / checksPerFrame;
        moveOnAxisAndCheckForTileCollisions(this, this.collider, checksPerFrame, movePerCheck, Y_AXIS);
    }

    this.draw = function() {
        // add sprites later
        if(_DEBUG_DRAW_TILE_COLLIDERS) {
            this.collider.draw('lime');
        }
    }

    this.updateColliders = function() {
        this.collider.update(x, y);
    }

    this.collisionHandler = function(tileIndex) {
        var collisionDetected = false;
        var tileType = worldGrid[tileIndex];
        switch(tileType) {
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
}

function createItem(x, y) {
    var tempItem = new itemClass(x, y);
    currentRoom.itemOnGround.push(tempItem);
}

function updateItems() {
    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        currentRoom.itemOnGround[i].update();
    }
    for (var i = currentRoom.itemOnGround.length -1; i >= 0; i--) {
        currentRoom.itemOnGround[i].update();
        if (currentRoom.itemOnGround[i].remove) {
            currentRoom.itemOnGround.splice(i, 1);
        }
    }
}

function drawItems() {
    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        currentRoom.itemOnGround[i].draw();
    }
}
