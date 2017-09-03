const PLAYER_MOVE_SPEED = 7.5;

function warriorClass() {
	var isMoving = false;
	var wasMoving = false;
	var isFacing = "South";
	var wasFacing = isFacing;
	var warriorAtStartingPosition = true;

	var collider = [];
	var colliderOffset = 5;

	this.x = 475;
	this.y = 150;
	var previousX = this.x;
	var previousY = this.y;
	this.name = "Untitled Warrior";
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

	this.reset = function(warriorName) {
		this.name = warriorName;
		if (warriorAtStartingPosition)
		{
			sprite.setSprite(sprites.Player.standSouth, 96, 96, 1, 0);
			warriorAtStartingPosition = false;
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
	} // end of warriorReset func

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

		collider[0] = {
			x: this.x - colliderOffset,
			y: this.y - colliderOffset
		}
		collider[1] = {
			x: this.x + colliderOffset,
			y: this.y - colliderOffset
		}
		collider[2] = {
			x: this.x - colliderOffset,
			y: this.y + colliderOffset
		}
		collider[3] = {
			x: this.x + colliderOffset,
			y: this.y + colliderOffset
		}

		for (i = 0; i < collider.length; i++) {
			var walkIntoTileIndex = getTileIndexAtPixelCoord(collider[i].x, collider[i].y);
			var walkIntoTileType = TILE_WALL;

			if(walkIntoTileIndex != undefined) {
				walkIntoTileType = worldGrid[walkIntoTileIndex];
				console.log(walkIntoTileType);
			}
			switch(walkIntoTileType) {
				case TILE_GROUND:
					break;
				case TILE_GOAL:
					console.log(this.name + " WINS!");
					break;
				case TILE_DOOR:
					if(this.keysInInventory > 0) {
						this.keysInInventory--; // one less key
						this.updateKeyReadout();
						worldGrid[walkIntoTileIndex] = TILE_GROUND;
					} else {
						isMoving = false;
						this.x = previousX;
						this.y = previousY;
					}
					break;
				case TILE_KEY:
					this.keysInInventory++; // one more key
					this.updateKeyReadout();
					worldGrid[walkIntoTileIndex] = TILE_GROUND;
					break;
				case TILE_WALL:
					isMoving = false;
					this.x = previousX;
					this.y = previousY;
				default:
					break;
			}
		}



		chooseWarriorAnimation();

		previousX = this.x;
		previousY = this.y;

		wasMoving = isMoving;
		wasFacing = isFacing;

		sprite.update();
	}

	this.draw = function() {
		sprite.draw(this.x, this.y - 32); // - 64 to adjust for sprite height, collision aligned with feet
		canvasContext.strokeStyle = 'yellow';
		//canvasContext.strokeRect(collider[0].x, collider[0].y, colliderOffset*2, colliderOffset*2);
		for (i = 0; i < collider.length; i++) {
			canvasContext.fillRect(collider[i].x, collider[i].y,1,1);
		}
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
