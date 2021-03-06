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
			
			if (_TEST_AI_PATHFINDING)
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
				} else if(this.layout[arrayIndex] == TILE_POTION) {
 					this.layout[arrayIndex] = TILE_GROUND;
 					var x = eachCol * WORLD_W + WORLD_W/2;
 					var y = eachRow * WORLD_H + WORLD_H/2;
					placeItem(x, y, this, ITEM_POTION);
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
				            case TILE_SLIME:
				            	this.layout[arrayIndex] = TILE_GROUND;
				            	nextEnemy = new slimeMonster(x, y);
				            	this.enemyList.push(nextEnemy);
				            	enemyWasFound = true;
				            	break;
							case TILE_SLUGBRO:
								this.layout[arrayIndex] = TILE_GROUND;
								nextEnemy = new slugMonster(x, y);
								this.enemyList.push(nextEnemy);
								enemyWasFound = true;
								break;
							case TILE_PLANTBABY:
								this.layout[arrayIndex] = TILE_GROUND;
								nextEnemy = new plantBaby(x, y);
								this.enemyList.push(nextEnemy);
								enemyWasFound = true;
								break;
							case TILE_ARMSBRO:
								this.layout[arrayIndex] = TILE_GROUND;
								nextEnemy = new armsBro(x, y);
								this.enemyList.push(nextEnemy);
								enemyWasFound = true;
								break;
							case TILE_GOBO:
								this.layout[arrayIndex] = TILE_GROUND;
								nextEnemy = new enemy(x, y);
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
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,24,19,37,19,37,19,25,
	31,31,31,31,31,31,31,31,31,20,10,10,17,00,08,21,
	31,31,31,31,31,31,31,31,31,20,00,00,00,00,00,21,
	31,31,31,31,31,31,31,31,31,20,01,01,00,00,00,21,
	31,31,31,31,31,31,31,31,31,20,11,01,00,00,03,21,
	31,31,31,31,31,31,31,31,31,22,18,36,27,36,18,23];

var room2a1= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,24,19,19,37,19,37,19,19,25,31,31,31,
	31,31,31,31,20,10,00,00,17,00,00,08,21,31,31,31,
	31,31,31,31,38,00,00,00,00,00,00,00,39,31,31,31,
	31,31,31,31,20,03,00,00,00,00,00,09,21,31,31,31,
	31,31,31,31,22,35,00,00,00,00,09,34,23,31,31,31,
	31,31,31,31,31,20,00,01,00,01,10,21,31,31,31,31,
	31,31,31,31,31,20,01,01,00,01,01,21,31,31,31,31,
	31,31,31,31,31,22,18,36,27,36,18,23,31,31,31,31];

var room3a1= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,10,03,00,00,00,00,00,17,08,03,00,00,00,01,21,
	38,00,00,00,67,00,00,00,00,00,00,00,67,00,03,39,
	20,00,00,67,00,00,00,08,10,00,00,00,00,67,03,21,
	38,03,00,00,67,00,00,10,16,00,00,00,67,00,00,39,
	20,01,00,00,00,00,00,00,00,00,00,00,00,00,01,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

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
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,24,37,37,37,25,31,31,31,31,31,31,31,31,31,31,
	31,38,00,17,00,32,37,37,37,37,37,37,37,37,37,25,
	31,38,00,58,00,00,00,00,00,00,00,00,00,00,00,28,
	31,38,00,00,00,34,36,36,36,36,36,36,36,36,36,23,
	31,22,36,36,36,23,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room1b1= [ 
	24,19,19,19,37,54,19,19,54,19,19,19,37,19,26,25,
	20,00,00,01,11,41,07,07,41,00,10,14,00,00,00,21,
	38,00,00,01,11,41,07,07,50,00,00,52,40,40,40,51,
	20,00,00,01,01,41,00,00,00,00,00,05,00,00,55,21,
	29,00,00,00,00,41,00,00,00,00,00,52,40,40,40,51,
	20,01,01,01,01,41,00,00,03,00,00,05,00,00,69,21,
	38,00,10,00,11,41,00,03,10,03,00,52,40,40,40,51,
	20,00,11,11,11,41,00,00,00,00,00,05,10,16,67,21,
	22,18,18,18,36,53,18,18,27,18,18,18,36,18,18,23];

