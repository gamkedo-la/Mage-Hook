function heroBoss(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 300; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 12;
	this.tileColliderOffsetX = 0;
	this.tileColliderOffsetY = 26;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 0;
	this.hitboxOffsetY = 26;

	this.spriteSheet = sprites.HeroBoss.walkSouth;
	this.spriteWidth = 64;
	this.spriteHeight = 64;
	this.spriteFrames = 8;
	this.spriteSpeed = 9;
	
	//this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = 1;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {
		normal : function(){
			if(this.maxHealth != this.currentHealth){
				if( Math.abs(this.y - player.y) < 20 ){
					//this.setState("munch")
					return;
				}
				if( Math.abs(this.x - player.x) < 20){
					//this.setState("munch")
					return;
				}
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(sprites.HeroBoss.Stand, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					1, this.enemyData.spriteSpeed, true);

			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
		wander : function(){

			if(!this.ticksInState){
				directionTimer = minMoveTime //+ Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				this.velX = Math.cos(angle) * speed;
				this.velY = Math.sin(angle) * speed;
				// this.sprite.setSprite(this.enemyData.spriteSheet,
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(Math.abs(this.velX) > Math.abs(this.velY)){
					if(this.velX > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkEast){
						this.sprite.setSprite(sprites.HeroBoss.walkEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							8, this.enemyData.spriteSpeed, true);	
					}else if (this.velX < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkWest){						
						this.sprite.setSprite(sprites.HeroBoss.walkWest,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				} else {
					if(this.velY > 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkSouth){
						this.sprite.setSprite(sprites.HeroBoss.walkSouth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}else if (this.velY < 0 && this.sprite.getSpriteSheet() != sprites.HeroBoss.walkNorth){
						this.sprite.setSprite(sprites.HeroBoss.walkNorth,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight,
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, this.velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, this.velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		
		}
	}
	return new enemyClass(this, staates);
}