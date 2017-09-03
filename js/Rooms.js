

function Room(roomLayout) {
	this.originalLayout = roomLayout.slice();
	this.layout = this.originalLayout.slice();
	this.loaded = true;

	this.reset = function(){
		this.layout = this.originalLayout.slice();
		console.log(this.layout);
	}

	this.roomChange = function () {
		return;
	}
};


var room1f1 = new Room([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1, 0,
	0, 1, 0, 4, 0, 4, 0, 1, 0, 0, 0, 1, 0, 1, 4, 4, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 5, 1, 5, 1, 1, 0,
	0, 1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 5, 0, 5, 0, 5, 0, 3, 0, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
room1f1.loaded = true;
room1f1.roomChange = function () {
	if (this.loaded == true && player.x > 850){
			loadLevel(room2f1.layout);
			player.x -= 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
		if (this.loaded == true && player.x < 50){
			loadLevel(room2f1.layout);
			player.x += 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
}


var room2f1 = new Room([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 5, 0, 1, 1, 1, 1, 0,
	0, 1, 0, 4, 0, 4, 0, 1, 0, 0, 0, 1, 0, 1, 4, 4, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 1, 0, 4, 0, 1, 5, 1, 5, 1, 1, 0,
	0, 1, 1, 1, 5, 1, 1, 1, 0, 4, 0, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 4, 0, 1, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
	0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 0, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0,
	0, 1, 0, 5, 0, 5, 0, 5, 0, 3, 1, 1, 1, 1, 1, 1, 1, 0,
	0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
room2f1.loaded = true;
room2f1.roomChange = function () {
	if (this.loaded == true && player.x > 850){
			loadLevel(room1f1.layout);
			player.x -= 775;
			this.loaded = false;
			room1f1.loaded = true;
		}
		if (this.loaded == true && player.x < 50){
			loadLevel(room1f1.layout);
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
	loadLevel(allRooms[0].layout);
}