var room2b1= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,03,03,00,00,08,00,08,00,08,00,08,00,03,03,21,
	38,03,00,00,00,00,00,00,00,00,00,00,00,00,03,39,
	20,00,00,00,08,00,00,00,57,00,00,00,00,00,10,21,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,03,00,00,00,00,21,
	38,03,00,00,00,00,00,00,00,00,00,00,00,00,03,39,
	20,10,03,00,00,00,00,00,00,00,00,00,00,03,03,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];
		
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


var room3b1= [ 
	31,31,31,31,31,24,19,37,26,37,19,25,31,31,31,31,
	31,31,31,31,24,33,00,00,00,00,08,21,31,31,31,31,
	31,31,31,31,38,69,00,16,04,16,00,39,31,31,31,31,
	31,31,31,31,22,35,00,16,12,16,03,21,31,31,31,31,
	31,31,31,31,31,22,18,36,18,36,18,23,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room1c1= [ 
	31,31,24,19,37,19,19,19,26,19,19,19,37,19,19,25,
	31,31,20,03,00,08,00,00,00,00,08,00,64,00,03,21,
	31,31,38,00,65,00,00,00,42,00,00,64,00,00,00,39,
	31,31,20,00,00,00,00,42,09,42,00,00,00,00,00,21,
	31,31,20,00,00,00,42,09,42,09,42,03,00,00,00,28,
	31,31,20,00,00,00,10,42,09,42,00,00,00,00,00,21,
	31,31,38,00,65,00,08,00,42,00,00,64,00,00,08,39,
	31,31,20,09,00,00,00,00,00,00,00,00,64,10,03,21,
	31,31,22,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room2c1= [ 
	24,19,19,37,19,19,19,37,15,37,19,19,19,37,19,25,
	20,10,10,00,01,07,07,01,00,01,07,07,01,00,10,21,
	20,10,00,00,01,01,01,69,00,69,01,01,01,00,00,21,
	38,00,00,00,01,01,69,00,00,00,69,01,01,00,00,39,
	29,00,00,00,00,00,00,00,00,00,00,00,00,00,00,28,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,01,03,01,16,01,10,01,16,01,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room3c1= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	29,00,65,00,00,00,00,00,04,00,00,00,00,65,10,21,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,16,39,
	20,16,65,00,00,01,01,00,00,00,01,01,00,65,16,21,
	20,00,00,00,00,00,00,03,00,00,00,00,00,00,16,21,
	22,18,18,18,18,18,18,18,27,18,18,18,18,18,18,23];

var room0d1= [ 
	24,19,19,19,19,37,19,19,19,19,25,31,31,31,31,31,
	20,01,00,00,00,00,00,00,10,01,21,31,31,31,31,31,
	20,08,00,16,16,16,16,16,00,08,21,31,31,31,31,31,
	20,03,66,16,16,16,16,16,69,69,46,19,19,37,19,25,
	38,00,00,16,16,55,16,16,00,00,00,00,00,00,00,28,
	20,00,66,16,16,16,16,16,69,69,44,18,18,36,18,23,
	20,10,00,16,16,16,16,16,00,00,21,31,31,31,31,31,
	20,01,10,00,00,00,00,00,03,01,21,31,31,31,31,31,
	22,18,18,18,18,36,18,18,18,18,23,31,31,31,31,31];

var room1d1= [ 
	24,19,19,19,19,19,19,19,26,19,19,19,19,19,19,25,
	20,11,11,01,00,00,00,00,00,00,00,00,01,11,11,21,
	20,11,01,08,00,00,00,00,00,00,00,00,00,01,11,21,
	20,01,03,00,00,48,47,10,10,48,47,00,00,10,01,21,
	05,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,65,08,64,64,00,00,00,00,64,64,00,65,03,21,
	20,00,65,64,64,64,00,00,00,00,64,64,64,65,00,21,
	20,00,00,00,00,00,08,00,13,00,00,08,00,00,00,21,
	22,18,18,18,18,18,18,18,18,18,18,18,18,18,18,23];

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

var room3d1= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,01,01,01,00,00,00,00,00,00,00,00,01,01,01,21,
	38,01,01,10,00,64,00,00,00,00,64,00,10,01,01,39,
	20,01,00,64,00,00,44,40,40,43,00,00,64,10,01,21,
	38,07,64,00,00,10,41,10,10,41,00,00,00,64,07,39,
	20,01,00,00,00,00,46,40,40,45,03,00,00,00,01,21,
	38,01,01,00,00,00,03,08,08,00,00,00,00,01,01,39,
	20,01,01,01,00,00,00,00,00,00,00,00,01,01,01,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room0e1= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,01,01,01,07,08,00,03,00,00,00,00,00,00,10,21,
	38,01,01,07,00,00,00,00,07,07,01,07,07,00,00,39,
	20,07,07,00,64,00,00,00,07,07,01,07,07,00,00,21,
	20,04,00,64,64,00,00,00,01,01,01,01,01,00,00,28,
	20,07,07,00,64,00,00,00,07,07,01,07,07,00,00,21,
	38,01,01,07,00,00,00,00,07,07,01,07,07,00,00,39,
	20,01,01,01,07,03,00,08,00,00,10,00,00,00,10,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

var room1e1= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,01,01,01,00,00,00,00,00,00,00,10,00,00,00,21,
	38,01,01,00,00,00,01,00,00,00,01,00,00,00,00,39,
	20,01,10,00,00,01,00,00,00,01,00,00,00,10,00,21,
	29,00,00,64,01,00,00,00,01,00,64,00,01,00,00,28,
	20,00,00,01,00,00,10,01,00,00,00,01,00,00,01,21,
	38,00,10,03,64,00,01,00,00,00,01,16,10,01,01,39,
	20,01,08,00,00,00,00,00,00,01,16,16,01,01,01,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room2e1= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,00,00,00,00,00,00,00,64,00,00,00,00,00,00,21,
	38,00,00,00,00,44,47,00,00,48,43,00,00,00,00,39,
	52,00,00,00,00,50,00,00,00,00,50,65,00,48,00,51,
	29,00,00,00,64,00,00,48,47,00,00,64,00,00,00,28,
	52,00,47,00,00,49,00,00,00,00,49,00,00,48,00,51,
	38,00,00,00,00,46,47,00,00,48,45,00,65,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room3e1= [ 
	24,19,54,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,16,41,03,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,52,40,40,40,40,40,40,40,40,40,40,47,00,39,
	20,00,41,08,00,00,00,64,00,00,00,00,65,09,64,21,
	29,00,52,47,00,42,00,42,00,42,00,42,00,42,00,39,
	20,00,41,08,00,00,00,00,00,10,00,00,00,00,64,21,
	38,00,46,47,00,42,64,42,00,42,00,42,00,42,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

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
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,01,01,00,00,00,00,00,00,00,00,00,00,01,01,21,
	38,01,09,00,00,00,00,00,00,00,00,00,03,08,01,39,
	20,00,00,67,00,00,00,00,00,00,00,00,00,67,00,21,
	38,00,00,00,00,49,10,00,00,00,49,00,00,00,00,39,
	20,00,00,10,00,41,10,10,10,10,41,00,00,00,00,21,
	38,10,00,10,00,41,03,10,00,10,41,03,10,10,10,39,
	20,10,16,16,10,41,16,16,10,16,41,10,10,16,10,21,
	22,18,18,18,36,53,18,18,36,18,53,18,36,18,18,23];

var room2f1= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,08,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,00,00,10,00,00,00,00,00,00,08,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,00,00,03,00,00,00,00,00,00,00,00,09,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

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
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,24,19,19,37,19,19,37,19,19,37,19,25,31,
	31,31,31,20,00,00,55,00,55,00,00,00,00,00,21,31,
	31,31,31,38,01,00,00,03,00,00,01,00,30,00,39,31,
	31,31,31,20,01,07,07,07,07,07,01,00,00,00,21,31,
	31,31,31,22,18,18,36,18,18,36,18,18,36,18,23,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room2a2= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,31,24,19,37,19,25,31,31,31,31,31,
	31,31,31,31,31,31,20,03,30,00,21,31,31,31,31,31,
	31,31,31,31,31,31,38,08,00,00,39,31,31,31,31,31,
	31,31,31,31,31,31,20,00,00,00,21,31,31,31,31,31,
	31,31,31,31,31,31,20,00,00,00,21,31,31,31,31,31,
	31,31,31,31,31,31,38,69,56,69,39,31,31,31,31,31,
	31,31,31,31,31,31,22,35,00,34,23,31,31,31,31,31,
	31,31,31,31,31,31,31,22,27,23,31,31,31,31,31,31];

var room3a2= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,31,24,19,19,37,19,19,25,31,31,31,31,
	31,31,31,31,31,20,08,00,00,00,08,21,31,31,31,31,
	31,31,31,31,31,38,09,00,30,00,03,39,31,31,31,31,
	31,31,31,31,31,20,07,00,00,00,07,21,31,31,31,31,
	31,31,31,31,31,52,19,37,14,37,19,51,31,31,31,31,
	31,31,31,31,31,20,16,00,00,00,10,21,31,31,31,31,
	31,31,31,31,31,20,03,00,00,00,16,21,31,31,31,31,
	31,31,31,31,31,22,18,18,27,18,18,23,31,31,31,31];

