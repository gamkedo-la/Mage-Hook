const MIN_SPEED = .25;
const MAX_SPEED = .50;
const MIN_MOVE_TIME = 1.5;
const MAX_MOVE_TIME = 2.5;
const ITEM_KEY_DROP_PERCENT = 70; //al item drop rates should add up to 100
const ITEM_POTION_DROP_PERCENT = 15;
const ITEM_KEY_RUBY_DROP_PERCENT = 13;
const ITEM_KEY_EMERALD_DROP_PERCENT = 1;

var testSpritePic
function enemyClass(x, y){

	this.x = x;
	this.y = y;
	this.recoil = false;
	var directionTimer;
	var moveAngle;
	var currentSpeed;

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
				var dropType = Math.random() * 100;
				if (dropType <= ITEM_KEY_DROP_PERCENT)
					dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY);
				else
					dropType -= ITEM_KEY_DROP_PERCENT;
				
				if (dropType <= ITEM_POTION_DROP_PERCENT)
					dropItem(this.hitbox.x, this.hitbox.y, ITEM_POTION);
				else
					dropType -= ITEM_POTION_DROP_PERCENT;
				
				if (dropType <= ITEM_KEY_RUBY_DROP_PERCENT)
					dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_RUBY);
				else
					dropType -= ITEM_KEY_RUBY_DROP_PERCENT;
				
				if (dropType <= ITEM_KEY_EMERALD_DROP_PERCENT)
					dropItem(this.hitbox.x, this.hitbox.y, ITEM_KEY_EMERALD);
				else
					dropType -= ITEM_KEY_EMERALD_DROP_PERCENT;
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
		movePerCheck = (Math.cos(moveAngle) * currentSpeed)/checksPerFrame;
		moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
											checksPerFrame, movePerCheck, X_AXIS);

		// movePerCheck = 1; // for testing collisions
		movePerCheck = (Math.sin(moveAngle) * currentSpeed)/checksPerFrame;
		moveOnAxisAndCheckForTileCollisions(this, this.tileCollider,
											checksPerFrame, movePerCheck, Y_AXIS);

		directionTimer -= TIME_PER_TICK;

		this.sprite.update();
		this.tileBehaviorHandler();
	} // end of this.update()

	function resetMovement() {
		directionTimer = MIN_MOVE_TIME + Math.random() * MAX_MOVE_TIME;
		moveAngle = Math.random() * 2*Math.PI;
		currentSpeed = MIN_SPEED + Math.random() * MAX_SPEED;
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
				break;
			case TILE_DOOR:
				break;
			case TILE_WALL:
				break;
			default:
				collisionDetected = false;
				break;
		}
		return collisionDetected;
	}

	this.tileBehaviorHandler = function() {
		// default behaviors go here
		enemyFriction = FRICTION;
		sprite.setSpeed(9);

		var types = this.tileCollider.checkTileTypes();
		for (var i = 0; i < types.length; i++) {
			switch (types[i]) {
				case TILE_OOZE:
					for (var i = 0; i < PARTICLES_PER_TICK; i++) {
						var tempParticle = new particleClass(player.hitbox.x, player.hitbox.y, 'lime');
						particle.push(tempParticle);
					}
					break;
				case TILE_WEB:
					enemyFriction = WEB_FRICTION;
					sprite.setSpeed(4.5)
					for (var i = 0; i < PARTICLES_PER_TICK; i++) {
						var tempParticle = new particleClass(player.hitbox.x, player.hitbox.y, 'lightGrey');
						particle.push(tempParticle);
					}
					break;
				default:
					break;
			}
		}
	}
}
