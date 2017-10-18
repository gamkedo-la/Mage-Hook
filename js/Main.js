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
	backupRoomData(); // should do before any numbers are replaced and load level etc.
	loadLevel();
	resetAllRooms();
	createTileArrayWithoutBox();
}

function loadLevel() {
	console.log("loading level");
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
	if (!noDamageForFloor[currentFloor - 1]) {
		removeAllItemsOfTypeInRoom(ITEM_ARTIFACT); 
	}
	player.reset("Untitled Player");
	hud.load();
}

function updateAll() {
	moveAll();
	drawAll();
	if (_DEBUG_ENABLE_TILE_EDITOR == true) {
    roomTileCoordinate();
  	}
	updateScreenshake();
	currentRoom.considerRoomChange();
}

function moveAll() {
	player.move();
	player.poisoned();
	currentRoom.moveMyEnemies();
	currentRoom.moveMagic();
	updateItems();
	updateParticles();
	updatePanel(debugPanel);
	//console.log(player.x);
	//console.log(player.y);
}

function drawAll() {
	drawWorld();
	currentRoom.drawTraps();
	drawItems();
	currentRoom.drawDynamic();
	drawParticles();
	hud.draw();
	drawPanelWithButtons(debugPanel);
	raycasting();
}

function raycasting() {
	if(mouseHeld && !_DEBUG_ENABLE_TILE_EDITOR) {
		var point1X = player.x;
		var point1Y = player.y;
		var point2X = mouseCanvasX;
		var point2Y = mouseCanvasY;
		//var roomCol = Math.floor(WORLD_COLS * mouseX / canvas.offsetWidth);
  		//var roomRow = Math.floor(WORLD_ROWS * mouseY / canvas.offsetHeight);
		var tileX = mouseCanvasX;
   		var tileY = mouseCanvasY;
		var tileIndex = getTileIndexAtPixelCoord(mouseCanvasX, mouseCanvasY);
		if (allButBox.indexOf(worldGrid[tileIndex]) > -1) {
			console.log(mouseCanvasX, mouseCanvasY);
   		} else if (worldGrid[tileIndex] == TILE_BOX) {
   			var tileCenter = calculateCenterCoordOfTileIndex(tileIndex);
   			point2X = tileCenter.x;
   			point2Y = tileCenter.y;
   			console.log(tileCenter.x,tileCenter.y);
   		}
   		canvasContext.lineWidth = 2;
		colorLine(point1X, point1Y, point2X, point2Y, 'magenta');
	}
}





