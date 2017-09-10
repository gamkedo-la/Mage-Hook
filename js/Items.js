const ITEMS_DROPPED_PER_KILL = 20;
const MIN_ITEM_SPEED = 2;
const MAX_ITEM_SPEED = 4;
const UNTANGLE_SPEED = .5;
const WALL_PUSH_SPEED = 5;
const UNTANGLE_TIME_LIMIT = 1.5;
const ITEM_FRICTION = .92;
const ITEM_KEY = 1;
const ITEM_POTION = 2;
const ITEM_KEY_RUBY = 3;
const ITEM_KEY_EMERALD = 4;

function itemClass(posX, posY, speed, type) {
    this.x = posX;
    this.y = posY;
    this.type = type;
    this.canBePickedUp = false;
    var untangleTimer = UNTANGLE_TIME_LIMIT;
    var speed = speed;
    var angle = Math.random() * Math.PI * 2;
    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();
	switch (type){
		case(ITEM_KEY):
            this.sprite.setSprite(worldPics[TILE_KEY], 20, 20, 1, 0, true);
            var colliderWidth = 10;
            var colliderHeight = 14;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		case(ITEM_KEY_RUBY):
            this.sprite.setSprite(worldPics[TILE_KEY_RUBY], 20, 20, 1, 0, true);
            var colliderWidth = 10;
            var colliderHeight = 14;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		case(ITEM_KEY_EMERALD):
            this.sprite.setSprite(worldPics[TILE_KEY_EMERALD], 20, 20, 1, 0, true);
            var colliderWidth = 10;
            var colliderHeight = 14;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		case(ITEM_POTION):
            this.sprite.setSprite(heartHalfPic, 7, 7, 1, 0);
            var colliderWidth = 7;
            var colliderHeight = 7;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
	}

	this.collider = new boxColliderClass(this.x, this.y,
								         colliderWidth, colliderHeight,
						                 colliderOffsetX, colliderOffsetY);

    this.update = function() {

        var checksPerFrame = 5;
        var movePerCheck;

        movePerCheck = velX / checksPerFrame;
        if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                                checksPerFrame, movePerCheck, X_AXIS)) {
            velX = -velX;
        }
        movePerCheck = velY / checksPerFrame;
        if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                                checksPerFrame, movePerCheck, Y_AXIS)) {
            velY = -velY;
        }

        velX *= ITEM_FRICTION;
        velY *= ITEM_FRICTION;

        // Code below is to visually and physically untangle items but
        // I realize it might unnecessary. I mostly wanted to see if I
        // could do it. =D
        if (untangleTimer > 0) {
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
                                                            checksPerFrame, movePerCheck, X_AXIS)) {
                        velX = -velX;
                    }

                    movePerCheck = moveY / checksPerFrame;
                    if (moveOnAxisAndCheckForTileCollisions(this, this.collider,
                                                            checksPerFrame, movePerCheck, Y_AXIS)) {
                        velY = -velY;
                    }
                }
            }

            untangleTimer -= TIME_PER_TICK;

        } else if (!this.canBePickedUp) {
            velX = 0;
            velY = 0;
            this.canBePickedUp = true;
        }
        this.tileBehaviorHandler();
    }

    this.draw = function() {
        this.sprite.draw(this.x, this.y);
        if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
            this.collider.draw('lime');
        }
    }

    this.updateColliders = function() {
        this.collider.update(this.x, this.y);
    }

    this.collisionHandler = function(tileIndex) {
        var collisionDetected = true;
        var tileType = worldGrid[tileIndex];
        switch(tileType) {
            case TILE_SKULL:
                break;
            case TILE_DOOR:
                break;
			case TILE_DOOR_RUBY:
                break;
			case TILE_DOOR_EMERALD:
                break;
            case TILE_WALL:
                break;
            default:
                collisionDetected = false;
                break;
        }
        return collisionDetected;
    }

    this.tileBehaviorHandler = function() {

        var types = this.collider.checkTileTypes();
        for (var i = 0; i < types.length; i++) {
            switch (types[i]) {
                case TILE_WEB:
                    velX *= WEB_FRICTION;
                    velY *= WEB_FRICTION
                    break;
                default:
                    break;
            }
        }
    }
}

function dropItem(x, y, type) {
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var tempItem = new itemClass(x, y, speed, type);
    currentRoom.itemOnGround.push(tempItem);
}

function placeItem(x, y, room, type) {
    var speed = 0;
    var tempItem = new itemClass(x, y, speed, type);
    room.itemOnGround.push(tempItem);
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
        if (item.canBePickedUp && collider.isCollidingWith(item.collider)) {
            item.remove = true;

            switch(item.type) {
                case ITEM_KEY:
                	player.inventory.keys++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
					break;
				case ITEM_POTION:
					if (player.currentHealth < player.maxHealth)
						player.currentHealth++;
					Sound.play('key_pickup', false, 0.1);
					break;
				case ITEM_KEY_RUBY:
                	player.inventory.keysRuby++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
					break;
				case ITEM_KEY_EMERALD:
                	player.inventory.keysEmerald++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
					break;
            }
        }
    }
}
