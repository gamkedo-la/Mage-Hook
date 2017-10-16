function poisonGasAttack(x, y) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	var cloudTimeReset = 100;
	this.cloudCount = [];
	var cloudCountLength = 3;
	this.lifetime = 100;
	
	this.attackFrames = {
		
		3: {x1: 0, y1: 0, x2: 30, y2:23 }};
		
	this.spriteSheet = sprites.PlantBaby.poisonCloud;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 12;
	this.spriteSpeed = 6;
	this.speed = 0;
	this.attackDir = [0,-1];

	console.log("cloud made");
	/*console.log(this.cloudCount.length);
	if(this.cloudCount.length >= 0) {
		if(cloudTime == 0) {
			console.log(cloudTime);
			this.remove = true;
			this.cloudCount = cloudTimeReset;
		}
	}
	if(this.cloudCount.length > cloudCountLength) {
			this.remove = true;
			this.cloudCount.pop();
	}*/
	
	this.onHitEnemy = function (enemy) {
		this.remove = false;
		isPoisoned = true;
		//Sound.play("enemy_hit"); //maybe?
	}
	return this.cloudCount.unshift(new magicClass(this, [player]));
	this.cloudRemove();
}