var currentRoomCol = 1,currentRoomRow = 1, currentFloor = 1;
var lastValidCurrentRoomCol = 1,lastValidCurrentRoomRow = 1, lastValidCurrentFloor = 1;

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
	this.pathfindingdata = []; // 2d array of ints
	
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.itemOnGround = [];
		this.pathfindingdata = []; // a-star pathfinding grid
		if (!_DEBUG_ENABLE_TILE_EDITOR) {
			this.spawnItems();
			this.spawnTraps();
			this.spawnMyEnemies();
			this.generatePathfindingData();
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
				} else if(this.layout[arrayIndex] == TILE_KEY_RARE) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_RARE);
				} else if(this.layout[arrayIndex] == TILE_KEY_EPIC) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_KEY_EPIC);
				} else if(this.layout[arrayIndex] == TILE_CRYSTAL) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_CRYSTAL);
				} else if(this.layout[arrayIndex] == TILE_HEART_CONTAINER) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_HEART_CONTAINER);
				} else if(this.layout[arrayIndex] == TILE_ARTIFACT) {
					console.log("Adding an artifact in room()");
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_ARTIFACT);
				} else if(this.layout[arrayIndex] == TILE_FIREBALL_LVL2) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_FIREBALL_LVL2);
				} else if(this.layout[arrayIndex] == TILE_FIREBALL_LVL3) {
					this.layout[arrayIndex] = TILE_GROUND;
					var x = eachCol * WORLD_W + WORLD_W/2;
					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_FIREBALL_LVL3);
				} // end of place item on tile
			} // end of col for
		} // end of row for
	} //end of spawn items

	this.generatePathfindingData = function() {
		console.log("Generating pathfinding data for the current room...");
		// the a-star pathfinding may not be able to handle
		// world arrays without same width and height?
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(var eachRow=0;eachRow<_rows;eachRow++) {
			this.pathfindingdata[eachRow] = [];
			for(var eachCol=0;eachCol<_cols;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
				this.pathfindingdata[eachRow][eachCol] = this.layout[arrayIndex];
			}
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
		} // end of row for
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
					x = eachCol * WORLD_W + WORLD_W/2 + offsetX;
					y = eachRow * WORLD_H + WORLD_H/2 + offsetY;

					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						 //monsters are currently too tall to put next to walls
						var enemyType = Math.random() * 4;
						if (enemyType > 2 && enemyType < 3){
							nextEnemy = new plantBaby(x, y);
						}else if (enemyType > 1 && enemyType < 2){
							nextEnemy = new slugMonster(x, y);
						} else if (enemyType > 3 && enemyType < 4){
							nextEnemy = new armsBro(x, y)
						} else {
							nextEnemy = new slimeMonster(x, y);
						}
						this.enemyList.push(nextEnemy);
						enemyWasFound = true;
						break;
					} else {
						switch (this.layout[arrayIndex]){
							case TILE_BOSSHERO:
								this.layout[arrayIndex] = TILE_GROUND;
					            nextEnemy = new heroBoss(x, y);
					            this.enemyList.push(nextEnemy);
								enemyWasFound = true;
					            break;
				            case TILE_BOSSPJ:
								this.layout[arrayIndex] = TILE_GROUND;
					            nextEnemy = new PJBoss(x, y);
					            this.enemyList.push(nextEnemy);
								enemyWasFound = true;
					            break;
						}
					}
					
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

		if (player.x < 8) {
			currentRoomCol--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x += (canvas.width-20);
		}
		else if (player.x > canvas.width - 8){
			currentRoomCol++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x -= (canvas.width-20);
		}
		if (player.y < 8){
			currentRoomRow--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y += (canvas.height-20);
		}
		else if (player.y > canvas.height - 8){
			currentRoomRow++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y -= (canvas.height-20);
		}
		
		if (lastValidCurrentFloor != currentFloor) {
			console.log("considerRoomChange just noticed a floor change...")
			if ((currentFloor-lastValidCurrentFloor) == 1) { //Going up
				player.x += 30; //Offset for stairs
			} else if 
				((currentFloor-lastValidCurrentFloor) == -1 &&
				worldGrid[getTileIndexAtPixelCoord(player.x, player.y) - 1] == TILE_STAIRS_DOWN) 
				{ //Going down
				player.x -= 30; //Offset for stairs
			}
			Sound.play("room_change",false,0.1);
			loadLevel();
		}
	}
};

/*
Room layout:
	First floor
	
		0a1		1a1
		
		0b1		1b1

		0c1
	
	Second floor
	
				1b2
*/

