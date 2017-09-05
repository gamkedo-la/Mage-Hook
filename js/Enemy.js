var testSpritePic
function Enemy(){

	var colliderWidth = 16;
	var colliderHeight = 16;
	var colliderOffsetX = 1;
	var colliderOffsetY = 5;
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
		//this.hitbox.draw();
	}
	this.update = function(){
		this.sprite.update();
		this.hitbox.update(this.x, this.y);
		this.x += -1 + Math.floor(Math.random() * 3)
		this.y += -1 + Math.floor(Math.random() * 3)
		if(this.x < 0 ){
			this.x = 0
		}
		if(this.y < 0){
			this.y = 0
		}

	}
}
