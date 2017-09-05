const MIN_SPEED = .25;
const MAX_SPEED = .50;
const MIN_MOVE_TIME = 1.5;
const MAX_MOVE_TIME = 2.5;
const MARGIN = 25;

var testSpritePic
function Enemy(){

	var directionTimer;
	var moveAngle;
	var colliderWidth = 12;
	var colliderHeight = 8;
	var colliderOffsetX = 1;
	var colliderOffsetY = 7;
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
	this.hitbox.setCollider(this.x, this.y);
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

		if (directionTimer <= 0 || directionTimer == undefined ||
			this.x < 0 + MARGIN || this.x > canvas.width - MARGIN ||
			this.y < 0 + MARGIN || this.y > canvas.height - MARGIN) {
			directionTimer = MIN_MOVE_TIME + Math.random() * MAX_MOVE_TIME;
			moveAngle = Math.random() * 2*Math.PI;
			moveSpeed = MIN_SPEED + Math.random() * MAX_SPEED;
		}
		this.x += Math.cos(moveAngle) * moveSpeed;
		this.y += Math.sin(moveAngle) * moveSpeed;
		directionTimer -= TIME_PER_TICK;

		this.sprite.update();
		this.hitbox.update(this.x, this.y);
	}
}
