function slimeMonster(x, y) {

	this.x = x;
	this.y = y;

	this.maxHealth = 3; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = undefined;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.Slime.idleAnimation;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 6;
	this.spriteSpeed = 9;
	
	this.deathSpriteSheet = sprites.Slime.deathAnimation;
	this.deathSpriteFrames = 10;
	this.deathSpriteSpeed = 4;
	var directionTimer = 0;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;

	var staates = {
		munch : function(){
			if(!this.ticksInState){
				this.sprite.setSprite(sprites.Slime.munch, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
				muunch(this.x, this.y);
			}
			if(this.sprite.isDone()){
				this.sprite.setSprite(sprites.Slime.idleAnimation, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					4, this.enemyData.spriteSpeed, false);
			} else {
				this.sprite.update();
			}
			if(this.ticksInState > 100){
				this.setState("normal")
			}

		},
		normal : function(){
			if(this.maxHealth != this.currentHealth){
				if( Math.abs(this.y - player.y) < 20 ){
					this.setState("munch")
					return;
				}
				if( Math.abs(this.x - player.x) < 20){
					this.setState("munch")
					return;
				}
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(this.enemyData.spriteSheet, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);

			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		},
	}
	return new enemyClass(this, staates);
}