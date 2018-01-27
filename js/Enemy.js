var INITIAL_AI_STATE = "derpAround";
var _TEST_AI_PATHFINDING = false;  // a-star pathfinding at all times
var _DEBUG_DRAW_AI_PATHS = false; // so handy

function enemyClass(newEnemy, states){
	//states is just an object of fuuuunctions

	var velX;
	var velY;
	var directionTimer;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;
	this.name == newEnemy.name;
	this.x = newEnemy.x;
	this.y = newEnemy.y;
	this.maxHealth = newEnemy.maxHealth; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = newEnemy.lootModifier;
	this.recoil = false;
	this.isAlive = true;
	this.droppedTile = newEnemy.droppedTile;
	this.enemyData = newEnemy;
	this.enemyData.monsterRef = this ///NOoooooooooooooooo TT_TT

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
		if (this.currentHealth <= 0 || this.isDying) {
			if(this.stateMachine.dying && !this.isDying){ //if this.isDying is being used, then it has a death state
				this.die(this.lastHitBy || player); // if unknown. assume the player hit us
			} else if(!this.stateMachine.dying){
				this.die(this.lastHitBy || player);
			}
			return true;
		}
		return false
	}
	this.getHit = function getHit(amount){
		this.currentHealth -= amount + attackBuff;
		//console.log(amount + attackBuff);
		//TODO: make silly face

	}
	this.ticksInState = 0;
	this.currentState = function(){}//Gets overwritten by state;
	var freshState;	
	this.update = function(){

		if(this.isDead() && !this.stateMachine.dying)
			return;

		freshState = false;
		this.currentState();

		if(!freshState)
			this.ticksInState += 1;

		if (_TEST_AI_PATHFINDING){
			this.updatePathfinding(); 
		}
	} 

	this.setState = function(newState){
		if(this.isDying){
			return;
		}

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
				this.setState(INITIAL_AI_STATE)
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
			this.sprite.setFrame(2);
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

				this.velX = Math.cos(angle) * speed;
				this.velY = Math.sin(angle) * speed;
				this.sprite.setSprite(newEnemy.spriteSheet,
					newEnemy.spriteWidth, newEnemy.spriteHeight,
					newEnemy.spriteFrames, newEnemy.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == newEnemy.spriteSheet && newEnemy.spriteSheetEast){
					if(this.velX > 0){
						var frames = newEnemy.spriteSheetEastFrames ? newEnemy.spriteSheetEastFrames : newEnemy.spriteFrames;
						this.sprite.setSprite(newEnemy.spriteSheetEast,
							newEnemy.spriteWidth, newEnemy.spriteHeight, 
							frames, newEnemy.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == newEnemy.spriteSheetEast){
					if(this.velX < 0){

						this.sprite.setSprite(newEnemy.spriteSheet,
							newEnemy.spriteWidth, newEnemy.spriteHeight, 
							newEnemy.spriteFrames, newEnemy.spriteSpeed, true);	
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}
	}
	
	//TODO: should I wrap this in an init function? 
	//loads states 
	for(var i in states){
		this.stateMachine[i] = states[i]; //no error checking yet :3	
	}
	
	if(!newEnemy.initialState)
		newEnemy.initialState = INITIAL_AI_STATE;

	this.setState(newEnemy.initialState)

	//TODO: make dying state so we can play that sweet sweet slime death animation
	this.die = function(attackedBy) { //TODO: make die a state? 
		console.log('An enemy died!');

		this.enemyData.deadEvent();
		if(!this.stateMachine.dying){
			this.isAlive = false;
			this.x = -99999999;
			this.y = -99999999;
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
		if (_DEBUG_DRAW_AI_PATHS)
		{
			// this is a strange place to update the pathfinding
			// but other classes override default functions here
			

			if (this.currentPath && this.currentPath.length>1)
			{
				for (var rp=0; rp<this.currentPath.length-1; rp++)
				{
					colorLine(
						this.currentPath[rp][0]*WORLD_W+WORLD_W/2,
						this.currentPath[rp][1]*WORLD_H,
						this.currentPath[rp+1][0]*WORLD_W+WORLD_W/2,
						this.currentPath[rp+1][1]*WORLD_H,
						"rgba(255,0,0,0.25)");
				}
			}
		}
	}

	this.updatePathfinding = function() {
		//console.log("Pathfinding...");
		//console.log("a-star data row count is " + currentRoom.pathfindingdata.length);
		var playertile = getTileIndexAtPixelCoord(player.x, player.y);
		var playerrowcol = ArrayIndexToColRow(playertile);
		colorRect(playerrowcol[0] * 20, playerrowcol[1] * 20, 20,20, "rgba(255,0,0,0.25)")

		var enemytile = getTileIndexAtPixelCoord(this.x, this.y);
		var enemyrowcol = ArrayIndexToColRow(enemytile);
		colorRect(enemyrowcol[0]*20, enemyrowcol[1]*20, 20,20, "rgba(255,0,0,0.25)")

		currentRoom.updatePathfindingData();

		this.currentPath = AStarPathfinding.findPath(currentRoom.tempPathFindingData,enemyrowcol,playerrowcol);
		//console.log("New path length: " + this.currentPath.length);
		if (this.currentPath.length==0) // imposible to get to player from here?
		{
			// console.log("An enemy cannot find a path to get to player!");
			// FIXME: move randomly then?
		}
		else
		{
			//console.log('Enemy rowcol = ' + enemyrowcol[0]+','+enemyrowcol[1]);
			//console.log('Player rowcol = ' + playerrowcol[0]+','+playerrowcol[1]);
			//console.log("Destination xy=: " + this.currentPath[this.currentPath.length-1][0]+','+this.currentPath[this.currentPath.length-1][1]);
			// FIXME: the destination x,y of a successful pathfind is WRONG!
			// This mean the algorithm is buggy now - was it the user contributed "fixes" 
			// or non-square world array?
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
			case TILE_PIT_HORIZONTAL_TOP:
			case TILE_TOP_LEFT_PIT_CORNER:
			case TILE_TOP_RIGHT_PIT_CORNER:
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
