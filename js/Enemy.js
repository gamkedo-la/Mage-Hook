function enemyClass(newEnemy, states){
	//states is just an object of fuuuunctions

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
	this.enemyData = newEnemy;

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
	this.isDead = function (){
		if (this.currentHealth <= 0) {
			this.die(this.lastHitBy || player); // if unknown. assume the player hit us
			return true;
		}
		return false
	}
	this.ticksInState = 0;
	this.currentState = function(){}//Gets overwritten by state;
	var freshState;	
	this.update = function(){
		
		if(this.isDead())
			return;
		freshState = false;
		this.currentState();
		if(!freshState)
			this.ticksInState += 1;
	} 

	this.setState = function(newState){
		//TODO:forgive myself for the string comparison
		if(typeof this.stateMachine[newState] === "function"){
			this.currentState = this.stateMachine[newState]
		} else {
			throw "ayy, so this isn't a state that can be ran"
		}
		freshState = true;
		this.ticksInState = 0;
		directionTimer = undefined;
	}

	
	this.stateMachine = {
		normal : function(){		
			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(newEnemy.spriteSheet, //TODO: maybe derp emote? 
					newEnemy.spriteWidth, newEnemy.spriteHeight,
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);

				// this.sprite.setSprite(sprites.Player.rangedAttack, //TODO: maybe derp emote? 
				// 	newEnemy.spriteWidth, newEnemy.spriteHeight,
				// 	4, 10, true);
			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}, 
		testDistance : function(){
			if(mDist(this.x, this.y, player.x, player.y) < 80){
				this.setState("charge")
				return;
			}
		},
		derpAround : function(){
			var willWander = Math.random() * 5;
			if(willWander > 1){
				this.setState("wander")
			} else if (willWander < 3) {
				this.setState("normal")
			}
		},
		recoil : function(){
			if (!player.isStunned) {					
				this.sprite.setSprite(newEnemy.spriteSheet, //TODO: maybe derp emote? 
					newEnemy.spriteWidth, newEnemy.spriteHeight,
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);	
				this.setState("normal")
			}
		},
		charge : function(){
			if(this.ticksInState > 1000 && mDist(this.x, this.y, player.x, player.y) > 10){
				this.setState("derpAround")
				return;
			}
			var speed = 2 //TODO: make charge speed a variable in newEnemy
			var angle = Math.atan2(player.y - this.y, player.x - this.x);
			velX = Math.cos(angle) * speed;
			velY = Math.sin(angle) * speed;

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		wander : function(){
			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				velX = Math.cos(angle) * speed;
				velY = Math.sin(angle) * speed;
				this.sprite.setSprite(newEnemy.spriteSheet,
					newEnemy.spriteWidth, newEnemy.spriteHeight,
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == newEnemy.spriteSheet && newEnemy.spriteSheetEast){
					if(velX > 0){
						var frames = newEnemy.spriteSheetEastFrames ? newEnemy.spriteSheetEastFrames : newEnemy.spriteFrames;
						this.sprite.setSprite(newEnemy.spriteSheetEast,
							newEnemy.spriteWidth, newEnemy.spriteHeight, 
							frames, newEnemy.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == newEnemy.spriteSheetEast){
					if(velX < 0){

						this.sprite.setSprite(newEnemy.spriteSheet,
							newEnemy.spriteWidth, newEnemy.spriteHeight, 
							newEnemy.spriteFrames, newEnemy.spriteSpeed, true);	
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}
	}
	
	//TODO: should I wrap this in an init function? 
	//loads states 
	for(var i in states){
		this.stateMachine[i] = states[i]//no error checking yet :3	
	}
	if(!newEnemy.initialState)
		newEnemy.initialState = "normal"

	this.setState(newEnemy.initialState)

	//TODO: make dying state so we can play that sweet sweet slime death animation
	this.die = function(attackedBy) { //TODO: make die a state? 
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
			case TILE_WALL_NORTH_TORCH:
			case TILE_WALL_SOUTH_TORCH:
			case TILE_WALL_WEST_TORCH:
			case TILE_WALL_EAST_TORCH:
			case TILE_SMALL_WALL_HORIZ:
			case TILE_SMALL_WALL_VERT:
			case TILE_SMALL_WALL_PILLAR:
			case TILE_SMALL_WALL_NE:
			case TILE_SMALL_WALL_NW:
			case TILE_SMALL_WALL_SE:
			case TILE_SMALL_WALL_SW:
			case TILE_SMALL_WALL_CAP_EAST:
			case TILE_SMALL_WALL_CAP_WEST:
			case TILE_SMALL_WALL_CAP_NORTH:
			case TILE_SMALL_WALL_CAP_SOUTH:
			case TILE_SMALL_WALL_INTO_BIG_EAST:
			case TILE_SMALL_WALL_INTO_BIG_WEST:
			case TILE_SMALL_WALL_INTO_BIG_NORTH:
			case TILE_SMALL_WALL_INTO_BIG_SOUTH:
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

	this.spriteSheet = sprites.ArmsBro.walkAnimation;
	this.spriteSheetEast = sprites.ArmsBro.walkAnimationEast;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
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

function mDist(x1,y1,x2,y2){
    return Math.abs(x2-x1) + Math.abs(y2-y1);
}
