const PLAYER_MOVE_SPEED = 4;
const PLAYER_MOVE_CHECKS_PER_TICK = 5;
const STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = 0.7;
const FLASH_DURATION = 0.05;
const ATTACK_DURATION = 0.5;
const ATTACK_DISTANCE = 10; // how far in front of us can we hit baddies?
const PARTICLES_PER_ATTACK = 200;
const PARTICLES_PER_BOX = 200;
const PARTICLES_PER_TICK = 3;
const POISON_DURATION = 1;
const FRICTION = 0.80;
const WEB_FRICTION = 0.15;

const INITIAL_KNOCKBACK_SPEED = 8;

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
	var playerFriction = FRICTION;

	var playerAtStartingPosition = true;
	this.x = STARTING_POSITION_X;
	this.y = STARTING_POSITION_Y;

	this.name = "Untitled Player";
	this.maxHealth = 10;
	this.enemyHitCount = 0;
	this.currentHealth = this.maxHealth;
	this.inventory = {};
	this.inventory.keysCommon = 0;
	this.inventory.keysRare = 0;
	this.inventory.keysEpic = 0;
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
	var tileColliderOffsetY = 10;
	this.tileCollider = new boxColliderClass(this.x, this.y,
											 tileColliderWidth, tileColliderHeight,
											 tileColliderOffsetX, tileColliderOffsetY);
	var hitboxWidth = 8;
	var hitboxHeight = 10;
	var hitboxOffsetX = -1;
	var hitboxOffsetY = 6;
	this.hitbox = new boxColliderClass(this.x, this.y,
									   hitboxWidth, hitboxHeight,
								       hitboxOffsetX, hitboxOffsetY);

	var attackhitboxWidth = 24;
	var attackhitboxHeight = 24;
	var attackhitboxOffsetX = 0;
	var attackhitboxOffsetY = 0;
	this.attackhitbox = new boxColliderClass(this.x, this.y,
											 attackhitboxWidth, attackhitboxHeight,
											 attackhitboxOffsetX, attackhitboxOffsetY);

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
			this.inventory.keysCommon = 0;
			this.inventory.keysRare = 0;
			this.inventory.keysEpic = 0;
			this.currentHealth = this.maxHealth;
		}
		
		this.isFacing = SOUTH; // FIXME possible bug? this.?
		this.isMoving = false;

		if (playerAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 32, 32, 1, 0, true);
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

		// var speed = PLAYER_MOVE_SPEED * playerFriction;
		// var checksPerFrame = 5;
		// var movePerCheck = speed/checksPerFrame;
		// if(this.keyHeld_West && !this.keyHeld_East && !this.isStunned) {
		// 	moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
		// 										checksPerFrame, -movePerCheck, X_AXIS);
		// 	isMoving = true;
		// 	isFacing = WEST;
		// }
		// if(this.keyHeld_East && !this.keyHeld_West && !this.isStunned) {
		// 	moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
		// 										checksPerFrame, movePerCheck, X_AXIS);
		// 	isMoving = true;
		// 	isFacing = EAST;
		// }
		//
		// if(this.keyHeld_North && !this.keyHeld_South && !this.isStunned) {
		// 	moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
		// 										checksPerFrame, -movePerCheck, Y_AXIS);
		// 	isMoving = true;
		// 	isFacing = NORTH;
		// }
		// if(this.keyHeld_South && !this.keyHeld_North && !this.isStunned) {
		// 	moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
		// 										checksPerFrame, movePerCheck, Y_AXIS);
		// 	isMoving = true;
		// 	isFacing = SOUTH;
		// }

		// Movement optimizations based on feedback from Christer
		target = { x: this.x, y: this.y };

		if (this.keyHeld_West) {
			isFacing = WEST;
			target.x -= PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_East) {
			isFacing = EAST;
			target.x += PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_North) {
			isFacing = NORTH;
			target.y -= PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_South) {
			isFacing = SOUTH;
			target.y += PLAYER_MOVE_SPEED;
		}
		if (target.x != this.x || target.y != this.y) {
			isMoving = true;
		}
		if (isMoving) {
			var checksPerTick;
			var movePerCheck;
			var angle = calculateAngleFrom(this, target);
			var velX = Math.cos(angle) * PLAYER_MOVE_SPEED * playerFriction;
			var velY = Math.sin(angle) * PLAYER_MOVE_SPEED * playerFriction;

			if(velX != 0) {
				checksPerTick = PLAYER_MOVE_CHECKS_PER_TICK;
				movePerCheck = velX / checksPerTick;
				while (Math.abs(movePerCheck) < 1) {
					checksPerTick--;
					if (checksPerTick <= 1) {
						checksPerTick = 1;
						movePerCheck = velX / checksPerTick;
						break;
					}
					movePerCheck = velX / checksPerTick;
				}
				moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
													checksPerTick, movePerCheck, X_AXIS);
			}

			if(velY != 0) {
				checksPerTick = PLAYER_MOVE_CHECKS_PER_TICK;
				movePerCheck = velY / checksPerTick;
				while (Math.abs(movePerCheck) < 1) {
					checksPerTick--;
					if (checksPerTick <= 1) {
						checksPerTick = 1;
						movePerCheck = velY / checksPerTick;
						break;
					}
					movePerCheck = velY / checksPerTick;
				}
				moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
													checksPerTick, movePerCheck, Y_AXIS);
			}
		} // end of if (isMoving)

		pickUpItems(this.hitbox);

		isAttacking = this.keyHeld_Attack;
		if(isAttacking && !wasAttacking) // only trigger once
		{
			Sound.play("player_attack");
			attackTimer = ATTACK_DURATION;
			console.log('attack!');
			var hitOne = this.canHitEnemy();
			if (hitOne)
			{
				console.log('WE HIT AN ENEMY!!!!');
				this.enemyHitCount++; // score?
				hitOne.currentHealth--;
				Sound.play("enemy_hit"); // TODO: after a delay?
			}
		}

		if (this.isCollidingWithEnemy() && !this.isInvincible) {
			if (this.currentHealth <= 0) {
				resetAllRooms();
				Sound.play("player_die");
			} else {
				Sound.play("player_hit");
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
		this.tileBehaviorHandler();
		isMoving = false;
	}  // end of this.update()

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

				sprite.setSprite(playerPic, 32, 32, 7, 12, true);

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

				sprite.setSprite(playerPic, 32, 32, 1, 0, true);
			}
		}
	}

	this.canHitEnemy = function() { // used for attacks, returns the enemy

		//console.log('Detecting attacking collisions near ' + this.attackhitbox.x+','+this.attackhitbox.y);

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		var hitAnEnemy = null;

	    for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
	        if (this.attackhitbox.isCollidingWith(enemy.hitbox)) {
				enemy.sprite.setFrame(5);
				enemy.recoil = true;
				hitAnEnemy = enemy;
				for (var i = 0; i < PARTICLES_PER_ATTACK; i++) {
					var tempParticle = new particleClass(enemy.hitbox.x, enemy.hitbox.y, 'red');
					particle.push(tempParticle);
				}
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
				screenshake(5);
				knockbackAngle = calculateAngleFrom(enemy.hitbox, this.hitbox);
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

	this.tileBehaviorHandler = function() {
		// default behaviors go here
		playerFriction = FRICTION;
		sprite.setSpeed(12);

		var types = this.tileCollider.checkTileTypes();
	    for (var i = 0; i < types.length; i++) {
		    switch (types[i]) {
				case TILE_OOZE:
					if (!this.isInvincible) {
						this.currentHealth--;
						this.isInvincible = true;
						invincibleTimer = INVINCIBLE_DURATION;
					}

					if (isMoving) {
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lime');
							particle.push(tempParticle);
						}
					}
					break;
				case TILE_WEB:
					playerFriction = WEB_FRICTION;
					sprite.setSpeed(6)
					if (isMoving) {
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lightGrey');
							particle.push(tempParticle);
						}
					}
					break;
	            default:
	                break;
	        }
	    }
	}

	this.collisionHandler = function(tileIndex) {
		var collisionDetected = true;
		var tileType = worldGrid[tileIndex];

		switch(tileType) {
			case TILE_BOX:
				if(this.inventory.keysRare > 0 && !this.isStunned) {
					this.inventory.keysRare--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					var result = calculateCenterCoordOfTileIndex(tileIndex);
					for (var i = 0; i < PARTICLES_PER_BOX; i++) {
						var tempParticle = new particleClass(result.x, result.y, 'gold');
						particle.push(tempParticle);
					}
					var totalItems = rollItemQuantity(10, 100, 2.5);
					for (var i = 0; i < totalItems; i++) {
						var dropType = Math.random() * 100;
						//in order of most common to least common
						if (dropType <= ITEM_CRYSTAL_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_CRYSTAL);
						else
							dropType -= ITEM_CRYSTAL_DROP_PERCENT;

						if (dropType <= ITEM_POTION_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_POTION);
						else
							dropType -= ITEM_POTION_DROP_PERCENT;

						if (dropType <= ITEM_KEY_COMMON_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_COMMON);
						else
							dropType -= ITEM_KEY_COMMON_DROP_PERCENT;

						if (dropType <= ITEM_KEY_RARE_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_RARE);
						else
							dropType -= ITEM_KEY_RARE_DROP_PERCENT;

						if (dropType <= ITEM_KEY_EPIC_DROP_PERCENT)
							dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_EPIC);
						else
							dropType -= ITEM_KEY_EPIC_DROP_PERCENT;
					}
				}
				break;
			case TILE_DOOR_COMMON:
				if(this.inventory.keysCommon > 0 && !this.isStunned) {
					Sound.play("door_open");
					this.inventory.keysCommon--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
				}
				break;
			case TILE_DOOR_RARE:
				if(this.inventory.keysRare > 0 && !this.isStunned) {
					Sound.play("door_open");
					this.inventory.keysRare--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
				}
				break;
			case TILE_DOOR_EPIC:
				if(this.inventory.keysEpic > 0 && !this.isStunned) {
					Sound.play("door_open");
					this.inventory.keysEpic--; // one less key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
				}
				break;
			case TILE_STAIRS:
				if(!this.isStunned) { // possible other conditions to do before stairs can be used?
					Sound.play("room_change",false,0.1);
					currentFloor++;
					loadLevel();
					player.x = canvas.width/2;
					player.y = canvas.height/2;
				}
				break;
			case TILE_SKULL:
				break;
			case TILE_WALL:
			case TILE_WALL_NORTH:
			case TILE_WALL_SOUTH:
			case TILE_WALL_WEST:
			case TILE_WALL_EAST:
			case TILE_WALL_CORNER_NE:
			case TILE_WALL_CORNER_NW:
			case TILE_WALL_CORNER_SE:
			case TILE_WALL_CORNER_SW:
				break;
			default:
				collisionDetected = false;
				break;
		}
		return collisionDetected;
	}
}
