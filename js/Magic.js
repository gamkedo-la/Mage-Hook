const RANGED_ATTACK_SPEED = 2;
const BLOOD_SPLATTER_SPEED = 1;
const PARTICLES_PER_ENEMY_HIT = 16;

function magicClass(magic, enemyList) {
	this.x = magic.x;
	this.y = magic.y;
	this.maxHealth = magic.maxHealth;
	this.isFacing = magic.isFacing;
	this.lifetime = magic.lifetime || false;
	 
	this.collider = new boxColliderClass(this.x, this.y, 0, 0, 0, 0);
	 
	this.attackFrames = magic.attackFrames;
	this.attackDir = magic.attackDir;
	
	this.sprite = new spriteClass();
	this.sprite.setSprite(	magic.spriteSheet,
							magic.spriteWidth, magic.spriteHeight,
							magic.spriteFrames, magic.spriteSpeed, true);
	this.remove = false;
	this.onHitEnemy = magic.onHitEnemy;
	if(magic.speed == undefined){
		this.speed = RANGED_ATTACK_SPEED;
	} else {
		this.speed = magic.speed
	}
	if(!enemyList){
		this.enemyList = currentRoom.enemyList;
	} else {
		this.enemyList = enemyList;
	}
	this.draw = function() {
		this.sprite.draw(this.x,this.y);
		if(_DEBUG_DRAW_HITBOX_COLLIDERS) {
			this.collider.draw('red');
		}
	}

	this.update = function() {
		if(this.sprite.isDone() || this.remove){
			var index = currentRoom.magic.indexOf(this);
			if(index !== -1) {
				currentRoom.magic.splice(index, 1);
				console.log("attack removed")
				return;
			}
		}
		this.x += this.attackDir[0]*this.speed;
		this.y += this.attackDir[1]*this.speed;
		var frame = this.sprite.getFrame();
		if(this.attackFrames[frame]){
			this.collider.offsetX = this.attackFrames[frame].x1;
			this.collider.offsetY = this.attackFrames[frame].y1;
			this.collider.width = this.attackFrames[frame].x2;
			this.collider.height = this.attackFrames[frame].y2;
			this.hitEnemy();
		} else {
			this.collider.offsetX = 0;
			this.collider.offsetY = 0;
			this.collider.width = 0;
			this.collider.height = 0;
		}
		this.collider.setCollider(this.x, this.y);
		this.sprite.update();
		if (typeof this.lifetime == "number") {
			this.lifetime--;
			if (this.lifetime < 0) {
				this.remove = true;
			}
		}
	}

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

	this.spellHitTile = function() { //only tests when Spell travels WEST for now
	var obstacle = this.raycasting();
		if (this.attackDir[0] < 0) {
			if (this.x <= obstacle.x + 20) {
				console.log("spell X < obstacle X");
				this.remove = true;
			}
		}
	}

	this.hitEnemy = function() {
		for (var i = 0; i < this.enemyList.length; i++) {
			var enemy = this.enemyList[i];
			if (this.collider.isCollidingWith(enemy.hitbox))
				this.onHitEnemy(enemy);
		}
	}

	currentRoom.magic.push(this);
}