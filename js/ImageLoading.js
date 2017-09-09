var playerPic = document.createElement("img");
var worldPics = [];
var sprites = {}
var picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	//console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(data) {
	var set = data.set;
	var name = data.name;

	if(!sprites[set]){
		sprites[set] = {}
	}
	sprites[set][name] = document.createElement("img");
	sprites[set][name].onload = countLoadedImagesAndLaunchIfReady;
	sprites[set][name].src = "img/"+ data.fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	worldPics[worldCode].onload = countLoadedImagesAndLaunchIfReady;
	worldPics[worldCode].src = "img/"+ fileName;
}

function loadImages() {
	var imageList = [
		{set: "Player", name: "standSouth", fileName: "MainChar/playerchar_Stand_0.png"},
		{set: "Player", name: "standEast", fileName: "MainChar/playerchar_Stand_1.png"},
		{set: "Player", name: "standNorth", fileName: "MainChar/playerchar_Stand_2.png"},
		{set: "Player", name: "standWest", fileName: "MainChar/playerchar_Stand_3.png"},
		{set: "Player", name: "walkSouth", fileName: "MainChar/playerchar_Walk South.png"},
		{set: "Player", name: "walkEast", fileName: "MainChar/playerchar_Walk East.png"},
		{set: "Player", name: "walkNorth", fileName: "MainChar/playerchar_Walk North.png"},
		{set: "Player", name: "walkWest", fileName: "MainChar/playerchar_Walk West.png"},

		{set: "Slime", name: "idleAnimation", fileName: "slimeIdle.png"},
		{set: "Hud", name: "blueHeart", fileName: "blueHeart.png"},
		{set: "Hud", name: "heartEmpty", fileName: "heartEmpty.png"},
		{set: "Hud", name: "heartFull", fileName: "heartFull.png"},
		{set: "Hud", name: "heartHalf", fileName: "heartHalf.png"},

		{worldType: TILE_TRAP, theFile: "bladeTrap.png"},
		{worldType: TILE_GROUND, theFile: "world_ground.png"},
		{worldType: TILE_WALL, theFile: "world_brick.png"},
		{worldType: TILE_SKULL, theFile: "world_skull.png"},
		{worldType: TILE_KEY, theFile: "world_key.png"},
		{worldType: TILE_DOOR, theFile: "world_door.png"}
	];

	picsToLoad = imageList.length;

	for(var i=0;i<imageList.length;i++) {
		if(imageList[i].set != undefined, imageList[i].set != undefined) {
			beginLoadingImage(imageList[i]);
		} else {
			loadImageForWorldCode(imageList[i].worldType, imageList[i].theFile);
		}
	}
}
