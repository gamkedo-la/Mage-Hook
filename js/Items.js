const ITEMS_DROPPED_PER_KILL = 3;
const MIN_ITEM_SPEED = 1.5;
const MAX_ITEM_SPEED = 4.5;

function itemClass(posX, posY) {
    this.x = posX;
    this.y = posY;
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var angle = Math.random() * Math.PI * 2;
    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();
    this.sprite.setSprite(worldPics[TILE_KEY], 20, 20, 1, 0, true);

    var colliderWidth = 4;
	var colliderHeight = 4;
	var colliderOffsetX = 0;
	var colliderOffsetY = 0;

	this.collider = new boxColliderClass(this.x, this.y,
								         colliderWidth, colliderHeight,
						                 colliderOffsetX, colliderOffsetY);

    this.update = function() {
        var checksPerFrame = 5;
        var movePerCheck;

        movePerCheck = velX / checksPerFrame;
        if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                            checksPerFrame, movePerCheck,
                                            X_AXIS)) {
            velX = -velX;
        }
        movePerCheck = velY / checksPerFrame;
        if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                            checksPerFrame, movePerCheck,
                                            Y_AXIS)) {
            velY = -velY;
        }

        velX *= FRICTION;
        velY *= FRICTION;
    }

    this.draw = function() {
        this.sprite.draw(this.x, this.y);
        if(_DEBUG_DRAW_TILE_COLLIDERS) {
            this.collider.draw('lime');
        }
    }

    this.updateColliders = function() {
        this.collider.update(this.x, this.y);
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

function pickUpItems(collider) {
    if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

    for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
        var item = currentRoom.itemOnGround[i];
        if (collider.isCollidingWith(item.collider)) {
            item.remove = true;
        }
    }
}
