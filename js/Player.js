const PLAYER_MOVE_SPEED = 3;
const STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = 0.7;
const FLASH_DURATION = 0.05;
const ATTACK_DURATION = 0.5;
const ATTACK_DISTANCE = 10; // how far in front of us can we hit baddies?

const INITIAL_KNOCKBACK_SPEED = 8;
const FRICTION = 0.80;

const NORTH = 1;
const SOUTH = 2;
const EAST = 3;
const WEST = 4;

const STARTING_POSITION_X = 188;
const STARTING_POSITION_Y = 86;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = SOUTH;
	var wasFacing = isFacing;
	var isAttacking = false;
	var wasAttacking = false;

	var playerAtStartingPosition = true;
	this.x = STARTING_POSITION_X;
	this.y = STARTING_POSITION_Y;

	this.name = "Untitled Player";
	this.maxHealth = 20;
	this.enemyHitCount = 0;
	this.currentHealth = this.maxHealth;
	this.inventory = {};
	this.inventory.keys = 0;
	this.isStunned = false;
	this.isInvincible = false;
	var stunTimer;
	var invincibleTimer;
	var flashTimer;
	var attackTimer;
	var drawPlayer = true;
	var knockbackAngle;
	var knockbackSpeed;


	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;
	this.keyHeld_Attack = false;
	
	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;
	this.controlKeyAttack;
	
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
   
	var attackhitboxWidth = 24;
	var attackhitboxHeight = 24;
	var attackhitboxOffsetX = 0;
	var attackhitboxOffsetY = 0;
	attackblockedBy = [];
	this.attackhitbox = new boxColliderClass(this.x, this.y,
		attackhitboxWidth, attackhitboxHeight,
		attackhitboxOffsetX, attackhitboxOffsetY,
		attackblockedBy);
 
   var sprite = new spriteClass();

	this.setupInput = function(upKey, rightKey, downKey, leftKey, attackKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyAttack = attackKey;
	}

	this.reset = function(playerName) {
		this.name = playerName;
		if (this.currentHealth <=0)
		{
			this.inventory.keys = 0;
		}
		this.currentHealth = this.maxHealth;
		this.isFacing = SOUTH; // FIXME possible bug? this.?
		this.isMoving = false;

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
			isFacing = WEST;
		}
		if(this.keyHeld_East && !this.keyHeld_West && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "x");
			isMoving = true;
			isFacing = EAST;
		}

		if(this.keyHeld_North && !this.keyHeld_South && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, -movePerCheck, "y");
			isMoving = true;
			isFacing = NORTH;
		}
		if(this.keyHeld_South && !this.keyHeld_North && !this.isStunned) {
			moveOnAxisAndCheckForTileCollisions(this, this.tileCollider, checksPerFrame, movePerCheck, "y");
			isMoving = true;
			isFacing = SOUTH;
		}

		isAttacking = this.keyHeld_Attack;
		if(isAttacking && !wasAttacking) // only trigger once
		{
			attackTimer = ATTACK_DURATION;
			console.log('attack!');
			if (this.canHitEnemy())
			{
				console.log('WE HIT AN ENEMY!!!!');
				this.enemyHitCount++; // score?
			}
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
		wasAttacking = isAttacking;

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
			if (this.keyHeld_Attack)
				 this.attackhitbox.draw('yellow');
		}
	}

	function choosePlayerAnimation() {
		if (wasMoving != isMoving ||
			wasFacing != isFacing)
		{
			var playerPic;

			if (isMoving) {
				if (isFacing == SOUTH) {
					playerPic = sprites.Player.walkSouth;

				} else if (isFacing == EAST) {
					playerPic = sprites.Player.walkEast;

				} else if (isFacing == NORTH) {
					playerPic = sprites.Player.walkNorth;

				} else if (isFacing == WEST) {
					playerPic = sprites.Player.walkWest;
				}

				sprite.setSprite(playerPic, 32, 32, 7, 12);

			} else {
 				if (isFacing == SOUTH) {
					playerPic = sprites.Player.standSouth;

				} else if (isFacing == EAST) {
					playerPic = sprites.Player.standEast;

				} else if (isFacing == NORTH) {
					playerPic = sprites.Player.standNorth;

				} else if (isFacing == WEST) {
					playerPic = sprites.Player.standWest;
				}

				sprite.setSprite(playerPic, 32, 32, 1, 0);
			}
		}
	}

	this.canHitEnemy = function() { // used for attacks
		
		//console.log('Detecting attacking collisions near ' + this.attackhitbox.x+','+this.attackhitbox.y);
		
		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		var hitAnEnemy = false;

	    for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
	        if (this.attackhitbox.isCollidingWith(enemy.hitbox)) {
				//x1 = enemy.hitbox.x;
				//x2 = this.attackhitbox.x;
				//y1 = enemy.hitbox.y;
				//y2 = this.attackhitbox.y;
				//enemyknockbackAngle = Math.atan2(y2-y1, x2-x1);
				//enemyknockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				enemy.sprite.setFrame(5);
				enemy.recoil = true;
				hitAnEnemy = true;
				// TODO:
				// reduce enemy health / destroy / etc
				// give score / item drops / etc
				// particle effect / sound / etc
	        }
	    }
		return hitAnEnemy;
	}
	
	this.isCollidingWithEnemy = function() {
		var hitByEnemy = false;

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

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
		
		// where the attack hitbox is depends on what direction we are facing
		var attackoffsetx = 0;
		var attackoffsety = 0;
		switch (isFacing) {
			case NORTH: 
				attackoffsetx = 0;
				attackoffsety = -ATTACK_DISTANCE;
				break;
			case SOUTH: 
				attackoffsetx = 0;
				attackoffsety = ATTACK_DISTANCE;
				break;
			case EAST: 
				attackoffsetx = ATTACK_DISTANCE;
				attackoffsety = 0;
				break;
			case WEST: 
				attackoffsetx = -ATTACK_DISTANCE;
				attackoffsety = 0;
				break;
			default:
				attackoffsetx = 0;
				attackoffsety = 0;
			}
		this.attackhitbox.update(this.x+attackoffsetx, this.y+attackoffsety);
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
