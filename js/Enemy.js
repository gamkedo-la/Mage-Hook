const MIN_SPEED = .25;
const MAX_SPEED = .50;
const MIN_MOVE_TIME = 1.5;
const MAX_MOVE_TIME = 2.5;

var testSpritePic
function Enemy(x, y){

	this.x = x;
	this.y = y;
	var originX = this.x;
	var originY = this.y;
	this.recoil = false;
	var directionTimer;
	var moveAngle;
	var colliderWidth = 18;
	var colliderHeight = 14;
	var colliderOffsetX = 1;
	var colliderOffsetY = 5;
	this.hitbox = new boxColliderClass(this.x, this.y,
										colliderWidth, colliderHeight,
										colliderOffsetX, colliderOffsetY);
	this.sprite = new spriteClass();
	this.sprite.setSprite(sprites.Slime.idleAnimation, 32, 32, 6, 9);

	var sprite = new spriteClass();
	this.draw = function() {
		this.sprite.draw(this.x, this.y);
		if(_DEBUG_DRAW_COLLIDERS) {
			this.hitbox.draw();
		}
		//colorText(Math.round(directionTimer * 100)/100, this.x, this.y, 'white');
	}
	this.update = function(){
		if (this.recoil) {
			if (!player.isStunned) {
				this.sprite.setSprite(sprites.Slime.idleAnimation, 32, 32, 6, 9);
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
		movePerCheck = (Math.cos(moveAngle) * moveSpeed)/checksPerFrame;
		this.moveOnAxisAndCheckForCollisions(checksPerFrame, movePerCheck, "x");
		movePerCheck = (Math.sin(moveAngle) * moveSpeed)/checksPerFrame;
		this.moveOnAxisAndCheckForCollisions(checksPerFrame, movePerCheck, "y");

		directionTimer -= TIME_PER_TICK;
		originX = this.x;
		originY = this.y;

		this.sprite.update();
		this.hitbox.update(this.x, this.y);
	}

	function resetMovement() {
		directionTimer = MIN_MOVE_TIME + Math.random() * MAX_MOVE_TIME;
		moveAngle = Math.random() * 2*Math.PI;
		moveSpeed = MIN_SPEED + Math.random() * MAX_SPEED;
	}

	this.updateColliders = function() {
		this.hitbox.update(this.x, this.y);
	}

	this.moveOnAxisAndCheckForCollisions = function(checksPerFrame, movePerCheck, axis) {
		for (var i = 0; i < checksPerFrame; i++) {
			var collisionDetected = false;
			var origin;
			origin = this[axis];
			this[axis] += movePerCheck;
			this.updateColliders();

			for (var corner in this.hitbox.box) {
				var x = this.hitbox.box[corner].x;
				var y = this.hitbox.box[corner].y;
				var tileIndex = getTileIndexAtPixelCoord(x, y);
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
			}
			if (collisionDetected) {
				this[axis] = origin;
				resetMovement();
				this.updateColliders();
				return;
			}
		}
	}
}
