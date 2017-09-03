var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;

var bluePlayer = new playerClass();
var testSprite = {};

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

	loadImages();
}

function imageLoadingDoneSoStartGame() {
	setInterval(updateAll, 1000/FRAMES_PER_SECOND);

	setupInput();

	loadLevel(room1f1.layout);

}

function loadLevel(whichLevel) {
	worldGrid = whichLevel.slice();
	bluePlayer.reset("Blue Storm");

	var testSpritePic = sprites.Slime.idleAnimation;
	testSprite = new spriteClass();
	testSprite.setSprite(testSpritePic, 32, 32, 6, 9);
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
	room1f1.roomChange();
	room2f1.roomChange();
}

function moveAll() {
	bluePlayer.move();
	testSprite.update();
	//console.log(bluePlayer.x);
	//console.log(bluePlayer.y);
}

function drawAll() {
	canvasContext.save();
	canvasContext.translate(-camPanX,-camPanY);
	drawWorld();
	bluePlayer.draw();
	testSprite.draw(425, 125);
	canvasContext.restore();
}