var room0b2= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,24,19,19,19,37,19,19,19,37,19,19,19,25,31,31,
	31,38,08,00,00,00,00,00,00,00,00,10,10,39,31,31,
	31,20,03,30,00,00,00,64,00,64,00,00,10,32,19,25,
	31,38,00,12,00,00,00,64,00,64,00,00,00,00,00,28,
	31,20,01,01,01,01,00,00,00,00,00,00,00,34,18,23,
	31,38,11,11,03,01,10,00,00,00,00,00,00,39,31,31,
	31,22,18,18,18,36,18,18,18,36,18,18,18,23,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room1b2= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,61,67,00,00,00,03,00,00,00,00,66,16,66,00,21,
	38,04,67,00,00,00,00,00,00,00,66,00,42,00,66,39,
	52,40,40,40,40,40,40,40,40,43,00,00,03,00,00,21,
	29,00,00,00,00,08,00,62,03,41,00,00,42,00,00,21,
	20,10,00,00,00,00,00,00,00,41,00,00,10,00,00,21,
	38,01,01,01,01,01,01,01,01,41,00,00,42,00,00,39,
	20,11,11,00,09,11,11,09,10,41,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,36,53,18,18,27,18,18,23];

var room2b2= [ 
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,01,08,00,00,00,01,00,00,03,01,00,00,10,01,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,10,00,39,
	38,00,00,08,00,00,00,00,07,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,07,09,07,00,00,00,00,00,28,
	20,00,00,67,00,00,00,00,07,00,00,00,67,08,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,01,03,00,00,00,01,00,00,10,01,00,00,00,01,21,
	22,18,18,36,18,18,18,18,05,18,18,18,18,18,18,23];

