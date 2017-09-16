var currentRoomCol = 1,currentRoomRow = 1, currentFloor = 1;
var lastValidCurrentRoomCol = 1,lastValidCurrentRoomRow = 1, lastValidCurrentFloor = 1;
var roomName = "room"+currentRoomCol + "" + String.fromCharCode(97+currentRoomRow) + "" + currentFloor;

function roomCoordToVar()
{
	roomName = roomCoordToString(currentRoomCol, currentRoomRow, currentFloor);
	console.log("Loading room from var named "+roomName);
	return allRoomsData[roomName];
}

function roomCoordToString(c, r,f) {
	return "room"+c + "" + String.fromCharCode(97+r) + "" + f;
}

function Room(roomLayout) {
	this.originalLayout = roomLayout.slice();
	this.layout = this.originalLayout.slice();
	this.enemyList = [];
	this.magic = [];
	this.itemOnGround = [];
	this.floorTraps = [];
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.itemOnGround = [];
		if (!_DEBUG_ENABLE_TILE_EDITOR) {
			this.spawnItems();
			this.spawnTraps();
			this.spawnMyEnemies();
		}
	}

	this.spawnItems = function() {

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(this.layout[arrayIndex] == TILE_KEY_COMMON) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_COMMON);
				} // end of player start if
			} // end of col for
		}
	}

	this.spawnTraps = function() {
		var nextTrap = null;
		var x, y;

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				if(this.layout[arrayIndex] == TILE_TRAP) {
					x = eachCol * WORLD_W + WORLD_W/2;
					y = eachRow * WORLD_H + WORLD_H/2; //monsters are currently too tall to put next to walls
					trapWasFound = true;
					nextTrap = new trap(x, y);
					this.floorTraps.push(nextTrap);
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
						var enemyType = Math.random() * 3;
						if (enemyType > 1 && enemyType < 2){
							nextEnemy = new slugMonster(x, y);
						} else if (enemyType > 2 && enemyType < 3){
							nextEnemy = new armsBro(x, y)
						} else {
							nextEnemy = new slimeMonster(x, y);
						}
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

	this.drawMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].draw();
		}
	}

	this.drawTraps = function() {
		for (var i = 0; i < this.floorTraps.length; i++) {
			var trap = this.floorTraps[i];
			trap.update();
			trap.draw();
		}
	}

	this.drawDynamic = function() {
		var objects = [];
		for(var i = 0; i<this.enemyList.length; i++){
			objects.push({"y":this.enemyList[i].y , "object": this.enemyList[i]});
		}
		for(var i = 0; i<this.magic.length; i++){
			objects.push({"y":this.magic[i].y , "object": this.magic[i]});
		}
		objects.push({"y":player.y, "object": player});

		objects.sort(function(a, b) {
			return a.y-b.y;
		});

		for(var i = 0; i<objects.length; i++){
			objects[i].object.draw();
		}
	}

	this.moveMyEnemies = function(){
		for(var i = 0; i<this.enemyList.length; i++){
			this.enemyList[i].update();
		}
	}

	this.moveMagic = function(){
		for(var i = 0; i<this.magic.length; i++){
			this.magic[i].update();
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
		if (lastValidCurrentFloor != currentFloor) {
			if ((currentFloor-lastValidCurrentFloor) == 1) { //Going up
				player.x += 30; //Offset for stairs
			}
			else if ((currentFloor-lastValidCurrentFloor) == -1) { //Going down
				player.x -= 30; //Offset for stairs
			}
			Sound.play("room_change",false,0.1);
			loadLevel();
		}
	}
};

var room0a1 =[
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,08,01,00,00,00,05,00,01,01,01,21,
	20,00,00,06,00,00,01,00,00,00,01,00,01,04,04,21,
	20,00,00,00,00,00,01,00,00,00,01,05,01,14,01,21,
	20,01,01,15,01,01,01,10,10,10,01,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	20,00,00,00,00,00,00,00,00,06,01,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23];

var room1a1 =[
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,00,00,00,00,01,00,00,00,05,00,01,01,01,21,
	20,00,00,06,00,00,01,00,06,00,01,00,01,04,04,21,
	20,00,00,00,00,00,01,00,00,00,01,05,01,05,01,21,
	20,01,01,05,01,01,01,00,00,00,01,00,00,00,00,21,
	20,00,00,00,00,00,00,09,03,00,01,09,04,00,00,21,
	29,00,00,04,00,00,00,00,00,00,01,00,06,00,00,21,
	20,00,00,00,00,00,00,00,00,00,01,00,04,00,00,21,
	22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23];

var room0b1 =[
	24,19,19,19,19,19,19,19,26,25,31,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,21,31,31,31,31,31,31,
	20,00,34,18,18,18,18,18,18,23,31,31,31,31,31,31,
	20,00,21,31,31,31,31,31,24,19,19,19,19,19,19,25,
	20,00,21,31,31,31,31,31,20,00,00,00,00,00,00,28,
	20,00,21,31,31,31,31,31,20,00,34,18,18,18,18,23,
	20,00,32,19,19,19,19,19,33,00,21,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
	22,18,18,18,18,18,18,18,27,18,23,31,31,31,31,31];

var room1b1 = [
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,
	20,10,08,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,03,09,00,00,00,00,21,
	20,07,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	29,00,00,00,00,10,00,00,00,00,00,00,17,00,00,21,
	22,18,18,18,35,00,00,00,00,00,10,00,00,00,00,21,
	31,31,31,31,20,00,00,00,00,00,00,00,00,00,08,21,
	31,31,31,31,22,18,35,00,00,00,00,00,00,00,00,21,
	31,31,31,31,31,31,22,18,18,18,18,18,18,18,18,23];

var room0c1 = [
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,11,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23];

var room1b2 = [
	24,19,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,08,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,10,00,10,00,10,00,00,00,00,09,00,00,00,00,21,
	20,10,10,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,10,00,10,00,10,00,00,00,00,00,00,30,00,00,21,
	20,10,00,10,00,10,00,00,00,00,10,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,08,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23];

var allRooms = [room0a1, room1a1, room0b1, room1b1, room0c1, room1b2];
var roomCols = 3; //maximum col of rooms
var roomRows = 3; // maximum row of rooms
var roomFloors = 3; // maximum floor of rooms
var allRoomsData = {};
var allRoomsBackup = [];
var currentRoom = null;

function backupRoomData () {
	console.log("calling backupRoomData")
	allRoomsBackup = JSON.parse(JSON.stringify(allRooms));
}

function restoreRoomDataBackup() {
	console.log("calling restoreRoomDataBackup")
	allRooms = JSON.parse(JSON.stringify(allRoomsBackup));
	resetAllRooms();
	console.log("room reset")
}

function resetAllRooms(){
	allRoomsData = {};
	for (var c = 0; c<roomCols; c++) {
		for ( var r =0; r<roomRows; r++) {
			for (var f=0; f<roomFloors; f++) {
				var eachRoom = roomCoordToString(c,r,f);
				if (window[eachRoom] != undefined) {
					console.log("room found");
					var tempRoom = new Room (window[eachRoom]);
					tempRoom.reset();
					allRoomsData[eachRoom] = tempRoom;
				}
			}
		}
	}
	currentRoomCol = 1;
	currentRoomRow = 1;
	currentFloor = 1;
	loadLevel();
}
