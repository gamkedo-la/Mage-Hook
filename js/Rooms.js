var currentRoomCol = 1, currentRoomRow = 0;
var lastValidCurrentRoomCol = 1, lastValidCurrentRoomRow = 0;

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
	this.considerRoomChange = function () {
		if (player.x < 0){
			currentRoomCol--;
			loadLevel();
			player.x += canvas.width;
		}
		else if (player.x > canvas.width){
			currentRoomCol++;
			loadLevel();
			player.x -= canvas.width;
		}
		if (player.y < 0){
			currentRoomRow--;
			loadLevel();
			player.x += canvas.height;
		}
		else if (player.y > canvas.height){
			currentRoomRow++;
			loadLevel();
			player.y -= canvas.height;
		}
	}	
};


var room0a = new Room([
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
	1, 0, 4, 6, 0, 0, 1, 0, 0, 0, 1, 0, 1, 4, 4, 1,
	1, 0, 4, 0, 0, 0, 1, 0, 4, 0, 1, 5, 1, 5, 1, 1,
	1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 0, 0, 0, 0,
	1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 5, 0, 5, 0, 5, 0, 6, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1]);

var room1a = new Room([
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 4, 0, 0, 0, 1, 0, 2, 0, 5, 0, 1, 1, 1, 1,
	1, 0, 4, 6, 0, 0, 1, 0, 6, 0, 1, 0, 1, 4, 4, 1,
	1, 0, 0, 0, 0, 0, 1, 4, 4, 0, 1, 5, 1, 5, 1, 1,
	1, 1, 1, 5, 1, 1, 1, 4, 4, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 4, 0, 1, 1,
	0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 1, 1,
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
	currentRoomCol = 1;
	currentRoomRow = 0;
	loadLevel();
}
