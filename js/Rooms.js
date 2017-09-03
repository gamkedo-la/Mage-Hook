var allRooms = [];

function Room() {
	this.layout = [];
	this.loaded = true;

	this.roomChange = function () {
		return;
	}
};

var room1f1 = new Room();
room1f1.layout =[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
				 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
room1f1.loaded = true;
room1f1.roomChange = function () {
	if (this.loaded == true && bluePlayer.x > 850){
			loadLevel(room2f1.layout);
			bluePlayer.x -= 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
		if (this.loaded == true && bluePlayer.x < 50){
			loadLevel(room2f1.layout);
			bluePlayer.x += 775;
			this.loaded = false;
			room2f1.loaded = true;
		}
}

var room2f1 = new Room();
room2f1.layout =[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
				 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,];
room2f1.loaded = true;
room2f1.roomChange = function () {
	if (this.loaded == true && bluePlayer.x > 850){
			loadLevel(room1f1.layout);
			bluePlayer.x -= 775;
			this.loaded = false;
			room1f1.loaded = true;
		}
		if (this.loaded == true && bluePlayer.x < 50){
			loadLevel(room1f1.layout);
			bluePlayer.x += 775;
			this.loaded = false;
			room1f1.loaded = true;
		}
}
