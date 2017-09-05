const PLAYER_MOVE_SPEED = 3;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var playerAtStartingPosition = true;

	this.x = 110;
	this.y = 120;

	this.name = "Untitled Player";
	this.keysInInventory = 0;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

	var colliderWidth = 4;
	var colliderHeight = 4;
	var colliderOffsetX = -1;
	var colliderOffsetY = 2;
	var blockedBy = [
		TILE_WALL,
		TILE_SKULL,
		TILE_DOOR];

	this.collider = new boxColliderClass(this.x, this.y,
										colliderWidth, colliderHeight,
										colliderOffsetX, colliderOffsetY,
										blockedBy);
	var colliderWidth = 7;
	var colliderHeight = 22;
	var colliderOffsetX = -1;
	var colliderOffsetY = -7;
	blockedBy = []
	this.hitbox = new boxColliderClass(this.x, this.y,
									   colliderWidth, colliderHeight,
								       colliderOffsetX, colliderOffsetY,
									   blockedBy);
	var sprite = new spriteClass();

	this.setupInput = function(upKey, rightKey, downKey, leftKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
	}

	this.reset = function(playerName) {
		this.name = playerName;
		if (playerAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 32, 32, 1, 0);
			playerAtStartingPosition = false;
		}
		this.keysInInventory = 0;
		this.updateKeyReadout();

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(worldGrid[arrayIndex] == TILE_PLAYERSTART) {
					worldGrid[arrayIndex] = TILE_GROUND;
					this.x = eachCol * WORLD_W + WORLD_W/2;
					this.y = eachRow * WORLD_H + WORLD_H/2;
					return;
				} // end of player start if
			} // end of col for
		} // end of row for
	} // end of playerReset func

	this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + this.keysInInventory;
	}

	this.move = function() {
		isMoving = false;

		if(this.keyHeld_North && !this.keyHeld_South) {
			this.y -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "North";
		}
		if(this.keyHeld_East && !this.keyHeld_West) {
			this.x += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "East";
		}
		if(this.keyHeld_South && !this.keyHeld_North) {
			this.y += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "South";
		}
		if(this.keyHeld_West && !this.keyHeld_East) {
			this.x -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "West";
		}

		this.hitbox.update(this.x, this.y);
		this.collider.update(this.x, this.y);
		var collisions = this.collider.getTileIndexes();

		for (var index in collisions) {
			var tileIndex = collisions[index];
			var tileType = worldGrid[tileIndex];
			switch(tileType) {
				case TILE_GROUND:
					break;
				case TILE_SKULL:
					isMoving = false;
					break;
				case TILE_DOOR:
					if(this.keysInInventory > 0) {
						this.keysInInventory--; // one less key
						this.updateKeyReadout();
						worldGrid[tileIndex] = TILE_GROUND;
					} else {
						isMoving = false;
					}
					break;
				case TILE_KEY:
					this.keysInInventory++; // one more key
					this.updateKeyReadout();
					worldGrid[tileIndex] = TILE_GROUND;
					break;
				case TILE_WALL:
					isMoving = false;
					break;
				default:
					break;
			}
		}

		player.x = this.collider.x;
		player.y = this.collider.y;

		choosePlayerAnimation();

		wasMoving = isMoving;
		wasFacing = isFacing;

		sprite.update();

		// logging
		// console.log(this.x + ": " + this.y);
	}

	this.draw = function() {
		sprite.draw(this.x, this.y - 7);
		canvasContext.strokeStyle = 'yellow';
		//this.collider.draw();
		//this.hitbox.draw();
	}

	function choosePlayerAnimation() {
		if (wasMoving != isMoving ||
			wasFacing != isFacing)
		{
			var playerPic;

			if (isMoving) {
				if (isFacing == "South") {
					playerPic = sprites.Player.walkSouth;

				} else if (isFacing == "East") {
					playerPic = sprites.Player.walkEast;

				} else if (isFacing == "North") {
					playerPic = sprites.Player.walkNorth;

				} else if (isFacing == "West") {
					playerPic = sprites.Player.walkWest;
				}

				sprite.setSprite(playerPic, 32, 32, 7, 12);

			} else {
 				if (isFacing == "South") {
					playerPic = sprites.Player.standSouth;

				} else if (isFacing == "East") {
					playerPic = sprites.Player.standEast;

				} else if (isFacing == "North") {
					playerPic = sprites.Player.standNorth;

				} else if (isFacing == "West") {
					playerPic = sprites.Player.standWest;
				}

				sprite.setSprite(playerPic, 32, 32, 1, 0);
			}
		}
	}
}