var room3b2= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,01,01,00,00,00,08,00,00,00,08,00,00,01,01,21,
	38,01,03,64,00,00,00,00,00,00,00,00,64,09,01,39,
	20,00,00,01,03,64,00,01,01,00,64,00,01,00,00,21,
	29,00,00,10,01,00,00,01,01,00,00,10,00,00,00,39,
	20,00,00,10,64,00,00,00,66,00,00,64,00,00,00,21,
	38,01,10,00,00,01,01,10,00,01,01,00,00,10,01,39,
	20,01,01,01,01,03,00,00,00,00,08,01,01,01,01,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room0c2= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,37,19,19,25,
	20,08,00,00,00,00,03,08,00,00,00,00,00,03,00,21,
	38,03,66,66,00,00,00,00,00,00,00,66,09,01,00,28,
	20,00,66,66,00,00,00,00,00,00,00,00,00,00,00,21,
	38,00,00,65,10,48,40,40,40,40,40,40,40,40,40,51,
	20,00,66,66,00,00,00,00,00,00,03,00,00,00,10,21,
	38,10,66,66,00,03,66,00,00,00,00,00,00,01,00,28,
	20,01,01,01,00,00,00,00,00,00,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

var room1c2= [ 
	24,19,19,19,37,19,19,19,37,19,19,19,26,19,19,25,
	38,00,00,00,03,00,00,00,00,08,00,00,00,65,09,21,
	29,00,03,00,00,00,00,00,00,00,00,65,00,65,09,39,
	38,00,00,00,00,09,03,00,00,00,00,65,00,00,09,21,
	52,40,40,40,40,40,40,40,40,40,40,40,40,40,40,51,
	38,07,03,07,00,07,00,07,10,07,10,10,16,16,16,21,
	29,00,00,07,00,10,00,07,00,07,10,07,16,16,16,39,
	38,07,00,00,00,07,00,00,00,07,10,07,16,16,16,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room2c2= [ 
	31,31,31,31,31,24,19,19,26,19,19,25,31,31,31,31,
	31,31,31,31,31,20,01,00,00,00,01,21,31,31,31,31,
	31,31,31,31,31,38,00,00,00,00,03,39,31,31,31,31,
	31,31,31,31,31,20,00,00,00,00,00,21,31,31,31,31,
	31,31,31,31,31,38,01,00,00,00,01,39,31,31,31,31,
	31,31,31,31,31,20,00,00,00,00,00,21,31,31,31,31,
	31,31,31,31,31,38,09,66,00,66,00,39,31,31,31,31,
	31,31,31,31,31,20,01,00,67,00,01,21,31,31,31,31,
	31,31,31,31,31,22,18,18,27,18,18,23,31,31,31,31];

var room3c2= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,00,08,00,00,00,08,00,00,00,08,00,00,08,00,21,
	38,00,00,00,00,00,00,00,03,00,00,00,00,00,00,39,
	20,01,00,01,00,01,00,01,00,01,00,01,00,01,00,21,
	38,09,00,09,09,01,00,00,00,00,00,01,09,08,09,39,
	20,00,00,09,01,01,67,00,00,00,67,01,01,09,00,21,
	38,00,09,01,01,66,00,03,00,00,00,66,01,01,00,39,
	20,00,09,10,00,00,00,00,67,00,00,00,10,01,00,21,
	22,18,18,18,36,18,18,18,27,18,18,18,36,18,18,23];

