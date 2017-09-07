const FLOOR_ROOMS_COLS = 2;
const FLOOR_ROOMS_ROWS = 2;

var currentRoomCol = 0, currentRoomRow = 0;

function roomCoordToIndex()
{
	return window["room"+currentRoomCol + "" + String.fromCharCode(97+currentRoomRow)];
}



function Room(roomLayout) {
	this.originalLayout = roomLayout.slice();
	this.layout = this.originalLayout.slice();
	this.loaded = true;
	this.enemyList = [];
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.spawnMyEnemies();
		console.log(this.layout);
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
						y = eachRow * WORLD_H + WORLD_H/2 + offsetY; //monsters are currently tall to put next to walls
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
	this.roomChange = function () {
		if (this.loaded == true && player.x < 0){
		currentRoomCol--
		roomCoordToIndex();
		player.x += canvas.width;
		this.loaded = false;
		}
		else if (this.loaded == true && player.x > canvas.width){
			currentRoomCol++
			player.x -= canvas.width;
			this.loaded = false;
		}
	}	
};


var room1a = new Room([
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
	1, 0, 4, 6, 0, 0, 1, 0, 2, 0, 1, 0, 1, 4, 4, 1,
	1, 0, 4, 0, 0, 0, 1, 0, 4, 0, 1, 5, 1, 5, 1, 1,
	1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0, 1, 1,
	1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 5, 0, 5, 0, 5, 0, 6, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1]);

var room0a = new Room([
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 4, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
	1, 0, 4, 6, 0, 0, 1, 0, 6, 0, 1, 0, 1, 4, 4, 1,
	1, 0, 0, 0, 0, 0, 1, 4, 4, 0, 1, 5, 1, 5, 1, 1,
	1, 1, 1, 5, 1, 1, 1, 4, 4, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 4, 0, 1, 1,
	1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0, 0,
	1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 5, 0, 5, 0, 5, 6, 3, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 3, 6, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] );

var allRooms = [room0a, room1a];
var currentRoom = null;

function resetAllRooms(){
	for(var i = 0; i< allRooms.length; i++){
		allRooms[i].reset();
	}
	loadLevel(allRooms[0]);
}
var currentRoomIndex = roomCoordToIndex();