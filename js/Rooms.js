

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
		var enemyWasFound = false;
		do {
			enemyWasFound = false;
			for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
				for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
					var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
					if(this.layout[arrayIndex] == TILE_ENEMYSTART) {
						this.layout[arrayIndex] = TILE_GROUND;
						nextEnemy = new Enemy();
						nextEnemy.x = eachCol * WORLD_W + WORLD_W/2;
						nextEnemy.y = eachRow * WORLD_H + WORLD_H/2;
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
		return;
	}
};


var room1f1 = new Room([	
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1,
	1, 0, 4, 6, 4, 0, 1, 0, 2, 0, 1, 0, 1, 4, 4, 1,
	1, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 5, 1, 5, 1, 1,
	1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
	1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1,
	1, 0, 5, 0, 5, 0, 5, 0, 3, 6, 1, 1, 1, 1, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
room1f1.loaded = true;
room1f1.roomChange = function () {
	if (this.loaded == true && player.x > 340){
			loadLevel(room2f1);
			player.x -= 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
		if (this.loaded == true && player.x < 0){
			loadLevel(room2f1);
			player.x += 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
}


var room2f1 = new Room([
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
	1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1,  1,
	1, 0, 4, 0, 4, 0, 1, 0, 0, 0, 1, 0, 1, 4, 4,  1,
	1, 0, 0, 0, 0, 0, 1, 4, 4, 0, 1, 5, 1, 5, 1,  1,
	1, 1, 1, 5, 1, 1, 1, 4, 4, 0, 1, 0, 0, 0, 1,  1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 4, 0, 1,  1,
	0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,  1,
	1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1,  1,
	1, 0, 5, 0, 5, 0, 5, 0, 3, 1, 1, 1, 1, 1, 1,  1,
	1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0,  1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1,  1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,1] );
room2f1.loaded = true;
room2f1.roomChange = function () {
	if (this.loaded == true && player.x > 340){
			loadLevel(room1f1);
			player.x -= 775;
			this.loaded = false;
			room1f1.loaded = true;
		}
		if (this.loaded == true && player.x < 0){
			loadLevel(room1f1);
			player.x += 775;
			this.loaded = false;
			room1f1.loaded = true;
		}
}
var allRooms = [room1f1, room2f1];
var currentRoom = null;

function resetAllRooms(){
	for(var i = 0; i< allRooms.length; i++){
		allRooms[i].reset();
	}
	loadLevel(allRooms[0]);
}