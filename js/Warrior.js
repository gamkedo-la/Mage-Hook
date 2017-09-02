const PLAYER_MOVE_SPEED = 7.5;

function warriorClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;

	this.x = 475;
	this.y = 125;
	this.name = "Untitled Warrior";
	this.keysHeld = 0;

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

	this.reset = function(whichImage, warriorName) {
		this.name = warriorName;
		sprite.setSprite(sprites.Player.standSouth, 96, 96, 1, 0);
		this.keysHeld = 0;
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
	} // end of warriorReset func

	this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + this.keysHeld;
	}

	this.move = function() {
		var nextX = this.x;
		var nextY = this.y;

		// TODO(Cipherpunk): setup logic for sprite animations when walking or idling
		isMoving = false;

		if(this.keyHeld_North) {
			nextY -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "North";
		}
		if(this.keyHeld_East) {
			nextX += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "East";
		}
		if(this.keyHeld_South) {
			nextY += PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "South";
		}
		if(this.keyHeld_West) {
			nextX -= PLAYER_MOVE_SPEED;
			isMoving = true;
			isFacing = "West";
		}

		chooseWarriorAnimation();

		wasMoving = isMoving;
		wasFacing = isFacing;

		var walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
		var walkIntoTileType = TILE_WALL;

		if(walkIntoTileIndex != undefined) {
			walkIntoTileType = worldGrid[walkIntoTileIndex];
		}

		switch(walkIntoTileType) {
			case TILE_GROUND:
				this.x = nextX;
				this.y = nextY;
				break;
			case TILE_GOAL:
				console.log(this.name + " WINS!");
				break;
			case TILE_DOOR:
				if(this.keysHeld > 0) {
					this.keysHeld--; // one less key
					this.updateKeyReadout();
					worldGrid[walkIntoTileIndex] = TILE_GROUND;
				}
				break;
			case TILE_KEY:
				this.keysHeld++; // one more key
				this.updateKeyReadout();
				worldGrid[walkIntoTileIndex] = TILE_GROUND;
				break;
			case TILE_WALL:
			default:
				break;
		}

		sprite.update();
	}

	this.draw = function() {
		sprite.draw(this.x, this.y);
	}

	function chooseWarriorAnimation() {
		if (wasMoving != isMoving ||
			wasFacing != isFacing)
		{
			var warriorPic;

			if (isMoving && isFacing == "South") {
				warriorPic = sprites.Player.walkSouth;

			} else if (isMoving && isFacing == "East") {
				warriorPic = sprites.Player.walkEast;

			} else if (isMoving && isFacing == "North") {
				warriorPic = sprites.Player.walkNorth;

			} else if (isMoving && isFacing == "West") {
				warriorPic = sprites.Player.walkWest;

			} else if (isFacing == "South") {
				warriorPic = sprites.Player.standSouth;

			} else if (isFacing == "East") {
				warriorPic = sprites.Player.standEast;

			} else if (isFacing == "North") {
				warriorPic = sprites.Player.standNorth;

			} else if (isFacing == "West") {
				warriorPic = sprites.Player.standWest;
			}

			if (isMoving) {
				sprite.setSprite(warriorPic, 96, 96, 7, 12);

			} else {
				sprite.setSprite(warriorPic, 96, 96, 1, 0);
			}
		}
	}
}
