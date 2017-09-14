const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_9 = 57;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_R = 82;
const KEY_B = 66;
const KEY_C = 67;
const KEY_Q = 81;

const KEY_SPACE = 32;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown',editTileOnMouseClick);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	player.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

function keySet(keyEvent, setTo) {
	var validGameKey = true;
	if(keyEvent.keyCode == player.controlKeyLeft) {
		player.keyHeld_West = setTo;
	}else if(keyEvent.keyCode == player.controlKeyRight) {
		player.keyHeld_East = setTo;
	}else if(keyEvent.keyCode == player.controlKeyUp) {
		player.keyHeld_North = setTo;
	}else if(keyEvent.keyCode == player.controlKeyDown) {
		player.keyHeld_South = setTo;
	}else if(keyEvent.keyCode == player.controlKeyAttack) {
		player.keyHeld_Attack = setTo;
	} else {
		validGameKey = false;
	}
	return validGameKey;
}

function keyPressed(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	var validKey = keySet(evt, true);

	var otherKeyPressed = true;
	switch(evt.keyCode) {
		case KEY_9:
			copyToClipboard();
			break;
		case KEY_R:
			resetAllRooms();
			break;
		case KEY_B:
			_DEBUG_DRAW_HITBOX_COLLIDERS = !_DEBUG_DRAW_HITBOX_COLLIDERS;
			break;
		case KEY_C:
			_DEBUG_DRAW_TILE_COLLIDERS = !_DEBUG_DRAW_TILE_COLLIDERS;
			break;
		case KEY_Q:
			_DEBUG_ENABLE_TILE_EDITOR = !_DEBUG_ENABLE_TILE_EDITOR;
			console.log("Tile Editor is" + " " +_DEBUG_ENABLE_TILE_EDITOR)
			break;
		case KEY_W:
			console.log("Room change North");
			currentRoomRow--;
			loadLevel(roomCoordToVar);
			break;
		case KEY_A:
			console.log("Room change West");
			currentRoomCol--;
			loadLevel(roomCoordToVar);
			break;
		case KEY_S:
			console.log("Room change South");
			currentRoomRow++;
			loadLevel(roomCoordToVar);
			break;
		case KEY_D:
			console.log("Room change East");
			currentRoomCol++;
			loadLevel(roomCoordToVar);
			break;
		default:
			otherKeyPressed=false;
			break;
	}
	if(otherKeyPressed) {
		validKey = true;
	}

	if(validKey){
		evt.preventDefault();
	}
}

function keyReleased(evt) {
	// console.log("Key pressed: "+evt.keyCode);
	keySet(evt, false);
}
