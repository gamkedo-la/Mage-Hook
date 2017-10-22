var _PLAYER_MOVE_SPEED = 4;
var _PLAYER_DASH_SPEED_SCALE = 4.0;
const DASH_TIMESPAN_MS = 250; // how long to dash for
var _MS_BETWEEN_DASHES = 1000; // minimum time between dashes
const PLAYER_MOVE_CHECKS_PER_TICK = 5;
var _STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = 0.7;
const FLASH_DURATION = 0.05;
const PARTICLES_PER_BOX = 200;
const PARTICLES_PER_TICK = 3;
var poisonTick = 250;
var poisonDuration = 750;
var isPoisoned = false;
var poisonTime = 0;
var noDamageForFloor = [false,true,true];
const FRICTION = 0.80;
var _WEB_FRICTION = 0.15;


const INITIAL_KNOCKBACK_SPEED = 8;

const NORTH = 1;
const SOUTH = 2;
const EAST = 3;
const WEST = 4;
const ATTACK = 5; // used in input.js for future double tap logic
const RANGED_ATTACK = 6;

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
	this.keyHeld_Dash = false;
	this.lastDashTime = 0;
	this.keyHeld_Ranged_Attack = false;
	//this.dashPending = []; // eg player.dashPending[NORTH] = true;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;
	this.controlKeyAttack;
	this.controlKeyDash;
	this.controlKeyRangeAttack;

	var tileColliderWidth = 4;
	var tileColliderHeight = 2;
	var tileColliderOffsetX = -0.5;
	var tileColliderOffsetY = 10.5;
	this.tileCollider = new boxColliderClass(this.x, this.y,
											 tileColliderWidth, tileColliderHeight,
											 tileColliderOffsetX, tileColliderOffsetY);
	var hitboxWidth = 8;
	var hitboxHeight = 10;
	var hitboxOffsetX = -0.5;
	var hitboxOffsetY = 6.5;
	this.hitbox = new boxColliderClass(this.x, this.y,
									   hitboxWidth, hitboxHeight,
								       hitboxOffsetX, hitboxOffsetY);

   var sprite = new spriteClass();

    this.facingDirection = function() {
    	return isFacing;
    }

	this.setupInput = function(upKey, rightKey, downKey, leftKey, attackKey, dashKey, rangedAttackKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
		this.controlKeyAttack = attackKey;
		this.controlKeyDash = dashKey;
		this.controlKeyRangeAttack = rangedAttackKey;
	}

	this.reset = function(playerName) {
		this.name = playerName;
		if (this.currentHealth <= 0)
		{
			this.inventory.keysCommon = 0;
			this.inventory.keysRare = 0;
			this.inventory.keysEpic = 0;
			this.currentHealth = this.maxHealth;
			currentRoomCol = 1;
			currentRoomRow = 1;
			currentFloor = 1;
			lastValidCurrentRoomCol = 1;
			lastValidCurrentRoomRow = 1;
			lastValidCurrentFloor = 1;
			loadLevel();
			this.x = STARTING_POSITION_X;
			this.y = STARTING_POSITION_Y;
			playerAtStartingPosition = true;
		}

		this.isFacing = SOUTH; // FIXME possible bug? this.?
		this.isMoving = false;

		if (playerAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 32, 32, 1, 0, true);
			playerAtStartingPosition = false;
		}
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

		// Movement optimizations based on feedback from Christer
		target = { x: this.x, y: this.y };

		if (this.keyHeld_West) {
			isFacing = WEST;
			target.x -= _PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_East) {
			isFacing = EAST;
			target.x += _PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_North) {
			isFacing = NORTH;
			target.y -= _PLAYER_MOVE_SPEED;
		}
		if (this.keyHeld_South) {
			isFacing = SOUTH;
			target.y += _PLAYER_MOVE_SPEED;
		}
		if (target.x != this.x || target.y != this.y) {
			isMoving = true;
		}
		if (isMoving) {
			var angle = calculateAngleFrom(this, target);
			var velX = Math.cos(angle) * _PLAYER_MOVE_SPEED * playerFriction;
			var velY = Math.sin(angle) * _PLAYER_MOVE_SPEED * playerFriction;

			if (this.keyHeld_Dash)
			{
				//console.log("keyHeld_Dash while moving!");
				if ((performance.now() - this.lastDashTime) > _MS_BETWEEN_DASHES)
				{
					console.log("DASH STARTING!");
					this.lastDashTime = performance.now();
				}
			}

			// we may dash for several frames
			if (this.lastDashTime + DASH_TIMESPAN_MS > performance.now())
			{
				anchorMagic(this.x, this.y, isFacing);
				//console.log('still dashing!');
				velX *= _PLAYER_DASH_SPEED_SCALE;
				velY *= _PLAYER_DASH_SPEED_SCALE;
			}

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
		}

		pickUpItems(this.hitbox);

		isAttacking = this.keyHeld_Attack;
		if(isAttacking && !wasAttacking) // only trigger once
		{
			anchorMagic(this.x, this.y, isFacing);
		}

		isUsingRangedAttack = this.keyHeld_Ranged_Attack;
		if(isUsingRangedAttack && !wasAttacking)	//either melee attack or ranged attack
		{
			bulletMagic(this.x, this.y, isFacing);
		}

		if (this.isCollidingWithEnemy() && !this.isInvincible) {
			if (this.currentHealth <= 0) {
				isPoisoned = false;
				resetAllRooms();
				player.reset("Untitled Player");
				Sound.play("player_die");
			} else {
				Sound.play("player_hit");
				this.isStunned = true;
				this.isInvincible = true;
				stunTimer = _STUN_DURATION;
				invincibleTimer = INVINCIBLE_DURATION;
				return;
			}
		}

		choosePlayerAnimation();
		wasMoving = isMoving;
		wasFacing = isFacing;
		wasAttacking = isAttacking | isUsingRangedAttack;

		// stuns player when hit by enemies
		if (this.isStunned) {
			stunTimer -= TIME_PER_TICK;
			if (stunTimer <= 0) {
				this.isStunned = false;
			} else {
				var velX = Math.cos(knockbackAngle) * knockbackSpeed;
				var velY = Math.sin(knockbackAngle) * knockbackSpeed;
				this.tileCollider.moveOnAxis(this, velX, X_AXIS);
				this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
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

	this.poisoned = function() {
		if(isPoisoned) {
			poisonTime++;
			sprite.tintPlayer(0,90,0,0);
			console.log("posionTime");
			if (poisonTime % poisonTick == 0 && poisonTime > 0) {
				this.currentHealth--;
				noDamageForFloor[currentFloor] = false;
				console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);
				this.isInvincible = true;
				invincibleTimer = INVINCIBLE_DURATION;
				Sound.play("player_hit");
				console.log("Health lost to poison");
			} else if(poisonTime > poisonDuration) {
				poisonTime = 0;
				isPoisoned = false;
				this.isInvincible = false;
				drawPlayer = true;
				console.log("poison over");
				return;
			}
			if (this.currentHealth <= 0) {
				isPoisoned = false;
				this.isInvincible = false;
				poisonTime = 0;
				resetAllRooms();
				player.reset("Untitled Player");
				Sound.play("player_die");		
			}
			
		}
	}


	this.canHitEnemy = function(collider) { // used for attacks, returns the enemy

		//console.log('Detecting attacking collisions near ' + this.attackhitbox.x+','+this.attackhitbox.y);
		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		var hitAnEnemy = null;

	    for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
	        if (collider.isCollidingWith(enemy.hitbox)) {
				enemy.sprite.setFrame(5);
				enemy.recoil = true;
				hitAnEnemy = enemy; //TODO: make this a list so we can hit more than one enemy
				for (var i = 0; i < PARTICLES_PER_ATTACK; i++) {
					var tempParticle = new particleClass(enemy.hitbox.x, enemy.hitbox.y, 'red');
					particle.push(tempParticle);
				}
	        }
	    }
		return hitAnEnemy;
	}
	this.getHit = function getHit(amount){
		this.currentHealth -= amount;
		noDamageForFloor[currentFloor] = false;
		console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);
	}
	this.isCollidingWithEnemy = function() {
		var hitByEnemy = false;

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
	        if (this.hitbox.isCollidingWith(enemy.hitbox)) {
				if (!this.isInvincible) {
					this.currentHealth--;
					noDamageForFloor[currentFloor] = false;
				}
				screenShake(5);
				knockbackAngle = calculateAngleFrom(enemy.hitbox, this.hitbox);
				knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
				enemy.sprite.setFrame(5);
				enemy.setState("recoil")
				hitByEnemy = true;
	        }
	    }
		return hitByEnemy;
	}

	this.updateColliders = function() {
		this.hitbox.update(this.x, this.y);
		this.tileCollider.update(this.x, this.y);
	}

	this.tileBehaviorHandler = function() {
		// default behaviors go here
		playerFriction = FRICTION;
		sprite.setSpeed(12);

		var types = this.tileCollider.checkTileTypes();
	    for (var i = 0; i < types.length; i++) {
		    switch (types[i]) {
				case TILE_OOZE:

					Sound.playUnlessAlreadyPlaying('hit_poison',false,0.5);

					if (!this.isInvincible) {
						isPoisoned = true;
					}

					if (isMoving) {
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lime');
							particle.push(tempParticle);
						}
					}
					break;
				case TILE_TRAP:
					if (!this.isInvincible) {
						this.currentHealth--;
						noDamageForFloor[currentFloor] = false;
						console.log("noDamageForFloor[currentFloor] = " + noDamageForFloor[currentFloor]);
						Sound.play("player_hit");
						this.isInvincible = true;
						invincibleTimer = INVINCIBLE_DURATION;
					}
					screenShake(5);
					this.isStunned = true;
					stunTimer = _STUN_DURATION;
					knockbackAngle = calculateAngleFrom(this.tileCollider, this.hitbox);
					knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
					hitByEnemy = true;
					break;
				case TILE_WEB:
					playerFriction = _WEB_FRICTION;
					sprite.setSpeed(6)
					if (isMoving) {
						Sound.playUnlessAlreadyPlaying('hit_web',false,0.2);
						for (var i = 0; i < PARTICLES_PER_TICK; i++) {
							var tempParticle = new particleClass(this.hitbox.x, this.hitbox.y, 'lightGrey');
							particle.push(tempParticle);
						}
					}
					break;
	            default:
	                break;
	        } // end of cases
	    } // end of for tiles loop
	} // end of tile behavior

	this.collisionHandler = function(tileIndex) {
		var collisionDetected = true;
		var tileType = worldGrid[tileIndex];

		switch(tileType) {
			case TILE_BOX:
				if(this.inventory.keysEpic > 0 && !this.isStunned) {
					this.inventory.keysEpic--; // one less key
					Sound.play("enemy_die");
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
			case TILE_STAIRS_UP:
				if(!this.isStunned && isFacing==EAST) { // possible other conditions to do before stairs can be used?
					currentFloor++;
				}
				break;
			case TILE_STAIRS_DOWN:
				if(!this.isStunned && isFacing==WEST) { // possible other conditions to do before stairs can be used?
					currentFloor--;
				}
				break;
			case TILE_SKULL:
			case TILE_WALL:
			case TILE_WALL_NORTH:
			case TILE_WALL_SOUTH:
			case TILE_WALL_WEST:
			case TILE_WALL_EAST:
			case TILE_WALL_CORNER_NE:
			case TILE_WALL_CORNER_NW:
			case TILE_WALL_CORNER_SE:
			case TILE_WALL_CORNER_SW:
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
}