var room0d2= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,24,19,19,19,19,19,19,19,19,19,19,19,19,19,25,
	31,20,07,67,67,00,08,00,00,08,00,00,01,10,10,39,
	31,20,07,00,00,00,00,00,00,00,00,00,08,01,00,21,
	31,20,07,03,00,00,00,13,00,00,00,00,00,00,00,28,
	31,20,07,00,00,00,00,00,00,00,00,00,03,01,00,21,
	31,20,07,67,67,67,00,10,00,00,00,09,01,10,00,39,
	31,22,18,36,18,18,18,18,18,18,18,18,18,18,18,23,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room1d2= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,09,08,00,00,10,10,01,00,01,07,07,00,00,00,21,
	38,00,00,00,00,10,10,10,00,00,01,07,00,00,00,28,
	52,47,00,00,10,10,10,00,00,00,03,01,00,00,00,21,
	05,00,00,00,48,40,40,40,40,40,40,40,47,00,00,39,
	52,47,00,00,67,00,00,07,07,07,00,67,00,00,00,21,
	38,07,00,03,00,67,00,66,00,66,67,00,03,00,00,39,
	20,07,00,00,00,00,00,07,07,07,00,00,00,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

var room2d2= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,08,00,00,08,00,08,00,00,00,01,07,03,07,03,21,
	29,00,00,00,00,00,00,00,00,10,01,03,07,03,07,39,
	20,03,00,00,00,00,00,00,10,01,03,07,03,07,01,21,
	38,01,01,01,01,01,01,01,01,03,07,03,07,01,10,39,
	20,07,03,07,03,07,03,07,03,07,03,07,01,00,00,21,
	38,03,07,03,07,03,07,03,07,03,07,01,00,00,00,28,
	20,07,03,07,03,07,03,07,03,07,01,03,00,00,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,27,18,18,23];

