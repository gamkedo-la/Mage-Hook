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
			if(getImgData){
				canvasContext.putImageData(getImgData, player.x -6.5, player.y -13);
				return;
			} else {
			canvasContext.drawImage(spriteSheet,
				frameX, frameY,
				frameWidth, frameHeight,
				leftEdge, topEdge,
				frameWidth, frameHeight);
			}
		}
	}
	var secretCanvas = undefined;
	var tempImg = undefined;
	var getImgData = undefined;
	var hasThrown = undefined;
	//TODO: make it so sprites pool canvas. Rn every sprite gets a canvas
	this.tint = function() {
		if(secretCanvas === undefined){
			secretCanvas = document.createElement('canvas') //untaintteddd 
			document.body.appendChild(secretCanvas);
			secretCanvasContext = secretCanvas.getContext('2d');
		}

		var leftEdge = player.x - frameWidth/2;
		var topEdge = player.y - frameHeight/2;
		secretCanvasContext.drawImage(spriteSheet,
				frameX, frameY,
				frameWidth, frameHeight,
				0, 0,
				frameWidth, frameHeight);
		if(location.protocol.indexOf("http") == -1){
			
			if(!hasThrown){
				hasThrown = "yeah man"
				throw "tinting will throw erros when locally hosted"
			}
			
			return;
		}
		getImgData = secretCanvasContext.getImageData(9,3, 13, 26);
		Imgdata = getImgData.data;
		var color = {r:0, g: 90, b:0};

		for(i = 0; i < Imgdata.length; i += 4) {
			Imgdata[i] = Imgdata[i] + color.r;
			Imgdata[i + 1] = Imgdata[i + 1] + color.g;
			Imgdata[i + 2] = Imgdata[i + 2] + color.b;
			Imgdata[i + 3] = Imgdata[i + 3] + 0;
		}
		secretCanvasContext.clearRect(0, 0, canvas.width, canvas.height);
	}

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
