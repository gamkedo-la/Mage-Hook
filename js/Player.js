const PLAYER_MOVE_SPEED = 7.5;

function playerClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var playerAtStartingPosition = true;

	var collider = [];
	var colliderOffset = 5;

	this.x = 475;
	this.y = 150;
	var lastX = this.x;
	var lastY = this.y;
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
			sprite.setSprite(sprites.Player.standSouth, 96, 96, 1, 0);
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
		console.log("NO PLAYER START FOUND!");
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

		setCollider(this.x, this.y);

		for (i = 0; i < collider.length; i++) {
			var walkIntoTileIndex = getTileIndexAtPixelCoord(collider[i].x, collider[i].y);
			var walkIntoTileType = TILE_WALL;

			if(walkIntoTileIndex != undefined) {
				walkIntoTileType = worldGrid[walkIntoTileIndex];
			}
			switch(walkIntoTileType) {
				case TILE_GROUND:
					break;
				case TILE_SKULL:
					isMoving = false;
					this.x = lastX;
					this.y = lastY;
					break;
				case TILE_DOOR:
					if(this.keysInInventory > 0) {
						this.keysInInventory--; // one less key
						this.updateKeyReadout();
						worldGrid[walkIntoTileIndex] = TILE_GROUND;
					} else {
						isMoving = false;
						this.x = lastX;
						this.y = lastY;
					}
					break;
				case TILE_KEY:
					this.keysInInventory++; // one more key
					this.updateKeyReadout();
					worldGrid[walkIntoTileIndex] = TILE_GROUND;
					break;
				case TILE_WALL:
					isMoving = false;
					this.x = lastX;
					this.y = lastY;
					break;
				default:
					break;
			}
		}

		choosePlayerAnimation();

		lastX = this.x;
		lastY = this.y;

		wasMoving = isMoving;
		wasFacing = isFacing;

		sprite.update();
	}

	this.draw = function() {
		sprite.draw(this.x, this.y - 32); // - 64 to adjust for sprite height, collision aligned with feet
		canvasContext.strokeStyle = 'yellow';
		//canvasContext.strokeRect(collider[0].x, collider[0].y, colliderOffset*2, colliderOffset*2);
		drawCollider(collider);
	}

	function setCollider(posX, posY) {
		collider[0] = {
			x: posX - colliderOffset,
			y: posY - colliderOffset
		}
		collider[1] = {
			x: posX + colliderOffset,
			y: posY - colliderOffset
		}
		collider[2] = {
			x: posX - colliderOffset,
			y: posY + colliderOffset
		}
		collider[3] = {
			x: posX + colliderOffset,
			y: posY + colliderOffset
		}
	}

	function drawCollider(colliderArray) {
		for (i = 0; i < colliderArray.length; i++) {
			canvasContext.fillRect(colliderArray[i].x, colliderArray[i].y, 1, 1);
		}
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

				sprite.setSprite(playerPic, 96, 96, 7, 12);

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

				sprite.setSprite(playerPic, 96, 96, 1, 0);
			}
		}
	}
}
