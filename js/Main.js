var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;

var player = new playerClass();
var hud = new hudClass();

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
	resetAllRooms();
	loadLevel(room1f1);

}

function loadLevel(whichLevel) {
	currentRoom = whichLevel;
	worldGrid = currentRoom.layout;
	player.reset("Blue Storm");
	hud.load();
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
	roomChangeAll();
}

function moveAll() {
	player.move();
	currentRoom.moveMyEnemies();
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	canvasContext.save();
	//canvasContext.translate(-camPanX,-camPanY); //currently causing visual bugs
	drawWorld();
	currentRoom.drawMyEnemies();
	player.draw();
	hud.draw();
	canvasContext.restore();
}
