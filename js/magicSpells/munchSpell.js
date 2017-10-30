function muunch(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = EAST;
	this.canRaycast = false;
	
	this.attackFrames = {
		
		3: {x1: 0, y1: 0, x2: 55, y2:55 }};
		
	this.spriteSheet = sprites.ArmsBro.boneThrow;
	this.spriteWidth = 2;
	this.spriteHeight = 2;
	this.spriteFrames = 12;
	this.spriteSpeed = 13;
	this.speed = 0;
	this.attackDir = [0,-1];

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		this.remove = true;
		enemy.getHit(4);
		if (enemy.currentHealth <= 0) {
			isPoisoned = false;
			enemy.reset("Untitled Player");
			resetAllRooms();
			Sound.play("player_die");
		}
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this, [player]);
}