const USE_DOUBLE_TAP_DASH = false; // still work in progress: a bit buggy
const DOUBLE_TAP_TIMESPAN = 250; // time in ms between consecutive move presses for DASH
var keyTime = []; // used for double tap detection
keyTime[NORTH] = keyTime[SOUTH] = keyTime[EAST] = keyTime[WEST] = 0; // avoid undefined

const KEY_LEFT_ARROW = 37;
const KEY_UP_ARROW = 38;
const KEY_RIGHT_ARROW = 39;
const KEY_DOWN_ARROW = 40;

const KEY_9 = 57;
const KEY_PLUS = 187;
const KEY_MINUS = 189;
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_R = 82;
const KEY_B = 66;
const KEY_C = 67;
const KEY_Q = 81;
const KEY_Z = 90; // dash

const KEY_SPACE = 32;

var mouseX = 0;
var mouseY = 0;

function setupInput() {
	canvas.addEventListener('mousemove', updateMousePos);
	canvas.addEventListener('mousedown',editTileOnMouseClick);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	player.setupInput(KEY_UP_ARROW, KEY_RIGHT_ARROW, KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_SPACE, KEY_Z);
}

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

// Note, due to browser silliness, keydown events fire repeatedly while keys are held, 
// but keyup fires once as expected, no matter how long you held the key down.
// So we detect in UP event: you dash if you release the movement key twice fast.
function checkDoubleTap(NSEW)
{
	if (!USE_DOUBLE_TAP_DASH) return;
	var now = performance.now();
	var timespan = now - keyTime[NSEW];
	if (timespan < DOUBLE_TAP_TIMESPAN)
	{
		console.log('DOUBLE TAPPED DIR '+NSEW+' in ' + timespan + 'ms');
		player.dashPending[NSEW] = true; // pending
	}
	keyTime[NSEW] = now;
	// reset others
	if (NSEW!=NORTH) keyTime[NORTH] = 0;
	if (NSEW!=SOUTH) keyTime[SOUTH] = 0;
	if (NSEW!=EAST) keyTime[EAST] = 0;
	if (NSEW!=WEST) keyTime[WEST] = 0;
}

function keySet(keyEvent, setTo) {
	var validGameKey = true;
	if(keyEvent.keyCode == player.controlKeyDash) {
		player.keyHeld_Dash = setTo;
	}else if(keyEvent.keyCode == player.controlKeyLeft) {
		if (!setTo) checkDoubleTap(WEST);
		player.keyHeld_West = setTo;
	}else if(keyEvent.keyCode == player.controlKeyRight) {
		if (!setTo) checkDoubleTap(EAST);
		player.keyHeld_East = setTo;
	}else if(keyEvent.keyCode == player.controlKeyUp) {
		if (!setTo) checkDoubleTap(NORTH);
		player.keyHeld_North = setTo;
	}else if(keyEvent.keyCode == player.controlKeyDown) {
		if (!setTo) checkDoubleTap(SOUTH);
		player.keyHeld_South = setTo;
	}else if(keyEvent.keyCode == player.controlKeyAttack) {
		if (!setTo) checkDoubleTap(ATTACK);
		player.keyHeld_Attack = setTo;
	} else {
		validGameKey = false;
	}
	return validGameKey;
}

function keyPressed(evt) {
	//console.log("Key pressed: "+evt.keyCode);
	var validKey = keySet(evt, true);

	var otherKeyPressed = true;
	switch(evt.keyCode) {
		case KEY_9:
			copyToClipboard();
			break;
		case KEY_PLUS:
			editTileOnMouseClick();
			break
		case KEY_MINUS:
			editTileonMouseReverse();
			break
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
			if (_DEBUG_ENABLE_TILE_EDITOR == false) {
				backupRoomData();
			}
			else {
				restoreRoomDataBackup();
				
			}
			console.log("Tile Editor is" + " " +_DEBUG_ENABLE_TILE_EDITOR)
			break;
		case KEY_W:
			//if (_DEBUG_ENABLE_TILE_EDITOR) {
			console.log("Room change North");
			currentRoomRow--;
			loadLevel(roomCoordToVar);
			//}
			break;
		case KEY_A:
			//if (_DEBUG_ENABLE_TILE_EDITOR) {
			console.log("Room change West");
			currentRoomCol--;
			loadLevel(roomCoordToVar);
			//}
			break;
		case KEY_S:
			//if (_DEBUG_ENABLE_TILE_EDITOR) {
			console.log("Room change South");
			currentRoomRow++;
			loadLevel(roomCoordToVar);
			//}
			break;
		case KEY_D:
			//if (_DEBUG_ENABLE_TILE_EDITOR) {
			console.log("Room change East");
			currentRoomCol++;
			loadLevel(roomCoordToVar);
			//}
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
	//console.log("Key released: "+evt.keyCode);
	keySet(evt, false);
}
