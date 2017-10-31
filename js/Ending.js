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