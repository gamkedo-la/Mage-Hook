var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const TIME_PER_TICK = 1/FRAMES_PER_SECOND;

var player = new playerClass();
var hud = new hudClass();
var particleList = [];

var obstacle = 0;

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
	createTileArray();
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
}

function raycastingForPlayer() {
	var nextTileX = player.x;
	var nextTileY = player.y;
	var isGround = true;
	while (isGround) {
		if (player.facingDirection() == NORTH) {
			nextTileY -= 20; 
		} else if (player.facingDirection() == SOUTH) {
			nextTileY += 20;	
		} else if (player.facingDirection() == EAST) {
			nextTileX += 20;	
		} else if (player.facingDirection()  == WEST) {
			nextTileX -= 20;	
		}
		tileIndex = getTileIndexAtPixelCoord(nextTileX, nextTileY);
		if (worldGrid[tileIndex] != TILE_GROUND) {
			return tileIndex;
			break; // FIXME: this never fires
		}
	}
}