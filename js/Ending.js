var endScreen
function ending(){
	paused = true;
	endScreen = new spriteClass();
	endScreen.setSprite(sprites.Ending.tempEndScreen,
						  320, 180,
						  1, 1, true);
	setInterval(drawEnding, 1000/FRAMES_PER_SECOND);
}

function drawEnding(){
	endScreen.draw(160,90);
}


var splashScreen
var splashInterval
function splash(){
	paused = true;
	splashScreen = new spriteClass();
	splashScreen.setSprite(sprites.OPENING.tempOpening,
						  320, 180,
						  1, 1, true);
	splashInterval = setInterval(drawSplash, 1000/FRAMES_PER_SECOND);
	document.addEventListener('keydown', startEmUP);
}
function startEmUP(){
		clearInterval(splashInterval)
		paused = false;
		runThatGame();
		document.removeEventListener('keydown',
	        startEmUP,
	        false
	    );
	
}
function drawSplash(){
	splashScreen.draw(160,90);
	console.log("draw")
}