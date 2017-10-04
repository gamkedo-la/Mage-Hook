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
	
	return new enemyClass(this);
}