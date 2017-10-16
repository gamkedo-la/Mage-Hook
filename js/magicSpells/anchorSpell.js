function anchorMagic(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		4: {x1: 5, y1: 8, x2: 20, y2:10 },
		5: {x1: 5, y1: 8, x2: 20, y2:10 },
		6: {x1: 5, y1: 8, x2: 20, y2:10 }};
		
	this.spriteSheet = sprites.Player.anchorAttack;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 13;
	
	this.attackDir = [0,0];
	
	switch(this.isFacing) { //Draw attack in facing dirction
			case NORTH:
				this.x -= 6;
				this.y -= 16;
				break;
			case SOUTH:
				this.x -= 6;
				this.y += 16;
				break;
			case EAST:
				this.x += 13;
				break;
			case WEST:
				this.x -= 25;
				break;
		}
	
	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.getHit(1);
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
	
	return new magicClass(this);
 }