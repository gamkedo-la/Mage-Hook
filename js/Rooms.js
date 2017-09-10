var currentRoomCol = 01,currentRoomRow = 1;
var lastValidCurrentRoomCol = 01,lastValidCurrentRoomRow = 1;

function roomCoordToVar()
{
	var varName = "room"+currentRoomCol + "" + String.fromCharCode(97+currentRoomRow);
	console.log("Loading room from var named "+varName);
	return window[varName];
}

function Room(roomLayout) {
	this.originalLayout = roomLayout.slice();
	this.layout = this.originalLayout.slice();
	this.enemyList = [];
	this.itemOnGround = [];
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.itemOnGround = [];
		this.spawnItems();
		this.spawnMyEnemies();
		console.log(this.layout);
	}

	this.spawnItems = function() {

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(this.layout[arrayIndex] == TILE_KEY) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY);
				} // end of player start if
			} // end of col for
		}
	}

	this.spawnMyEnemies = function(){
		var nextEnemy = null;
		var x, y;
		var offsetX = -3
		var offsetY = -3;
		var enemyWasFound = false;
		do {
			enemyWasFound = false;
			for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						x = eachCol * WORLD_W + WORLD_W/2 + offsetX;
						y = eachRow * WORLD_H + WORLD_H/2 + offsetY; //monsters are currently too tall to put next to walls
						nextEnemy = new enemyClass(x, y);
						this.enemyList.push(nextEnemy);
						enemyWasFound = true;
						break;
					} // end of player start if
				} // end of col for
			}
		} while (enemyWasFound)
	}
	this.drawMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].draw();
		}
	}

	this.moveMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].update();
		}
	}
	this.considerRoomChange = function () {
		if (player.x < 0){
			currentRoomCol--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x += canvas.width;
		}
		else if (player.x > canvas.width){
			currentRoomCol++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x -= canvas.width;
		}
		if (player.y < 0){
			currentRoomRow--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y += canvas.height;
		}
		else if (player.y > canvas.height){
			currentRoomRow++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y -= canvas.height;
		}
	}
};

var room0a = new Room([
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,
	01,00,00,00,00,00,01,00,00,00,05,00,01,01,01,01,
	01,00,04,06,00,00,01,00,00,00,01,00,01,04,04,01,
	01,00,04,00,00,00,01,00,04,00,01,05,01,05,01,01,
	01,01,01,05,01,01,01,00,04,00,01,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,01,00,04,00,00,01,
	01,00,00,00,00,00,00,00,00,06,01,00,00,00,00,00,
	01,00,00,00,00,00,00,00,00,00,01,00,04,00,00,01,
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01,
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01]);

var room1a = new Room([
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,
	01,00,00,00,00,00,01,00,00,00,05,00,01,01,01,01,
	01,10,00,06,10,00,01,00,06,00,01,00,01,04,04,01,
	01,00,00,00,00,00,01,04,04,00,01,05,01,05,01,01,
	01,01,01,05,01,01,01,04,04,00,01,00,00,00,00,01,
	01,00,00,00,00,00,00,00,03,00,01,00,04,00,00,01,
	00,00,00,04,00,00,00,00,00,00,01,00,06,00,00,01,
	01,00,00,00,00,00,00,00,00,00,01,00,04,00,00,01,
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01,
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01]);

var room0b = new Room([
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01,
	01,00,00,00,00,00,04,04,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,04,04,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01]);

var room1b = new Room([
	01,01,01,01,01,01,01,01,00,01,01,01,01,01,01,01,
	01,10,00,00,00,00,04,04,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,04,04,00,00,09,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	00,00,00,00,00,10,00,00,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,10,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,01,
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,
	01,01,01,01,01,01,01,01,01,01,01,01,01,01,01,01]);

var allRooms = [room0a, room1a, room0b, room1b];
var currentRoom = null;

function resetAllRooms(){
	for(var i = 0; i< allRooms.length; i++){
		allRooms[i].reset();
	}
	currentRoomCol = 1;
	currentRoomRow = 1;
	loadLevel();
}