var room0a1 =[
	24,19,19,19,37,19,19,19,19,19,19,19,19,19,19,25,
	20,55,00,00,55,08,41,00,00,00,00,00,41,00,00,21,
	20,00,00,06,00,00,41,00,00,00,49,00,41,04,04,21,
	38,00,00,00,00,00,41,00,00,00,41,00,46,14,19,39,
	20,19,19,15,19,19,45,10,10,10,50,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,04,00,00,39,
	20,00,00,00,00,00,00,00,00,06,42,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,00,00,04,00,00,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];
	
var room1a1 =[
	24,19,19,19,37,19,54,19,19,19,19,37,54,19,19,25,
	20,10,00,00,00,00,41,00,00,00,05,00,41,00,00,21,
	38,00,00,06,00,00,41,00,06,00,41,00,41,04,04,21,
	20,00,00,00,00,00,41,00,00,00,41,05,46,05,19,51,
	52,40,40,05,40,40,45,00,00,00,41,00,00,00,00,39,
	20,00,00,00,00,00,00,09,03,00,41,09,04,00,00,21,
	29,00,00,04,00,00,00,00,00,00,41,00,06,00,00,21,
	20,00,00,00,00,00,00,00,00,00,41,00,04,00,00,21,
	22,18,18,18,36,18,18,18,27,18,53,18,18,18,18,23];
	
var room0b1 =[
	24,19,19,19,37,19,19,19,26,25,31,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,21,31,31,31,31,31,31,
	20,00,34,18,18,18,36,18,18,23,31,31,31,31,31,31,
	38,00,21,31,31,31,31,31,24,19,19,37,19,19,19,25,
	20,00,21,31,31,31,31,31,20,00,00,00,00,00,00,28,
	20,00,21,31,31,31,31,31,20,00,34,18,18,18,18,23,
	20,00,32,19,19,19,37,19,33,00,21,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
	22,18,18,18,36,18,18,18,27,18,23,31,31,31,31,31];

	var room1b1 = [
	24,19,19,37,19,19,19,19,26,19,19,19,37,19,19,25,
	20,10,08,00,00,00,00,06,00,00,00,00,00,00,00,21,
	38,00,00,00,00,00,00,04,63,03,09,00,00,00,00,39,
	20,07,06,00,00,00,00,12,00,00,00,00,16,00,00,21,
	29,00,00,00,00,10,00,13,00,00,00,00,17,00,00,39,
	22,18,18,18,35,00,00,00,00,00,10,00,00,00,00,21,
	31,31,31,31,20,00,00,00,00,00,00,00,00,00,08,21,
	31,31,31,31,22,18,35,00,00,00,00,00,00,00,00,21,
	31,31,31,31,31,31,22,18,18,18,18,36,18,18,18,23];

	var ai_test = [ // TEMP simple room with one bot
	24,19,19,37,19,19,19,19,26,19,19,19,37,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,06,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	29,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	22,18,18,18,35,00,00,00,00,00,00,00,00,00,00,21,
	31,31,31,31,20,00,00,00,00,00,00,00,00,00,00,21,
	31,31,31,31,22,18,35,00,00,00,00,00,00,00,00,21,
	31,31,31,31,31,31,22,18,18,18,18,36,18,18,18,23];
		
	var room0c1 = [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,11,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,57,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1b2 = [
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,08,10,00,10,00,00,00,00,00,00,00,00,00,21,
	38,10,00,10,00,10,00,00,00,00,09,00,00,00,00,39,
	20,10,10,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,10,00,10,00,10,00,00,56,00,00,00,30,00,00,39,
	20,10,00,10,00,10,00,00,00,00,10,00,17,00,00,21,
	20,00,00,00,00,00,00,11,61,60,62,00,00,00,08,39,
	38,00,00,00,00,00,00,00,11,00,00,00,00,59,58,21,
	22,18,18,36,18,18,36,18,18,36,18,18,36,18,18,23];

var room1b3 = [
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,10,08,10,00,10,00,00,00,00,00,00,00,00,00,21,
	38,10,00,10,00,10,00,00,00,00,09,00,00,00,00,39,
	20,10,00,10,00,10,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,56,00,00,00,00,00,00,39,
	20,10,00,10,00,10,00,00,00,00,10,00,30,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,08,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,36,18,18,36,18,18,36,18,18,23];

var allRooms = [room0a1,room0b1, room0c1, room1a1, room1b1, room1b2, room1b3];
var roomCols = 3; //maximum col of rooms
var roomRows = 3; // maximum row of rooms
var roomFloors = 4; // maximum floor of rooms
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
	console.log("room reset");
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
	loadLevel();
}
