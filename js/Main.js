var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;

var player = new playerClass();
var enemy = {}
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
	enemy = new Enemy();

	loadLevel(room1f1.layout);

}

function loadLevel(whichLevel) {
	worldGrid = whichLevel;
	player.reset("Blue Storm");
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
	room1f1.roomChange();
	room2f1.roomChange();
}

function moveAll() {
	player.move();
	enemy.update();
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	canvasContext.save();
	canvasContext.translate(-camPanX,-camPanY);
	drawWorld();
	enemy.draw(425, 125);
	player.draw();
	canvasContext.restore();
}
