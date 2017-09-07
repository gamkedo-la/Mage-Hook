const PLAYER_MOVE_SPEED = 3;
const STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = .7;
const FLASH_DURATION = .05;
const INITIAL_KNOCKBACK_SPEED = 8;
const FRICTION = 0.80;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var playerAtStartingPosition = true;

	this.x = 0;
	this.y = 0;

	this.name = "Untitled Player";
	this.maxHealth = 20;
	this.currentHealth = this.maxHealth;
	this.inventory = {};
	this.inventory.keys = 0;
	this.isStunned = false;
	this.isInvincible = false;
	var stunTimer;
	var invincibleTimer;
	var flashTimer;
	var drawPlayer = true;
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

	var tileColliderWidth = 4;
	var tileColliderHeight = 4;
	var tileColliderOffsetX = -1;
	var tileColliderOffsetY = 9;
	this.tileCollider = new boxColliderClass(this.x, this.y,
											 tileColliderWidth, tileColliderHeight,
											 tileColliderOffsetX, tileColliderOffsetY);
	var hitboxWidth = 8;
	var hitboxHeight = 10;
	var hitboxOffsetX = -1;
	var hitboxOffsetY = 6;
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
		if (this.currentHealth <=0)
		{
			this.inventory.keys = 0;
		}
		this.currentHealth = this.maxHealth;
		this.isFacing = "South";
		this.isMoving = "false";

		if (playerAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 32, 32, 1, 0);
			playerAtStartingPosition = false;
		}
		//this.keysInInventory = 0; //disabled so keys persist between rooms
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

		var checksPerFrame = PLAYER_MOVE_SPEED;
		var movePerCheck = 1;
		if(this.keyHeld_West && !this.keyHeld_East && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, -movePerCheck, "x");
			isMoving = true;
			isFacing = "West";
		}
		if(this.keyHeld_East && !this.keyHeld_West && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "x");
			isMoving = true;
			isFacing = "East";
		}

		if(this.keyHeld_North && !this.keyHeld_South && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, -movePerCheck, "y");
			isMoving = true;
			isFacing = "North";
		}
		if(this.keyHeld_South && !this.keyHeld_North && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "y");
			isMoving = true;
			isFacing = "South";
		}

		if (this.isCollidingWithEnemy() && !this.isInvincible) {
			if (this.currentHealth <= 0) {
				resetAllRooms();
			} else {
				this.isStunned = true;
				this.isInvincible = true;
				stunTimer = STUN_DURATION;
				invincibleTimer = INVINCIBLE_DURATION;
				return;
			}
		}

		choosePlayerAnimation();
		wasMoving = isMoving;
		wasFacing = isFacing;

		// stuns player when hit by enemies
		if (this.isStunned) {
			stunTimer -= TIME_PER_TICK;
			if (stunTimer <= 0) {
				this.isStunned = false;
			} else {
				var checksPerFrame = 5;
				var movePerCheck;
				movePerCheck = (Math.cos(knockbackAngle) * knockbackSpeed)/checksPerFrame;
				moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "x");
				movePerCheck = (Math.sin(knockbackAngle) * knockbackSpeed)/checksPerFrame;
				moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "y");
				knockbackSpeed *= FRICTION;
			}
		} else {
			isMoving = false;
			sprite.update();
		}

		// Prevents player from colliding with enemeies
		if (this.isInvincible) {
			if (flashTimer <= 0 || flashTimer == undefined) {
				flashTimer = FLASH_DURATION;
				drawPlayer = !drawPlayer;
			}
			flashTimer -= TIME_PER_TICK;
			invincibleTimer -= TIME_PER_TICK;
			if (invincibleTimer <= 0) {
				this.isInvincible = false;
				drawPlayer = true;
			}
		}

		this.updateColliders();
	}

	this.draw = function() {
		if (drawPlayer) {
			sprite.draw(this.x, this.y);
		}
		if(_DEBUG_DRAW_TILE_COLLIDERS) {
			this.tileCollider.draw('lime');
		}
		if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.hitbox.draw('red');
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
	        if (this.hitbox.isCollidingWith(enemy.hitbox)) {
				if (!this.isInvincible) {
					this.currentHealth--;
				}
				x1 = enemy.hitbox.x;
				x2 = this.hitbox.x;
				y1 = enemy.hitbox.y;
				y2 = this.hitbox.y;
				knockbackAngle = Math.atan2(y2-y1, x2-x1);
				knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				enemy.sprite.setFrame(5);
				enemy.recoil = true;
				hitByEnemy = true;
	        }
	    }
		return hitByEnemy;
	}

	this.updateColliders = function() {
		this.hitbox.update(this.x, this.y);
		this.tileCollider.update(this.x, this.y);
	}

	this.collisionHandler = function(tileIndex) {
		var collisionDetected = false;
		var tileType = worldGrid[tileIndex];
		switch(tileType) {
			case TILE_GROUND:
				break;
			case TILE_SKULL:
				collisionDetected = true;
				break;
			case TILE_DOOR:
				if(this.inventory.keys > 0 && !this.isStunned) {
					this.inventory.keys--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
				} else {
				collisionDetected = true;
			}
				break;
			case TILE_KEY:
				this.inventory.keys++; // one more key
				this.updateKeyReadout();
				worldGrid[tileIndex] = TILE_GROUND;
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
