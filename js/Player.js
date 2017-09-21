var _PLAYER_MOVE_SPEED = 4;
var _PLAYER_DASH_SPEED_SCALE = 4.0;
const DASH_TIMESPAN_MS = 250; // how long to dash for
var _MS_BETWEEN_DASHES = 1000; // minimum time between dashes
const PLAYER_MOVE_CHECKS_PER_TICK = 5;
var _STUN_DURATION = 0.45;
const INVINCIBLE_DURATION = 0.7;
const FLASH_DURATION = 0.05;
const ATTACK_DURATION = 0.5;
const ATTACK_DISTANCE = 10; // how far in front of us can we hit baddies?
const ATTACK_ANIMATION_SPEED = 13; // in FPS
const PARTICLES_PER_ATTACK = 200;
const PARTICLES_PER_BOX = 200;
const PARTICLES_PER_TICK = 3;
var poisonTick = 250;
var poisonDuration = 750;
var isPoisoned = false;
var poisonTime = 0;
const FRICTION = 0.80;
var _WEB_FRICTION = 0.15;
const RANGED_ATTACK_SPEED = 5;

const PARTICLES_PER_ENEMY_HIT = 16;
const BLOOD_SPLATTER_SPEED = 1;

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
	var rangeAttackDir = 0;

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

	var attackhitboxWidth = 24;
	var attackhitboxHeight = 24;
	var attackhitboxOffsetX = 0;
	var attackhitboxOffsetY = 0;
	this.attackhitbox = new boxColliderClass(this.x, this.y,
											 attackhitboxWidth, attackhitboxHeight,
											 attackhitboxOffsetX, attackhitboxOffsetY);

   var sprite = new spriteClass();

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
				this.anchorAttack(); // FIXME: we may want a different attack here?
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
			this.anchorAttack();
		}

		isUsingRangedAttack = this.keyHeld_Ranged_Attack;
		if(isUsingRangedAttack && !wasAttacking)	//either melee attack or ranged attack
		{
			rangeAttackDir = isFacing;
			this.RangedAttack();
		}

		if (this.isCollidingWithEnemy() && !this.isInvincible) {
			if (this.currentHealth <= 0) {
				resetAllRooms();
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

	this.anchorAttack = function(){
		Sound.play("player_attack");
		attackTimer = ATTACK_DURATION;
		console.log('attack!');
		this.registerAttack( this.x + 10, this.y, sprites.Player.anchorAttack, {
			4: {x1: 5, y1: 8, x2: 20, y2:10 },
			5: {x1: 5, y1: 8, x2: 20, y2:10 },
			6: {x1: 5, y1: 8, x2: 20, y2:10 }
		});
		return;
		/*
		var hitOne = this.canHitEnemy();
		if (hitOne)
		{
			console.log('WE HIT AN ENEMY!!!!');
			this.enemyHitCount++; // score?
			hitOne.currentHealth--;
			hitOne.lastHitBy = this; // the player
			Sound.play("enemy_hit"); // TODO: after a delay?
		}
		*/
	}

	//testing range attack
	this.RangedAttack = function() {
		Sound.play("player_attack");
		attackTimer = ATTACK_DURATION;
		console.log('ranged attack!');
		switch(rangeAttackDir) {
			case (NORTH):
				break;
			case(SOUTH):
				break;
			case(EAST):
				break;
			case(WEST):
				break;
			default:
				console.log("Shouldn't come here...\n");
				break;
		}
		this.registerAttack( this.x + 10, this.y, sprites.Player.RangedAttack, {
			0: {x1: 0, y1: 0, x2: 20, y2:20 },
			1: {x1: 0, y1: 0, x2: 20, y2:20 },
			2: {x1: 0, y1: 0, x2: 20, y2:20 },
			3: {x1: 0, y1: 0, x2: 20, y2:20 }
		});
		return;
	}

	//TODO: refractor out into attack.js
	//TODO: pass in a sprite, not an img
	this.registerAttack = function( x, y, animation, attackFrames){
		var ctrl = {}
		ctrl.x = x;
		ctrl.y = y;

		switch(isFacing) { //Draw attack in facing dirction
			case NORTH:
				ctrl.x -= 16;
				ctrl.y -= 16;
				break;
			case SOUTH:
				ctrl.x -= 16;
				ctrl.y += 16;
				break;
			case EAST:
				ctrl.x += 3;
				break;
			case WEST:
				ctrl.x -= 35;
				break;
		}
		

		ctrl.maxHealth = 3;
		if(!attackFrames){
			//waaaa??
			ctrl.attackFrames = {
				4: {x1: 0, y1: 0, x2: 10, y2:10 },
				5: {x1: 0, y1: 0, x2: 10, y2:10 },
				6: {x1: 0, y1: 0, x2: 10, y2:10 }
			};
		} else {
			ctrl.attackFrames = attackFrames
		}


		var tileColliderWidth = 0, tileColliderHeight = 0, tileColliderOffsetX = 0, tileColliderOffsetY = 0
		ctrl.collider = new boxColliderClass(
			ctrl.x, ctrl.y,
			tileColliderWidth, tileColliderHeight,
			tileColliderOffsetX, tileColliderOffsetY
		);
		ctrl.sprite = new spriteClass();
		var animFrame = 0;
		//can also set different animation speed and sprite size
		if(animation == sprites.Player.anchorAttack){
			ctrl.attackDir = [0,0];
			animFrame = 7;
		}
		else if(animation == sprites.Player.RangedAttack){
			animFrame = 4;
			switch(rangeAttackDir) {
				case (NORTH):
					ctrl.attackDir = [0,-1];
					break;
				case(SOUTH):
					ctrl.attackDir = [0,1];
					break;
				case(EAST):
					ctrl.attackDir = [2,0];
					break;
				case(WEST):
					ctrl.attackDir = [-2,0];
					break;
				default:
					console.log("Shouldn't come here...\n");
					break;
			}
		}

		//console.log(animFrame);
		ctrl.sprite.setSprite(animation, 32, 32, animFrame, 9, false);
		ctrl.sprite.setSpeed(ATTACK_ANIMATION_SPEED);

		ctrl.draw = function(){
			ctrl.sprite.draw(this.x, this.y);
			if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
				ctrl.collider.draw('red');
	        }
		}

		ctrl.update = function(){
			if(ctrl.sprite.isDone()){
				var index = currentRoom.magic.indexOf(ctrl);
				if(index !== -1) {
					currentRoom.magic.splice(index, 1);
			  		console.log("attack removed")
			  		return;
				}
			}
			ctrl.x += ctrl.attackDir[0]*RANGED_ATTACK_SPEED;
			ctrl.y += ctrl.attackDir[1]*RANGED_ATTACK_SPEED;
			var frame = ctrl.sprite.getFrame();
			if(ctrl.attackFrames[frame]){
				ctrl.collider.offsetX = ctrl.attackFrames[frame].x1;
    			ctrl.collider.offsetY = ctrl.attackFrames[frame].y1;
				ctrl.collider.width = ctrl.attackFrames[frame].x2;
				ctrl.collider.height = ctrl.attackFrames[frame].y2;
				var hitOne = player.canHitEnemy(ctrl.collider)
				if (hitOne)
				{
					console.log('WE HIT AN ENEMY!!!!');
					this.enemyHitCount++; // score?
					hitOne.currentHealth--;
					Sound.play("enemy_hit"); // TODO: after a delay?

					// directional hit splatter particles
					var angle = Math.atan2(hitOne.y-ctrl.y,hitOne.x-ctrl.x);					
					var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
					var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
									
					particleFX(hitOne.x,hitOne.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
			
					
				}
			} else {
				ctrl.collider.offsetX = 0;
    			ctrl.collider.offsetY = 0;
				ctrl.collider.width = 0;
				ctrl.collider.height = 0;
			}
			ctrl.collider.setCollider(this.x, this.y);
			ctrl.sprite.update();
		}
		currentRoom.magic.push(ctrl)
	}

	this.poisoned = function() {
		if(isPoisoned == true) {
			poisonTime++;
			console.log("posionTime");
			if (poisonTime % poisonTick == 0 && poisonTime > 0) {
				this.currentHealth--;
				Sound.play("player_hit");
				console.log("Health lost to poison");
				if (this.currentHealth <= 0) {
					resetAllRooms();
					Sound.play("player_die");
					poisonTime = 0;
					isPoisoned = false;
				}
			}else if(poisonTime > poisonDuration) {
				poisonTime = 0;
				isPoisoned = false;
				console.log("poison over");
				return;
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

	this.isCollidingWithEnemy = function() {
		var hitByEnemy = false;

		if (!currentRoom) { console.log("ERROR: currentRoom is null."); return false; }

		for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
	        if (this.hitbox.isCollidingWith(enemy.hitbox)) {
				if (!this.isInvincible) {
					this.currentHealth--;
				}
				screenShake(5);
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
						this.isInvincible = true;
						invincibleTimer = INVINCIBLE_DURATION;
					}
					screenShake(5);
					this.isStunned = true
					stunTimer = _STUN_DURATION;
					knockbackAngle = calculateAngleFrom(this.tileCollider, this.hitbox);
					knockbackSpeed = INITIAL_KNOCKBACK_SPEED;
					hitByEnemy = true;
					break;
				case TILE_WEB:
					playerFriction = _WEB_FRICTION;
					sprite.setSpeed(6)
					Sound.playUnlessAlreadyPlaying('hit_web',false,0.2);
					if (isMoving) {
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
			case TILE_WALL_OUTCORNER_SW:
			case TILE_WALL_OUTCORNER_SE:
			case TILE_WALL_OUTCORNER_NW:
			case TILE_WALL_OUTCORNER_NE:
			case TILE_WALL_NORTH_TORCH:
			case TILE_WALL_SOUTH_TORCH:
			case TILE_WALL_WEST_TORCH:
			case TILE_WALL_EAST_TORCH:
				break;
			default:
				collisionDetected = false;
				break;
		}
		return collisionDetected;
	}
}
