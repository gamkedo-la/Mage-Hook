// class for animations
function spriteClass() {
	var spriteSheet;
	var frameX;
	var frameY;
	var frameWidth;
	var frameHeight;
	var frameTotal;
	var frameIndex;
	var loopFrames;
	var drawFrame;
	var currentTime;
	var timePerFrame;

	// set sprite sheet to draw from and defines animation speed
	this.setSprite = function(newSpriteSheet,
						newWidth, newHeight,
						newTotal, newSpeed,
						loop) {

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
		loopFrames = loop;
		drawFrame = true;
		this.reset();
	}

	// sets a still frame from a sprite sheet, index goes left to right, top to bottom
	this.setFrame = function(index) {
		result = calculateFrameIndex(index);
		frameX = result.x;
		frameY = result.y;
		frameIndex = index % frameTotal;
		timePerFrame = 0;
		drawFrame = true;
	}

	this.getSpriteSheet = function (){
		return spriteSheet;
	}
	
	this.getFrame = function() {
		return frameIndex;
	}

	this.isDone = function(){
		return ((frameTotal - frameIndex - 1) == 0);
	}

	this.setSpeed = function (newSpeed) {
		if (newSpeed > 0) {
			timePerFrame = 1/newSpeed;
		} else {
			timePerFrame = 0;
		}
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

		if (drawFrame) {
			// this version of drawImage is needed to point to different frames in sprite sheet
			canvasContext.drawImage(spriteSheet,
				frameX, frameY,
				frameWidth, frameHeight,
				leftEdge, topEdge,
				frameWidth, frameHeight);
		}
	}

	/*this.tint = function() {
	var getImgData = canvasContext.getImageData(player.x,player.y, 32, 32);
	var Imgdata = getImgData.data;
	var color = {r:0, g: 90, b:0};

		for(i = 0; i < Imgdata.length; i += 4) {
			Imgdata[i] = Imgdata[i] + color.r;
			Imgdata[i + 1] = Imgdata[i + 1] + color.g;
			Imgdata[i + 2] = Imgdata[i + 2] + color.b;
		}
	canvasContext.putImageData(getImgData, player.x +16, player.y + 16);
	}*/

	// cycles through sprite animations
	this.update = function() {
		if (frameTotal > 0 && timePerFrame > 0) {
			currentTime += TIME_PER_TICK;

			if (currentTime >= timePerFrame) {
				currentTime -= timePerFrame;

				if (frameIndex+1 >= frameTotal) {
					if (loopFrames) {
						this.reset();
						return;
					} else {
						this.setFrame(frameIndex);
						drawFrame = false;
						return;
					}
				}
				frameIndex++;

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
