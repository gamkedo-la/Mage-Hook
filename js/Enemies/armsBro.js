function armsBro(x, y) {
	this.x = x;
	this.y = y;

	this.maxHealth = 5; // how many hits till it dies
	this.currentHealth = this.maxHealth;
	this.lootModifier = 1.0;
	this.droppedTile = TILE_SKULL;

	this.tileColliderWidth = 18;
	this.tileColliderHeight = 4;
	this.tileColliderOffsetX = 2;
	this.tileColliderOffsetY = 11;

	this.hitboxWidth = 18;
	this.hitboxHeight = 14;
	this.hitboxOffsetX = 2;
	this.hitboxOffsetY = 6;

	this.spriteSheet = sprites.ArmsBro.walkAnimation;
	this.spriteSheetEast = sprites.ArmsBro.walkAnimationEast;
	this.spriteWidth = 32;
	this.spriteHeight = 32;
	this.spriteFrames = 7;
	this.spriteSpeed = 9;
	var minSpeed = .25;
	var maxSpeed = .50;
	var minMoveTime = 1.5;
	var maxMoveTime = 2.5;
	var staaates = { 
		charge: function(){
			this.setState("throwBone")
		},
		throwBone: function(){
			if(this.ticksInState % 30 == 0){
				var direction;//hoisted?
				if(player.x > this.x){
					direction = EAST;
				} else {
					direction = WEST;

				}
				//TODO: make enmy face direction
				//TODO: make enmy throw bone in y direction if player is there
				boneThrow(this.x, this.y, direction)
				
			}
			if(this.ticksInState > 28){
				this.setState("normal")
			}
		},
		normal : function(){		
			if( Math.abs(this.y - player.y) < 10){
				this.setState("throwBone")
				return;
			}
			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				this.sprite.setSprite(this.enemyData.spriteSheet, //TODO: maybe derp emote? 
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);

				// this.sprite.setSprite(sprites.Player.rangedAttack, //TODO: maybe derp emote? 
				// 	this.enemyData.spriteWidth, this.enemyData.spriteHeight,
				// 	4, 10, true);
			}
			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}, 
		wander : function(){
			if( Math.abs(this.y - player.y) < 10){
				this.setState("throwBone")
				return;
			}

			if(!this.ticksInState){
				directionTimer = minMoveTime + Math.random() * maxMoveTime;
				var speed = minSpeed + Math.random() * maxSpeed;
				var angle = Math.random() * 2*Math.PI;

				velX = Math.cos(angle) * speed;
				velY = Math.sin(angle) * speed;
				this.sprite.setSprite(this.enemyData.spriteSheet,
					this.enemyData.spriteWidth, this.enemyData.spriteHeight,
					this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);
				if(this.sprite.getSpriteSheet() == this.enemyData.spriteSheet && this.enemyData.spriteSheetEast){
					if(velX > 0){
						var frames = this.enemyData.spriteSheetEastFrames ? this.enemyData.spriteSheetEastFrames : this.enemyData.spriteFrames;
						this.sprite.setSprite(this.enemyData.spriteSheetEast,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							frames, this.enemyData.spriteSpeed, true);	
					}
				}else if (this.sprite.getSpriteSheet() == this.enemyData.spriteSheetEast){
					if(velX < 0){

						this.sprite.setSprite(this.enemyData.spriteSheet,
							this.enemyData.spriteWidth, this.enemyData.spriteHeight, 
							this.enemyData.spriteFrames, this.enemyData.spriteSpeed, true);	
					}
				}
			}

			if (directionTimer <= 0 || directionTimer == undefined) {
				this.setState("derpAround")
			}

			this.tileCollider.moveOnAxis(this, velX, X_AXIS);
			this.tileCollider.moveOnAxis(this, velY, Y_AXIS);
			directionTimer -= TIME_PER_TICK;
			this.sprite.update();
			this.tileBehaviorHandler();
		}
	}
	return new enemyClass(this, staaates);
}