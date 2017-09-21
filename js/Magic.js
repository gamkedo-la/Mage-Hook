
 function magicClass(magic) {
	 this.x = magic.x;
	 this.y = magic.y;
	 this.maxHealth = magic.maxHealth;
	 this.isFacing = magic.isFacing;
	 
	 this.hitbox = new boxColliderClass(this.x, this.y,
										magic.tileColliderWidth, magic.tileColliderHeight,
										magic.tileColliderOffsetX, magic.tileColliderOffsetY);
	 
	
	this.sprite = new spriteClass();
	this.sprite.setSprite(	magic.spriteSheet,
							magic.spriteWidth, magic.spriteHeight,
							magic.spriteFrames, magic.spriteSpeed, true);
	 
	this.onHitEnemy = magic.onHitEnemy;
	 
	this.draw = function() {
		 
	}
	
	this.update = function() {
		
	}
	
	this.hitEnemy = function() {
		for (var i = 0; i < currentRoom.enemyList.length; i++) {
			var enemy = currentRoom.enemyList[i];
			if (this.hitbox.isCollidingWith(enemy.hitbox))
				this.onHitEnemy(enemy);
		}
	}
	
	currentRoom.magic.push(this);
 }
 
 function anchorMagic(x, y, isFacing) {
	
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.attackDir = [0,0];
	this.animFrame = 7;
	
	switch(this.isFacing) { //Draw attack in facing dirction
			case NORTH:
				this.x -= 16;
				this.y -= 16;
				break;
			case SOUTH:
				this.x -= 16;
				this.y += 16;
				break;
			case EAST:
				this.x += 3;
				break;
			case WEST:
				this.x -= 35;
				break;
		}
	
	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
 }
 
 function missileMagic(x, y, isFacing) {
	this.x = x;
	this.y = y;
	this.isFacing = isFacing;
	
	this.animFrame = 4;
	
	switch(this.isFacing) { //Draw attack in facing dirction
			case NORTH:
				this.attackDir = [0,-1];
				break;
			case SOUTH:
				this.attackDir = [0,1];
				break;
			case EAST:
				this.attackDir = [2,0];
				break;
			case WEST:
				this.attackDir = [-2,0];
				break;
	}
	
	this.onHitEnemy = function (enemy) {
		console.log('WE HIT AN ENEMY!!!!');
		player.enemyHitCount++;
		enemy.currentHealth--;
		Sound.play("enemy_hit"); // TODO: after a delay?
		// directional hit splatter particles
		var angle = Math.atan2(enemy.y-this.y,enemy.x-this.x);					
		var vx = Math.cos(angle) * BLOOD_SPLATTER_SPEED;
		var vy = Math.sin(angle) * BLOOD_SPLATTER_SPEED;
						
		particleFX(enemy.x,enemy.y,PARTICLES_PER_ENEMY_HIT,'#660000',vx,vy,0.5,0,1);
	}
 }
