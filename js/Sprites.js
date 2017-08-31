// NOTE(Cipherpunk): sprite class for animations (open to suggestions on improving this!)
function spriteClass(img, width, height, numberOfFrames) {
	// public variables so that you can change sprites associated with player, enemies etc.
	this.img = img;
	this.width = width;
	this.height = height;
	this.numberOfFrames = numberOfFrames;

	var frameX = 0;
	var frameY = 0;
	var frameIndex = 0;

	var currentTick = 0;
	var timePerFrame = 1/SPRITE_FRAMES_PER_SECOND;
	var timePerTick = 1/FRAMES_PER_SECOND;

	this.draw = function(canvasX, canvasY) {
		// this version of drawImage is needed to point to different frames in sprite sheet
		canvasContext.drawImage(this.img,
								frameX, frameY, this.width, this.height,
								canvasX, canvasY, this.width, this.height);
		this.updateFrame();
	}

	this.updateFrame = function() {
		currentTick += timePerTick;

		if(currentTick >= timePerFrame) {
			currentTick -= timePerFrame;
			frameIndex++;

			if (frameIndex >= this.numberOfFrames) {
				frameIndex = 0;
			}

			frameX = frameIndex * this.width;
		}
	}
}
