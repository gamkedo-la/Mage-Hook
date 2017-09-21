function enemyClass(newEnemy){

	var velX;
	var velY;
	var directionTimer;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	this.x = newEnemy.x;
	this.y = newEnemy.y;
	this.maxHealth = newEnemy.maxHealth; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = newEnemy.lootModifier;
	this.recoil = false;
	this.isAlive = true;
	this.droppedTile = newEnemy.droppedTile;

	this.tileCollider = new boxColliderClass(this.x, this.y,
											 newEnemy.tileColliderWidth, newEnemy.tileColliderHeight,
											 newEnemy.tileColliderOffsetX, newEnemy.tileColliderOffsetY);

	this.hitbox = new boxColliderClass(this.x, this.y,
									   newEnemy.hitboxWidth, newEnemy.hitboxHeight,
									   newEnemy.hitboxOffsetX, newEnemy.hitboxOffsetY);

	this.sprite = new spriteClass();
	this.sprite.setSprite(newEnemy.spriteSheet,
						  newEnemy.spriteWidth, newEnemy.spriteHeight,
						  newEnemy.spriteFrames, newEnemy.spriteSpeed, true);

	this.die = function(attackedBy) {
		console.log('An enemy died!');
		
		this.isAlive = false;
		this.x = -99999999;
		this.y = -99999999;
		
		// remove from enemy list
		var foundHere = currentRoom.enemyList.indexOf(this);
		if (foundHere > -1) {
			currentRoom.enemyList.splice(foundHere, 1);
		}
		
		// drop items
		var totalItems = rollItemQuantity(10, 99, this.lootModifier);
		console.log(totalItems + " Items Dropped");
		var tileIndex = getTileIndexAtPixelCoord(this.tileCollider.x, this.tileCollider.y);
		var coord = calculateCenterCoordOfTileIndex(tileIndex); // to prevent items from spawning in walls
		var itemAngle = undefined; // TODO this is WIP code
		for (var i = 0; i < totalItems; i++) {
			if (attackedBy != undefined)
			{
				itemAngle = Math.atan2(coord.y-attackedBy.y,coord.x-attackedBy.x);
				//console.log("Item dropping in this direction: " + itemAngle);
			}
			// TODO: pass attack to this function so we know angle of the HIT, then pass itemAngle to dropItem
			var dropType = Math.random() * 100;
			//in order of most common to least common
			if (dropType <= ITEM_CRYSTAL_DROP_PERCENT)
				dropItem(coord.x, coord.y, ITEM_CRYSTAL,itemAngle);
			else
				dropType -= ITEM_CRYSTAL_DROP_PERCENT;

			if (dropType <= ITEM_POTION_DROP_PERCENT)
				dropItem(coord.x, coord.y, ITEM_POTION,itemAngle);
			else
				dropType -= ITEM_POTION_DROP_PERCENT;

			if (dropType <= ITEM_KEY_COMMON_DROP_PERCENT)
				dropItem(coord.x, coord.y, ITEM_KEY_COMMON,itemAngle);
			else
				dropType -= ITEM_KEY_COMMON_DROP_PERCENT;

			if (dropType <= ITEM_KEY_RARE_DROP_PERCENT)
				dropItem(coord.x, coord.y, ITEM_KEY_RARE,itemAngle);
			else
				dropType -= ITEM_KEY_RARE_DROP_PERCENT;

			if (dropType <= ITEM_KEY_EPIC_DROP_PERCENT)
				dropItem(coord.x, coord.y, ITEM_KEY_EPIC,itemAngle);
			else
				dropType -= ITEM_KEY_EPIC_DROP_PERCENT;
		} // end of total items to drop
		// drop tile on death
		if (newEnemy.droppedTile == undefined) {
			console.log("undefined: no tile dropped");
			return;
		} 
		var tileSouthOfEnemy = worldGrid[tileIndex + WORLD_COLS];
		var tileNorthOfEnemy = worldGrid[tileIndex - WORLD_COLS];
		var tileWestOfEnemy = worldGrid[tileIndex - 1];
		var tileEastOfEnemy = worldGrid[tileIndex + 1];
		var interactiveTiles = [TILE_ROOM_DOOR_NORTH,TILE_ROOM_DOOR_SOUTH,TILE_ROOM_DOOR_EAST,TILE_ROOM_DOOR_WEST,
								TILE_STAIRS_UP,TILE_STAIRS_DOWN,TILE_DOOR_COMMON,TILE_DOOR_RARE,TILE_DOOR_EPIC];
		if ((interactiveTiles.indexOf(tileSouthOfEnemy) > -1) ||
			(interactiveTiles.indexOf(tileNorthOfEnemy) > -1) ||	
			(interactiveTiles.indexOf(tileEastOfEnemy) > -1)  ||
			(interactiveTiles.indexOf(tileWestOfEnemy) > -1)){
			console.log("infront of door/stairs: no tile dropped");
			return;
		}
		if (newEnemy.droppedTile != undefined && worldGrid[tileIndex] == 0) {	
			worldGrid[tileIndex] = this.droppedTile;
			console.log("dropped tile = " + this.droppedTile);
			} else {
			console.log("tile detected: no tile dropped");	
			}
		return;
	} // end of this.die function

	this.update = function(){

		if (this.currentHealth <= 0) {
			this.die(this.lastHitBy || player); // if unknown. assume the player hit us
		}

		if (this.recoil) {
			if (!player.isStunned) {
				resetMovement();
				this.recoil = false;
				this.sprite.setSprite(newEnemy.spriteSheet,
									  newEnemy.spriteWidth, newEnemy.spriteHeight,
									  newEnemy.spriteFrames, newEnemy.spriteHeight, true);
			}
			return;
		}

		if (directionTimer <= 0 || directionTimer == undefined) {
			resetMovement();
		}
		
		this.tileCollider.moveOnAxis(this, velX, X_AXIS);
		this.tileCollider.moveOnAxis(this, velY, Y_AXIS);

		directionTimer -= TIME_PER_TICK;

		if(this.sprite.getSpriteSheet() == sprites.Slug.walkAnimation){
			if(velX > 0){
				this.sprite.setSprite(newEnemy.spriteSheetEast,
					newEnemy.spriteWidth, newEnemy.spriteHeight, 
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);	
			}
		}else if (this.sprite.getSpriteSheet() == sprites.Slug.walkAnimationEast){
			if(velX < 0){
				this.sprite.setSprite(newEnemy.spriteSheet,
					newEnemy.spriteWidth, newEnemy.spriteHeight, 
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);	
			}
		}

		this.sprite.update();
		this.tileBehaviorHandler();
	} // end of this.update()

	function resetMovement() {

		directionTimer = minMoveTime + Math.random() * maxMoveTime;
		var speed = minSpeed + Math.random() * maxSpeed;
		var angle = Math.random() * 2*Math.PI;

		velX = Math.cos(angle) * speed;
		velY = Math.sin(angle) * speed;
	}

	this.draw = function() {
		if (!this.isAlive) return;

		this.sprite.draw(this.x, this.y);
		if(_DEBUG_DRAW_TILE_COLLIDERS) {
            this.tileCollider.draw('lime');
        }
        if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.hitbox.draw('red');
        }
	}

	this.updateColliders = function() {
		this.tileCollider.update(this.x, this.y);
		this.hitbox.update(this.x, this.y);
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
			case TILE_STAIRS_UP:
			case TILE_STAIRS_DOWN:
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

		var types = this.tileCollider.checkTileTypes();
		for (var i = 0; i < types.length; i++) {
			switch (types[i]) {
				default:
					break;
			}
		}
	}
}

function slimeMonster(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.Slime.idleAnimation;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 6;
	this.spriteSpeed = 9;
	
	this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;

	return new enemyClass(this);
}

function slugMonster(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 2; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = TILE_OOZE;

	this.tileColliderWidth = 16;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 16;
	this.hitboxHeight = 10;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.Slug.walkAnimation;
	this.spriteSheetEast = sprites.Slug.walkAnimationEast;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 4;
	this.spriteSpeed = 5;

	return new enemyClass(this);
}

function armsBro(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 5; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = TILE_SKULL;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.ArmsBro.idle;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 6;
	this.spriteSpeed = 9;

	return new enemyClass(this);
}

function trap(x, y) { // most functionality of traps is contained in the player.js tileBehaviorHandler
	var trapImage = worldPics[TILE_TRAP];
	var sprite = new spriteClass();
	this.x = x;
	this.y = y;

	sprite.setSprite(trapImage, 20, 20, 10, 9, true);

	this.update = function() {
		sprite.update();
	}

	this.draw = function() {
		sprite.draw(this.x, this.y);
	}
}
