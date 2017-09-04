const PLAYER_MOVE_SPEED = 3;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var playerAtStartingPosition = true;

	this.x = 110;
	this.y = 120;
	var lastX = this.x;
	var lastY = this.y;

	var walkIntoTileType;
	var walkIntoTileIndex;

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

	var collider = new boxColliderClass(5, 3, -2, 0);
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

		// TODO(Cipherpunk): setup logic for sprite animations when walking or idling
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

		collider.setCollider(this.x, this.y);

		for (i = 0; i < collider.corner.length; i++) {
			walkIntoTileIndex = getTileIndexAtPixelCoord(collider.corner[i].x, collider.corner[i].y);
			walkIntoTileType = TILE_WALL;

			if(walkIntoTileIndex != undefined) {
				walkIntoTileType = worldGrid[walkIntoTileIndex];
			}
			switch(walkIntoTileType) {
				case TILE_GROUND:
					break;
				case TILE_SKULL:
					this.handleCollision();
					break;
				case TILE_DOOR:
					if(this.keysInInventory > 0) {
						this.keysInInventory--; // one less key
						this.updateKeyReadout();
						worldGrid[walkIntoTileIndex] = TILE_GROUND;
					} else {
						this.handleCollision();
					}
					break;
				case TILE_KEY:
					this.keysInInventory++; // one more key
					this.updateKeyReadout();
					worldGrid[walkIntoTileIndex] = TILE_GROUND;
					break;
				case TILE_WALL:
					this.handleCollision();
					break;
				default:
					break;
			}
		}

		choosePlayerAnimation();

		collider.setCollider(lastX, lastY); // for drawing collider

		lastX = this.x;
		lastY = this.y;

		wasMoving = isMoving;
		wasFacing = isFacing;

		sprite.update();
	}

	this.draw = function() {
		sprite.draw(this.x, this.y - 7); // - 64 to adjust for sprite height, collision aligned with feet
		canvasContext.strokeStyle = 'yellow';
		collider.draw();
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

	this.handleCollision = function() {
		var emergencyTimer = 10;
		isMoving = false;
		while (walkIntoTileType == TILE_WALL ||
			   walkIntoTileType == TILE_DOOR ||
		   	   walkIntoTileType == TILE_SKULL) {
			var angle = Math.atan2(lastY - this.y, lastX - this.x);
			this.x += Math.cos(angle);
			this.y += Math.sin(angle);
			collider.setCollider(this.x, this.y);
			walkIntoTileIndex = getTileIndexAtPixelCoord(collider.corner[i].x, collider.corner[i].y);
			walkIntoTileType = worldGrid[walkIntoTileIndex];
			emergencyTimer--;
			if(emergencyTimer == 0) {
				this.x = lastX;
				this.y = lastY;
				break;
			}
		}
	}
}
