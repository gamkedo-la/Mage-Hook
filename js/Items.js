const ITEMS_DROPPED_PER_KILL = 20;
const MIN_ITEM_SPEED = 2;
const MAX_ITEM_SPEED = 4;
const UNTANGLE_SPEED = 1;
const GIVE_UP_UNTANGLE = 2;

function itemClass(posX, posY) {
    this.x = posX;
    this.y = posY;
    var giveUpTimer = GIVE_UP_UNTANGLE;
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var angle = Math.random() * Math.PI * 2;
    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();
    this.sprite.setSprite(worldPics[TILE_KEY], 20, 20, 1, 0, true);

    var colliderWidth = 10;
	var colliderHeight = 14;
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

        // Code below is to visually and physically untangle items but
        // I realize it might unnecessary. I mostly wanted to see if I
        // could do it. =D
        if (giveUpTimer > 0) {
            for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
                var item = currentRoom.itemOnGround[i];
                if (this != item && this.collider.isCollidingWith(item.collider)) {
                    var angle = calculateAngleFrom(item.collider, this.collider);
                    var moveX = Math.cos(angle) * UNTANGLE_SPEED;
                    var moveY = Math.sin(angle) * UNTANGLE_SPEED;

                    var checksPerFrame = 5;
                    var movePerCheck;

                    movePerCheck = moveX / checksPerFrame;
                    if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                                            checksPerFrame, movePerCheck,
                                                            X_AXIS)) {
                    }
                    movePerCheck = moveY / checksPerFrame;
                    if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                                            checksPerFrame, movePerCheck,
                                                            Y_AXIS)) {
                    }
                }
            }

            giveUpTimer -= TIME_PER_TICK;

        }
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

function calculateAngleFrom(object1, object2) {
    var x1 = object1.x;
    var x2 = object2.x;
    var y1 = object1.y;
    var y2 = object2.y;
    var angle = Math.atan2(y2-y1,x2-x1);
    return angle;
}
