var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;

var player = new playerClass();
var hud = new hudClass();
var particleList = [];

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
	//updateMousePos();
	loadLevel();
	resetAllRooms();
}

function loadLevel() {
	var nextRoom = roomCoordToVar();
	if(nextRoom==undefined) {
		console.log("NO SUCH ROOM IS DEFINED, undoing room change");
		currentRoomCol = lastValidCurrentRoomCol;
		currentRoomRow = lastValidCurrentRoomRow;
		currentFloor = lastValidCurrentFloor;
		return;
	}
	lastValidCurrentRoomCol = currentRoomCol;
	lastValidCurrentRoomRow = currentRoomRow;
	lastValidCurrentFloor = currentFloor;
	currentRoom = nextRoom;
	worldGrid = currentRoom.layout;
	player.reset("Blue Storm");
	hud.load();
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
	updateMousePos();
	updateScreenshake();
	currentRoom.considerRoomChange();
}

function moveAll() {
	player.move();
	currentRoom.moveMyEnemies();
	currentRoom.moveMagic();
	updateItems();
	updateParticles();
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	canvasContext.save();
	//canvasContext.translate(-camPanX,-camPanY); //currently causing visual bugs
	drawWorld();
	drawItems();
	currentRoom.drawMyEnemies();
	currentRoom.drawMagic();
	player.draw();
	drawParticles();
	hud.draw();
	canvasContext.restore();
}
