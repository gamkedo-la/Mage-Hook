var testSpritePic
function Enemy(){
	//var collider = new boxColliderClass(7, 3, -2, 0);
	this.x = 475;
	this.y = 150;
	
	this.sprite = new spriteClass();
	this.sprite.setSprite(sprites.Slime.idleAnimation, 32, 32, 6, 9);

	var sprite = new spriteClass();
	this.draw = function() {
		this.sprite.draw(this.x, this.y - 32); // - 64 to adjust for sprite height, collision aligned with feet
		canvasContext.strokeStyle = 'yellow';
		//collider.draw();
	}
	this.update = function(){
		this.sprite.update();
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