var currentRoomCol = 2,currentRoomRow = 5, currentFloor = 1;
var lastValidCurrentRoomCol = 2,lastValidCurrentRoomRow = 5, lastValidCurrentFloor = 1;

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
	this.tempPathFindingData = []; // copy of 2d array of ints. 
	
	this.reset = function(){
		this.layout = this.originalLayout.slice();
		this.enemyList = [];
		this.itemOnGround = [];
		this.pathfindingdata = []; // a-star pathfinding grid
		this.tempPathFindingData = []; //a-star pathfinding grid with dynamic things like the player
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
			this.tempPathFindingData[eachRow] = [];
			for(var eachCol=0;eachCol<_cols;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);				
				this.pathfindingdata[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
				this.tempPathFindingData[eachRow][eachCol] =canWalk(this.layout[arrayIndex])
			}
		}
	}

	this.updatePathfindingData = function(){
		if(_DEBUG_ENABLE_TILE_EDITOR){
			return;
		}
		var _rows = Math.max(WORLD_ROWS,WORLD_COLS);
		var _cols = Math.max(WORLD_ROWS,WORLD_COLS);
		for(var eachRow=0;eachRow<_rows;eachRow++) {			
			for(var eachCol=0;eachCol<_cols;eachCol++) {
				this.tempPathFindingData[eachRow][eachCol] = this.pathfindingdata[eachRow][eachCol]
			}
		}
		//Todo: add enemies to path data? 
		//TODO: should room.js know about player.js? 
		var playertile = getTileIndexAtPixelCoord(player.x, player.y);
		var playerrowcol = ArrayIndexToRowCol(playertile);
		this.tempPathFindingData[playerrowcol[0]][playerrowcol[1]] = 89
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
			player.x += (canvas.width-40);
		}
		else if (player.x > canvas.width - 8){
			currentRoomCol++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.x -= (canvas.width-40);
		}
		if (player.y < 8){
			currentRoomRow--;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y += (canvas.height-40);
		}
		else if (player.y > canvas.height - 8){
			currentRoomRow++;
			Sound.play("room_change",false,0.05);
			loadLevel();
			player.y -= (canvas.height-40);
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


var room0a1= [
	24,19,19,19,37,19,19,19,19,19,19,37,19,19,19,25,
	20,10,31,31,31,31,00,00,00,00,00,00,00,00,00,21,
	38,00,31,31,31,31,00,17,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,03,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,31,31,31,31,31,21,
	20,00,00,00,00,00,00,00,00,00,31,31,31,31,31,21,
	22,18,18,18,36,18,18,18,18,18,18,18,18,18,18,23];

var room1a1= [
	24,19,19,19,37,19,19,19,19,19,19,37,19,19,19,25,
	20,10,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,17,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,03,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,18,18,18,18,27,18,18,23];

var room2a1= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,17,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,27,18,18,18,18,18,18,23];

var room3a1= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,17,00,00,00,00,00,00,21,
	20,00,00,00,06,00,00,00,00,00,00,00,06,00,00,39,
	20,00,00,06,00,00,00,00,00,00,00,00,00,06,00,21,
	20,00,00,00,06,00,00,00,00,00,00,00,06,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,27,18,18,18,18,18,18,23];

var room4a1= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,17,00,00,00,00,00,00,21,
	20,00,00,06,00,00,00,00,00,00,00,00,06,00,00,39,
	20,06,00,00,00,00,00,00,00,00,00,00,00,00,06,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,06,00,00,00,00,00,00,00,00,06,00,00,21,
	22,18,18,36,18,18,18,18,27,18,18,18,18,18,18,23];

var room0b1= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,17,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,58,00,00,00,00,00,00,00,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,36,18,18,18,18,18,18,23];


// var room0b1 =[
// 	24,19,19,19,37,19,19,19,26,25,31,31,31,31,31,31,
// 	20,00,00,00,00,00,00,00,00,21,31,31,31,31,31,31,
// 	20,00,34,18,18,18,36,18,18,23,31,31,31,31,31,31,
// 	38,00,21,31,31,31,31,31,24,19,19,37,19,19,19,25,
// 	20,00,21,31,31,31,31,31,20,00,00,00,00,00,00,28,
// 	20,00,21,31,31,31,31,31,20,00,34,18,18,18,18,23,
// 	20,00,32,19,19,19,37,19,33,00,21,31,31,31,31,31,
// 	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
// 	22,18,18,18,36,18,18,18,27,18,23,31,31,31,31,31];

