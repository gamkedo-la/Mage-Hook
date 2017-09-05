const MIN_SPEED = .25;
const MAX_SPEED = .50;
const MIN_MOVE_TIME = 1.5;
const MAX_MOVE_TIME = 2.5;

var testSpritePic
function Enemy(){

	this.recoil = false;
	var directionTimer;
	var moveAngle;
	var colliderWidth = 20;
	var colliderHeight = 14;
	var colliderOffsetX = 1;
	var colliderOffsetY = 4;
	blockedBy = []
	var blockedBy = [
		TILE_WALL,
		TILE_SKULL,
		TILE_DOOR
	]
	this.hitbox = new boxColliderClass(this.x, this.y,
										colliderWidth, colliderHeight,
										colliderOffsetX, colliderOffsetY,
										blockedBy);
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
		this.x += Math.cos(moveAngle) * moveSpeed;
		this.y += Math.sin(moveAngle) * moveSpeed;
		directionTimer -= TIME_PER_TICK;

		this.sprite.update();
		this.hitbox.update(this.x, this.y);
		this.x = this.hitbox.x;
		this.y = this.hitbox.y;
	}

	function resetMovement() {
		directionTimer = MIN_MOVE_TIME + Math.random() * MAX_MOVE_TIME;
		moveAngle = Math.random() * 2*Math.PI;
		moveSpeed = MIN_SPEED + Math.random() * MAX_SPEED;
	}
}
