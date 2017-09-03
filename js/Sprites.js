// class for animations
function spriteClass() {
	var spriteSheet;
	var frameX;
	var frameY;
	var frameWidth;
	var frameHeight;
	var frameTotal;
	var frameIndex;

	var currentTime;
	var timePerFrame
	var timePerTick = 1/FRAMES_PER_SECOND;

	// set sprite sheet to draw from and defines animation speed
	this.setSprite = function(newSpriteSheet,
						newWidth, newHeight,
						newTotal, newSpeed) {

		spriteSheet = newSpriteSheet;
		frameX = 0;
		frameY = 0;
		frameWidth = newWidth;
		frameHeight = newHeight;
		frameTotal = newTotal;
		if (newSpeed > 0) {
			timePerFrame = 1/newSpeed;
		} else {
			timePerFrame = 0;
		}
		this.reset();
	}

	// sets a still frame from a sprite sheet, index goes left to right, top to bottom
	this.setFrame = function(index) {
		result = calculateFrameIndex(index);
		frameX = result.x;
		frameY = result.y;
		frameIndex = index % frameTotal;
		timePerFrame = 0;
	}

	this.getFrame = function() {
		return frameIndex;
	}

	this.reset = function() {
		currentTime = 0;
		frameIndex = 0;
		frameX = 0;
		frameY = 0;
	}

	// draws current sprite frame
	this.draw = function(x, y) {
		var leftEdge = x - frameWidth/2;
		var topEdge = y - frameHeight/2;

		// this version of drawImage is needed to point to different frames in sprite sheet
		canvasContext.drawImage(spriteSheet,
								frameX, frameY,
								frameWidth, frameHeight,
								leftEdge, topEdge,
								frameWidth, frameHeight);
	}

	// cycles through sprite animations
	this.update = function() {
		if (frameTotal > 0 && timePerFrame > 0) {
			currentTime += timePerTick;

			if (currentTime >= timePerFrame) {
				currentTime -= timePerFrame;
				frameIndex++;
				if (frameIndex >= frameTotal) {
					this.reset();
					return;
				}

				frameX += frameWidth;

				if (frameX >= spriteSheet.width) {
					frameX = 0;
					frameY += frameHeight;

					if (frameY >= spriteSheet.height) {
						frameY = 0;
						frameIndex = 0;
					}
				}
			}
		}
	}

	// helper function for setting still frames
	function calculateFrameIndex(index) {
		var posX = (index * frameWidth) % spriteSheet.width;
		var posY = (Math.floor(index / (spriteSheet.width / frameWidth)) * frameHeight) % spriteSheet.height;
		return {
			x: posX,
			y: posY
		}
	}
}