var room1b1= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,19,19,19,25,
	20,00,00,00,00,41,00,00,00,00,00,14,00,00,00,21,
	20,00,00,00,00,41,00,00,00,00,00,52,40,40,40,51,
	38,00,00,00,00,41,00,00,00,00,00,05,00,00,00,21,
	29,00,00,00,00,41,00,00,00,00,00,52,40,40,40,51,
	20,00,00,00,00,41,00,00,00,00,00,05,00,00,00,21,
	20,00,00,00,00,41,00,00,00,00,00,52,40,40,40,51,
	20,00,00,00,00,41,00,00,00,00,00,05,00,00,00,21,
	22,18,18,36,18,18,18,18,27,18,18,18,18,18,18,23];

	//pathfinding testing
	// var room1b1 = [
	// 24,19,19,37,19,19,19,19,26,19,19,19,37,19,19,25,
	// 20,10,08,00,00,00,00,06,00,00,00,00,00,00,00,21,
	// 38,00,00,00,00,00,00,04,00,03,00,00,00,00,00,39,
	// 20,07,00,00,00,00,00,12,00,00,00,00,16,00,00,21,
	// 29,00,00,00,00,10,00,13,00,00,00,00,17,00,00,39,
	// 22,18,18,18,35,00,00,00,00,00,10,00,00,00,00,21,
	// 31,31,31,31,20,00,00,00,00,00,00,00,00,00,08,21,
	// 31,31,31,31,22,18,35,00,00,00,00,00,00,00,00,21,
	// 31,31,31,31,31,31,22,18,18,18,18,36,18,18,18,23];
var room2b1= [ 
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,57,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,27,18,18,18,18,18,18,23];

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
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
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
	20,00,00,00,00,00,00,00,61,60,62,00,00,00,08,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,59,58,21,
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


var room3b1= [31, 31, 31, 31, 31, 24, 19, 19, 26, 19, 19, 25, 31, 31, 31, 31, 31, 31, 31, 31, 24, 33, 0, 0, 0, 0, 0, 21, 31, 31, 31, 31, 31, 31, 31, 31, 20, 0, 0, 0, 12, 0, 0, 21, 31, 31, 31, 31, 31, 31, 31, 31, 22, 35, 0, 0, 0, 0, 0, 21, 31, 31, 31, 31, 31, 31, 31, 31, 31, 22, 18, 18, 18, 18, 18, 23, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31]


var room1c1= [31, 31, 24, 19, 19, 19, 19, 19, 26, 19, 19, 19, 19, 19, 19, 25, 31, 31, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 31, 31, 20, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 21, 31, 31, 20, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 21, 31, 31, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 31, 31, 20, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 21, 31, 31, 20, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 21, 31, 31, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 31, 31, 22, 18, 18, 18, 18, 18, 27, 18, 18, 18, 18, 18, 18, 23];

var room2c1= [ 
	24,19,19,19,19,19,19,19,15,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	29,00,00,00,00,00,00,00,00,00,00,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room3c1= [24, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 29, 6, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 6, 21, 20, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 20, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 27, 18, 18, 18, 18, 18, 18, 23];

var room0d1= [ 
	24,19,19,19,19,19,19,19,19,19,25,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
	20,00,06,00,00,00,00,00,00,00,21,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,00,46,19,19,19,19,25,
	20,00,17,00,00,00,00,00,00,00,00,00,00,00,00,28,
	20,00,00,00,00,00,00,00,00,00,44,18,18,18,18,23,
	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
	20,00,00,00,00,00,00,00,00,00,21,31,31,31,31,31,
	22,18,18,18,18,18,18,18,18,18,23,31,31,31,31,31];

var room1d1 = [24, 19, 19, 19, 19, 19, 19, 19, 26, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 6, 6, 0, 0, 0, 0, 6, 6, 0, 0, 0, 21, 20, 6, 0, 6, 6, 6, 0, 0, 0, 0, 6, 6, 6, 0, 6, 21, 20, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 22, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 23]
var room2d1= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3d1= [24, 19, 19, 19, 19, 19, 19, 19, 26, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6, 0, 0, 0, 0, 21, 20, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 21, 20, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 27, 18, 18, 18, 18, 18, 18, 23];

var room0e1= [24, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 4, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 23];

var room1e1= [24, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 29, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 28, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 27, 18, 18, 18, 18, 18, 18, 23];

var room2e1= [24, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 29, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 28, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 27, 18, 18, 18, 18, 18, 18, 23];

var room3e1= [24, 19, 19, 19, 19, 19, 19, 19, 26, 19, 19, 19, 19, 19, 19, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 6, 21, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 21, 20, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 21, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 22, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 23];

var room0f1= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1f1= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2f1= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,06,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3f1= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1a2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2a2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3a2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room0b2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2b2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3b2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room0c2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1c2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2c2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3c2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room0d2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1d2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2d2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3d2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room0e2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1e2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2e2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3e2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room0f2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1f2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room2f2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room3f2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];


var allRooms = [
	room0a1, room1a1, room2a1, room3a1, room4a1,
	room0b1, room1b1, room2b1, room3b1,
	room0c1, room1c1, room2c1, room3c1, 
	room0d1, room1d1, room2d1, room3d1, 
	room0e1, room1e1, room2e1, room3e1, 
	room0f1, room1f1, room2f1, room3f1, 

	         room1a2, room2a2, room3a2, 
	room0b2, room1b2, room2b2, room3b2,
	room0c2, room1c2, room2c2, room3c2,
	room0d2, room1d2, room2d2, room3d2,
	room0e2, room1e2, room2e2, room3e2,
	room0f2, room1f2, room2f2, room3f2,

	 room1b3];
var roomCols = 4; //maximum col of rooms
var roomRows = 6; // maximum row of rooms
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
