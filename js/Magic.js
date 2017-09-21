
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
	 
	 currentRoom.magic.push(this);
 }
 
 function anchorMagic() {
	 
 }
 
 function missileMagic() {
	 
 }
