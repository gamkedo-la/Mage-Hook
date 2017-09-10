const MIN_SPEED = .25;
const MAX_SPEED = .50;
const MIN_MOVE_TIME = 1.5;
const MAX_MOVE_TIME = 2.5;


var testSpritePic
function enemyClass(x, y){

	this.x = x;
	this.y = y;
	this.recoil = false;
	var directionTimer;
	var moveAngle;

	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.isAlive = true;

	var tileColliderWidth = 18;
	var tileColliderHeight = 4;
	var tileColliderOffsetX = 2;
	var tileColliderOffsetY = 11;
	this.tileCollider = new boxColliderClass(this.x, this.y,
											 tileColliderWidth, tileColliderHeight,
											 tileColliderOffsetX, tileColliderOffsetY);
	var hitboxWidth = 18;
	var hitboxHeight = 14;
	var hitboxOffsetX = 2;
	var hitboxOffsetY = 6;
	this.hitbox = new boxColliderClass(this.x, this.y,
									   hitboxWidth, hitboxHeight,
									   hitboxOffsetX, hitboxOffsetY);
	this.sprite = new spriteClass();
	this.sprite.setSprite(sprites.Slime.idleAnimation, 32, 32, 6, 9, true);

	var sprite = new spriteClass();

	this.die = function() {
		console.log('An enemy died!');

		this.isAlive = false;
		this.x = -99999999;
		this.y = -99999999;

		// remove from enemy list
		var foundHere = currentRoom.enemyList.indexOf(this);
		if (foundHere > -1) {
			currentRoom.enemyList.splice(foundHere, 1);
		}
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
	this.update = function(){

		if (this.currentHealth <= 0)
		{
			this.die();
			for (var i = 0; i < ITEMS_DROPPED_PER_KILL; i++) {
				dropItem(this.hitbox.x, this.hitbox.y);
				// dropItem(this.tileCollider.x, this.tileCollider.y);
			}
			return;
		}

		if (this.recoil) {
			if (!player.isStunned) {
				this.sprite.setSprite(sprites.Slime.idleAnimation, 32, 32, 6, 9, true);
				resetMovement();
				this.recoil = false;
			}
			return;
		}

		if (directionTimer <= 0 || directionTimer == undefined) {
			resetMovement();
		}
		var checksPerFrame = 5;
		var movePerCheck;

		// movePerCheck = 1; // for testing collisions
		movePerCheck = (Math.cos(moveAngle) * moveSpeed)/checksPerFrame;
		moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
											checksPerFrame, movePerCheck, X_AXIS);

		// movePerCheck = 1; // for testing collisions
		movePerCheck = (Math.sin(moveAngle) * moveSpeed)/checksPerFrame;
		moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
											checksPerFrame, movePerCheck, Y_AXIS);

		directionTimer -= TIME_PER_TICK;

		this.sprite.update();
	}

	function resetMovement() {
		directionTimer = MIN_MOVE_TIME + Math.random() * MAX_MOVE_TIME;
		moveAngle = Math.random() * 2*Math.PI;
		moveSpeed = MIN_SPEED + Math.random() * MAX_SPEED;
	}

	this.updateColliders = function() {
		this.tileCollider.update(this.x, this.y);
		this.hitbox.update(this.x, this.y);
	}

	this.collisionHandler = function(tileIndex) {
		var collisionDetected = false;
		var tileType = worldGrid[tileIndex];
		switch(tileType) {
			case TILE_SKULL:
				collisionDetected = true;
				break;
			case TILE_DOOR:
				collisionDetected = true;
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
