const PLAYER_MOVE_SPEED = 3;
const STUN_DURATION = 0.55;
const INITIAL_KNOCKBACK_SPEED = 8;
const FRICTION = 0.80;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var playerAtStartingPosition = true;

	this.x = 110;
	this.y = 120;

	this.name = "Untitled Player";
	this.keysInInventory = 0;
	this.isStunned = false;
	var stunTimer;
	var knockbackAngle;
	var knockbackSpeed;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

/*
	var colliderWidth = 4;
	var colliderHeight = 4;
	var colliderOffsetX = -1;
	var colliderOffsetY = 2;
	this.collider = new boxColliderClass(this.x, this.y,
										colliderWidth, colliderHeight,
										colliderOffsetX, colliderOffsetY);
*/

	var hitboxWidth = 8;
	var hitboxHeight = 10;
	var hitboxOffsetX = -1;
	var hitboxOffsetY = -1;
	blockedBy = [];
	this.hitbox = new boxColliderClass(this.x, this.y,
									   hitboxWidth, hitboxHeight,
								       hitboxOffsetX, hitboxOffsetY,
									   blockedBy);
	var sprite = new spriteClass();

	this.setupInput = function(upKey, rightKey, downKey, leftKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
	}

	this.reset = function(playerName) {
		this.name = playerName;
		if (playerAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 32, 32, 1, 0);
			playerAtStartingPosition = false;
		}
		this.keysInInventory = 0;
		this.updateKeyReadout();

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(worldGrid[arrayIndex] == TILE_PLAYERSTART) {
					worldGrid[arrayIndex] = TILE_GROUND;
					this.x = eachCol * WORLD_W + WORLD_W/2;
					this.y = eachRow * WORLD_H + WORLD_H/2;
					return;
				} // end of player start if
			} // end of col for
		} // end of row for
	} // end of playerReset func

	this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + this.keysInInventory;
	}

	this.move = function() {
		isMoving = false;

		// stuns player when hit by monsters
		if (this.isStunned) {
			stunTimer -= TIME_PER_TICK;
			if (stunTimer <= 0) {
				this.isStunned = false;
			} else if (player.isMoving){
				this.x += Math.cos(knockbackAngle) * knockbackSpeed;
				this.y += Math.sin(knockbackAngle) * knockbackSpeed;
				knockbackSpeed *= FRICTION;
				this.hitbox.update(this.x, this.y);
			}
			return;
		}

		if(this.keyHeld_West && !this.keyHeld_East) {
			this.x -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "West";
		}
		if(this.keyHeld_East && !this.keyHeld_West) {
			this.x += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "East";
		}

		// check collisions
		// undo x movement if collision

		if(this.keyHeld_South && !this.keyHeld_North) {
			this.y += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "South";
		}
		if(this.keyHeld_North && !this.keyHeld_South) {
			this.y -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "North";
		}

		// check collisions
		// undo y movement if collision

		this.hitbox.update(this.x, this.y);
		if (this.isCollidingWithEnemy()) {
			this.isStunned = true;
			stunTimer = STUN_DURATION;
			return;
		}

		switch(TILE_GROUND) {
			case TILE_GROUND:
				break;
			case TILE_SKULL:
				isMoving = false;
				break;
			case TILE_DOOR:
				if(this.keysInInventory > 0) {
					this.keysInInventory--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
				} else {
					isMoving = false;
				}
				break;
			case TILE_KEY:
				this.keysInInventory++; // one more key
				this.updateKeyReadout();
				worldGrid[tileIndex] = TILE_GROUND;
				break;
			case TILE_WALL:
				break;
			default:
				break;
		}

		choosePlayerAnimation();

		wasMoving = isMoving;
		wasFacing = isFacing;

		sprite.update();
		this.hitbox.update(this.x, this.y);
		// logging
		// console.log(this.x + ": " + this.y);
	}

	this.draw = function() {
		sprite.draw(this.x, this.y - 7);
		canvasContext.strokeStyle = 'yellow';
		//colorText(Math.round(stunTimer*100)/100, this.x, this.y, 'white');
		if(_DEBUG_DRAW_COLLIDERS) {
			//this.collider.draw();
			this.hitbox.draw();
		}
	}

	function choosePlayerAnimation() {
		if (wasMoving != isMoving ||
			wasFacing != isFacing)
		{
			var playerPic;

			if (isMoving) {
				if (isFacing == "South") {
					playerPic = sprites.Player.walkSouth;

				} else if (isFacing == "East") {
					playerPic = sprites.Player.walkEast;

				} else if (isFacing == "North") {
					playerPic = sprites.Player.walkNorth;

				} else if (isFacing == "West") {
					playerPic = sprites.Player.walkWest;
				}

				sprite.setSprite(playerPic, 32, 32, 7, 12);

			} else {
 				if (isFacing == "South") {
					playerPic = sprites.Player.standSouth;

				} else if (isFacing == "East") {
					playerPic = sprites.Player.standEast;

				} else if (isFacing == "North") {
					playerPic = sprites.Player.standNorth;

				} else if (isFacing == "West") {
					playerPic = sprites.Player.standWest;
				}

				sprite.setSprite(playerPic, 32, 32, 1, 0);
			}
		}
	}

	this.isCollidingWithEnemy = function() {
		var hitByEnemy = false;

	    for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
			var x = enemy.hitbox.box.topLeft.x;
			var y = enemy.hitbox.box.topLeft.y;
			var width = enemy.hitbox.width;
			var height = enemy.hitbox.height;
	        if (this.hitbox.isCollidingWith(x, y, width, height)) {
				x1 = enemy.hitbox.x;
				x2 = this.hitbox.x;
				y1 = enemy.hitbox.y;
				y2 = this.hitbox.y;
				knockbackAngle = Math.atan2(y2-y1, x2-x1);
				knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				enemy.sprite.setFrame(5);
				enemy.recoil = true;
				this.isMoving = true;
				hitByEnemy = true;
	        }
	    }
		return hitByEnemy;
	}
}
