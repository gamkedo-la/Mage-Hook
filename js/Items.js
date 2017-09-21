const MIN_ITEM_SPEED = 2;
const MAX_ITEM_SPEED = 4;
const UNTANGLE_SPEED = .5;
const WALL_PUSH_SPEED = 5;
const UNTANGLE_TIME_LIMIT = 1.5;
const ITEM_FRICTION = .92;
const ITEM_WEB_FRICTION = .75;
const ITEM_KEY_COMMON = 1;
const ITEM_POTION = 2;
const ITEM_KEY_RARE = 3;
const ITEM_KEY_EPIC = 4;
const ITEM_CRYSTAL = 5;

const ITEM_SUCCESS_CHANCE = .70; // affects item drop rate
const ITEM_CRYSTAL_DROP_PERCENT = 80; //all item drop rates should add up to 100
const ITEM_POTION_DROP_PERCENT = 10;
const ITEM_KEY_COMMON_DROP_PERCENT = 5;
const ITEM_KEY_RARE_DROP_PERCENT = 4;
const ITEM_KEY_EPIC_DROP_PERCENT = 1;

const PARTICLES_PER_PICKUP = 32;

function itemClass(posX, posY, speed, type, angle) {
    this.x = posX;
    this.y = posY;
    this.type = type;
    this.canBePickedUp = false;
    var untangleTimer = UNTANGLE_TIME_LIMIT;
    var speed = speed;
    
    if (angle==undefined)
        angle = Math.random() * Math.PI * 2; // random direction
    //else
    //    console.log("Item spawning with an angle of " + angle); // angle of attacker

    var velX = Math.cos(angle) * speed;
    var velY = Math.sin(angle) * speed;

    this.sprite = new spriteClass();
	switch (type){
		case(ITEM_KEY_COMMON):
            this.sprite.setSprite(worldPics[TILE_KEY_COMMON], 20, 20, 1, 0, true);
            var colliderWidth = 10;
            var colliderHeight = 14;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		case(ITEM_KEY_RARE):
            this.sprite.setSprite(worldPics[TILE_KEY_RARE], 20, 20, 1, 0, true);
            var colliderWidth = 10;
            var colliderHeight = 14;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
		case(ITEM_KEY_EPIC):
            this.sprite.setSprite(worldPics[TILE_KEY_EPIC], 20, 20, 1, 0, true);
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
		case(ITEM_CRYSTAL):
		this.sprite.setSprite(worldPics[TILE_CRYSTAL], 20, 20, 1, 0);
            var colliderWidth = 10;
            var colliderHeight = 10;
            var colliderOffsetX = 0;
            var colliderOffsetY = 0;
			break;
	}

	this.collider = new boxColliderClass(this.x, this.y,
								         colliderWidth, colliderHeight,
						                 colliderOffsetX, colliderOffsetY);

    this.update = function() {

        if (this.collider.moveOnAxis(this, velX, X_AXIS)) {
            velX = -velX;
        }
        if (this.collider.moveOnAxis(this, velY, Y_AXIS)) {
            velY = -velY;
        }

        velX *= ITEM_FRICTION;
        velY *= ITEM_FRICTION;

        if (untangleTimer > 0) {

            for (var i = 0; i < currentRoom.itemOnGround.length; i++) {
                var item = currentRoom.itemOnGround[i];

                if (this != item && this.collider.isCollidingWith(item.collider)) {
                    var angle = calculateAngleFrom(item.collider, this.collider);
                    var untangleX = Math.cos(angle) * UNTANGLE_SPEED;
                    var untangleY = Math.sin(angle) * UNTANGLE_SPEED;

                    if (this.collider.moveOnAxis(this, untangleX, X_AXIS)) {
                        velX = -velX;
                    }

                    if (this.collider.moveOnAxis(this, untangleY, Y_AXIS)) {
                        velY = -velY;
                    }
                }

                this.tileBehaviorHandler();
            }

            untangleTimer -= TIME_PER_TICK;

        } else {
            velX = 0;
            velY = 0;
            this.canBePickedUp = true;
        }
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
            case TILE_DOOR_COMMON:
			case TILE_DOOR_RARE:
			case TILE_DOOR_EPIC:
            case TILE_WALL:
			case TILE_WALL_NORTH:
			case TILE_WALL_SOUTH:
			case TILE_WALL_WEST:
			case TILE_WALL_EAST:
			case TILE_WALL_CORNER_NE:
			case TILE_WALL_CORNER_NW:
			case TILE_WALL_CORNER_SE:
			case TILE_WALL_CORNER_SW:
            case TILE_ROOM_DOOR_NORTH:
            case TILE_ROOM_DOOR_SOUTH:
            case TILE_ROOM_DOOR_EAST:
            case TILE_ROOM_DOOR_WEST:
            case TILE_WALL_OUTCORNER_SW:
            case TILE_WALL_OUTCORNER_SE:
            case TILE_WALL_OUTCORNER_NW:
            case TILE_WALL_OUTCORNER_NE:
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
                    velX *= ITEM_WEB_FRICTION;
                    velY *= ITEM_WEB_FRICTION;
                    break;
                default:
                    break;
            }
        }
    }
}

function rollItemQuantity(baseItemAmount, capItemAmount, adjustQuantityByPercentage) {
    var totalItems = baseItemAmount;
    while (Math.random() < ITEM_SUCCESS_CHANCE) {
        totalItems++;
    }
    totalItems *= adjustQuantityByPercentage;
    if (totalItems > capItemAmount) {
        totalItems = capItemAmount;
    }
	console.log(totalItems + " Items Dropped");
    return Math.floor(totalItems);
}

function dropItem(x, y, type, angle) {
    var speed = MIN_ITEM_SPEED + Math.random() * MAX_ITEM_SPEED;
    var tempItem = new itemClass(x, y, speed, type, angle);
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
                case ITEM_KEY_COMMON:
                	player.inventory.keysCommon++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(player.x, player.y, PARTICLES_PER_PICKUP, '#c65e31');
					break;
				case ITEM_KEY_RARE:
                	player.inventory.keysRare++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(player.x, player.y, PARTICLES_PER_PICKUP, '#949494');
					break;
				case ITEM_KEY_EPIC:
                	player.inventory.keysEpic++; // one more key
                    // this.updateKeyReadout();
                    Sound.play('key_pickup', false, 0.1); // 0.1 means 10% volume
                    particleFX(player.x, player.y, PARTICLES_PER_PICKUP, '#d8b800');
					break;
				case ITEM_POTION:
					if (player.currentHealth < player.maxHealth)
						player.currentHealth++;
                    Sound.play('key_pickup', false, 0.1);
                    particleFX(player.x, player.y, PARTICLES_PER_PICKUP, 'red');
					break;
				case ITEM_CRYSTAL:
					player.enemyHitCount++;
					Sound.play('key_pickup', false, 0.1);
                    particleFX(player.x, player.y, PARTICLES_PER_PICKUP, 'blue');
					break;
            }
        }
    }
}