var room3d2= [ 
	24,19,19,19,37,19,19,54,26,19,19,19,37,54,19,25,
	20,10,00,00,00,00,10,41,00,00,00,00,00,50,16,21,
	38,00,48,40,43,00,00,41,08,00,00,00,00,00,00,39,
	20,00,03,07,41,00,00,46,40,40,40,40,40,43,00,21,
	38,00,00,00,41,00,00,00,00,00,00,10,07,50,00,39,
	52,40,47,00,46,40,40,40,40,43,00,00,66,00,00,21,
	29,00,66,00,66,66,66,00,07,41,00,66,66,66,00,39,
	20,00,00,00,00,00,00,00,00,41,03,00,00,00,00,21,
	22,18,18,18,36,18,18,18,27,53,18,18,36,18,18,23];

var room0e2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	28,00,65,00,00,00,00,00,00,00,00,00,00,65,00,39,
	20,00,65,00,00,00,00,00,66,00,00,00,00,65,00,21,
	20,00,65,00,00,00,00,00,00,00,00,00,00,65,00,39,
	20,00,65,00,00,00,00,00,00,00,00,00,00,65,00,21,
	22,18,18,36,18,18,18,18,18,18,18,18,18,18,18,23];

var room1e2= [ 
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,
	31,31,31,31,24,19,19,37,19,19,25,31,31,31,31,31,
	31,31,31,31,20,69,10,08,10,69,39,31,31,31,31,31,
	31,31,31,31,20,10,69,03,69,10,32,19,19,19,19,25,
	31,31,31,31,38,10,00,12,04,00,00,00,00,00,00,28,
	31,31,31,31,20,10,69,00,69,10,34,18,18,18,18,23,
	31,31,31,31,20,69,00,00,00,69,39,31,31,31,31,31,
	31,31,31,31,22,18,18,36,18,18,23,31,31,31,31,31,
	31,31,31,31,31,31,31,31,31,31,31,31,31,31,31,31];

var room2e2= [ 
	24,19,19,37,19,19,19,19,19,19,19,19,26,19,19,25,
	20,16,16,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,16,16,42,00,42,00,42,00,42,00,42,00,42,00,39,
	52,40,47,64,64,00,00,64,64,00,64,64,00,00,00,21,
	29,00,00,00,00,42,00,42,00,42,00,42,00,42,00,28,
	52,40,47,64,64,00,00,64,64,00,64,64,00,00,00,21,
	20,16,16,42,00,42,00,49,00,49,00,42,00,42,00,39,
	20,16,16,00,00,00,00,41,00,41,00,00,00,00,00,21,
	22,18,18,36,18,18,18,53,15,53,18,18,18,18,18,23];

var room3e2= [ 
	24,19,19,19,37,19,19,19,26,19,19,19,37,19,19,25,
	20,03,09,00,09,00,00,08,00,00,00,00,00,00,09,21,
	38,09,09,00,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,09,21,
	29,00,65,00,00,00,00,03,00,00,00,00,00,65,00,39,
	20,00,65,00,00,00,00,00,66,03,00,00,00,65,00,21,
	38,00,65,00,09,00,00,00,00,00,00,00,00,65,00,39,
	20,09,65,00,00,00,00,00,00,00,00,09,00,65,00,21,
	22,18,18,18,36,18,18,18,36,18,18,18,36,18,18,23];

