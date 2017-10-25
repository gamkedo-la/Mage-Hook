BONE_SPLATTER_SPEED = 0.5;

function boneThrow(x, y, isFacing) {
	Sound.play("player_attack");
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackFrames = {
		0: {x1: 0, y1: 0, x2: 20, y2:20 },
		1: {x1: 0, y1: 0, x2: 20, y2:20 },
		2: {x1: 0, y1: 0, x2: 20, y2:20 },
		3: {x1: 0, y1: 0, x2: 20, y2:20 }};
		
	this.spriteSheet = sprites.ArmsBro.boneThrow;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 12;
	this.spriteSpeed = 13;
	this.speed = 3

	this.raycasting = function() {
	var nextTileX = this.x;
	var nextTileY = this.y;
	isGround = true;
		while (isGround) {
			if (this.attackDir[1] < 0) { // NORTH
				nextTileY -= 20; 
			} else if (this.attackDir[1] > 0) { // SOUTH
				nextTileY += 20;
			} else if (this.attackDir[0] > 0) { // EAST
				nextTileX += 20;
			} else if (this.attackDir[0] < 0) { // WEST
				nextTileX -= 20;
			}
			tileIndex = getTileIndexAtPixelCoord(nextTileX, nextTileY);
			if (worldGrid[tileIndex] != TILE_GROUND) {
				return calculateTopLeftCoordOfTileIndex(tileIndex);
				break;
			}
		}
	}

	switch(this.isFacing) { //Draw attack in facing dirction
		case NORTH:
			this.x -= 6;
			this.y -= 16;
			this.attackDir = [0,-1];
			break;
		case SOUTH:
			this.x -= 6;
			this.y += 16;
			this.attackDir = [0,1];
			break;
		case EAST:
			this.x += 13;
			this.attackDir = [2,0];
			obstacle = this.raycasting();
			console.log(obstacle);
			break;
		case WEST:
			this.x -= 25;
			this.attackDir = [-2,0];
			obstacle = this.raycasting();
			obstacle.x += 20
			console.log(obstacle);		
			break;
	}

	this.tileHit = function() {
		var angle = Math.atan2(this.y,this.x);					
		var vx = Math.cos(angle) * BONE_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BONE_SPLATTER_SPEED;
						
		particleFX(this.x,this.y,PARTICLES_PER_ENEMY_HIT,'white',vx,vy,0.5,0,1);
	}

	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		this.remove = true;
		enemy.getHit(1);
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