var room0f2= [
	24,19,19,37,19,19,19,19,26,19,19,19,19,19,19,25,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,57,00,00,00,00,00,00,00,00,00,00,00,39,
	20,00,00,00,00,00,00,00,00,00,00,00,00,00,00,21,
	20,00,00,00,00,00,00,00,17,00,00,00,00,00,00,39,
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
	31,31,31,31,31,31,31,24,26,25,31,31,31,31,31,31,
	31,31,31,31,31,31,31,38,00,39,31,31,31,31,31,31,
	31,31,31,31,31,31,31,38,00,39,31,31,31,31,31,31,
	31,31,31,31,31,24,37,33,00,32,37,25,31,31,31,31,
	31,31,31,31,31,38,00,00,00,00,00,39,31,31,31,31,
	31,31,31,31,31,38,00,00,00,00,00,39,31,31,31,31,
	31,31,31,31,31,38,55,00,17,00,59,39,31,31,31,31,
	31,31,31,31,31,38,00,00,00,00,00,39,31,31,31,31,
	31,31,31,31,31,22,36,36,36,36,36,23,31,31,31,31];

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
var room2f3= [ 
	31,31,31,31,31,31,24,33,00,32,25,31,31,31,31,31,
	31,31,31,31,31,31,22,35,56,34,23,31,31,31,31,31,
	31,31,31,31,31,31,24,33,00,32,25,31,31,31,31,31,
	31,31,31,31,31,31,22,35,00,34,23,31,31,31,31,31,
	31,31,31,31,31,31,24,33,00,32,25,31,31,31,31,31,
	31,31,31,31,31,31,20,00,00,00,21,31,31,31,31,31,
	31,31,31,31,31,31,38,00,01,00,39,31,31,31,31,31,
	31,31,31,31,31,31,20,00,00,00,21,31,31,31,31,31,
	31,31,31,31,31,31,22,18,36,18,23,31,31,31,31,31];

var room2e3= [ 
	31,31,31,31,31,20,00,00,00,00,00,21,31,31,31,31,
	31,31,31,31,31,38,00,00,00,00,00,39,31,31,31,31,
	31,31,31,31,31,20,03,00,00,00,00,21,31,31,31,31,
	31,31,31,31,31,20,10,00,00,00,03,21,31,31,31,31,
	31,31,31,31,31,22,35,00,00,00,34,23,31,31,31,31,
	31,31,31,31,31,31,20,00,00,00,21,31,31,31,31,31,
	31,31,31,31,31,31,38,00,00,00,39,31,31,31,31,31,
	31,31,31,31,31,31,20,03,00,08,21,31,31,31,31,31,
	31,31,31,31,31,31,22,35,00,34,23,31,31,31,31,31];

var room2d3= [ 
	31,24,19,19,19,37,19,19,26,19,19,37,19,19,19,25,
	31,20,10,00,00,00,00,00,00,00,00,00,00,00,10,21,
	31,38,00,00,01,00,00,00,00,00,00,00,01,00,00,39,
	31,20,00,00,03,01,03,03,00,03,03,01,03,00,00,21,
	31,38,00,00,00,01,01,01,01,01,01,01,00,00,00,39,
	31,22,35,00,00,08,01,07,60,07,01,08,00,00,34,23,
	31,31,22,35,00,00,69,01,01,01,69,00,00,34,23,31,
	31,31,31,22,35,00,00,69,00,69,00,00,34,23,31,31,
	31,31,31,31,22,35,00,00,00,00,00,34,23,31,31,31];

var room2c3= [ 
	24,37,37,37,37,37,37,37,37,37,37,37,37,37,37,25,
	38,03,08,03,00,00,00,00,00,00,00,03,00,00,10,39,
	38,00,03,00,00,00,00,00,63,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,00,00,00,39,
	38,03,00,00,00,00,00,00,03,00,00,00,00,00,00,39,
	38,00,00,00,00,00,00,00,00,00,00,00,03,00,00,39,
	38,00,00,00,00,00,03,00,00,00,00,00,03,00,03,39,
	38,03,00,00,00,00,00,00,00,00,00,00,00,00,03,39,
	22,36,36,36,36,36,36,36,27,36,36,36,36,36,36,23];



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
