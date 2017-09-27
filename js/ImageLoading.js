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
		{set: "Player", name: "anchorAttack", fileName: "MainChar/Anchor Attack.png"},
		{set: "Player", name: "rangedAttack", fileName: "MainChar/Anchor Ranged Attack.png"},
		{set: "Player", name: "bulletAttackNorth", fileName: "MainChar/Bullet Attack north.png"},
		{set: "Player", name: "bulletAttackSouth", fileName: "MainChar/Bullet Attack south.png"},
		{set: "Player", name: "bulletAttackEast", fileName: "MainChar/Bullet Attack east.png"},
		{set: "Player", name: "bulletAttackWest", fileName: "MainChar/Bullet Attack west.png"},

		{set: "Slime", name: "idleAnimation", fileName: "slimeIdle.png"},
		{set: "Slime", name: "deathAnimation", fileName: "slimeDeath.png"},
		{set: "Slug", name: "walkAnimation", fileName: "Enemies/slugBuddy.png"},
		{set: "Slug", name: "walkAnimationEast", fileName: "Enemies/slugBuddy_East.png"},
		{set: "ArmsBro", name: "idle", fileName: "Enemies/armsBro.png"},
		{set: "ArmsBro", name: "walkAnimationEast", fileName: "Enemies/ArmsBrowalk_east.png"},
		{set: "ArmsBro", name: "walkAnimation", fileName: "Enemies/ArmsBrowalk1.png"},
		{set: "Hud", name: "blueHeart", fileName: "blueHeart.png"},
		{set: "Hud", name: "heartEmpty", fileName: "heartEmpty.png"},
		{set: "Hud", name: "heartFull", fileName: "heartFull.png"},
		{set: "Hud", name: "heartHalf", fileName: "heartHalf.png"},

		{worldType: TILE_TRAP, theFile: "bladeTrap.png"},
		{worldType: TILE_GROUND, theFile: "world_ground.png"},
		{worldType: TILE_NOTHING, theFile: "world_nothingness.png"},
		{worldType: TILE_WALL, theFile: "world_brick.png"},
		{worldType: TILE_SKULL, theFile: "world_skull.png"},
		{worldType: TILE_KEY_COMMON, theFile: "world_key_bronze.png"},
		{worldType: TILE_KEY_RARE, theFile: "world_key_silver.png"},
		{worldType: TILE_KEY_EPIC, theFile: "world_key_gold.png"},
		{worldType: TILE_ENEMYSTART, theFile: "enemySpawn.png"},

		{worldType: TILE_DOOR_COMMON, theFile: "world_door_bronze.png"},
		{worldType: TILE_DOOR_RARE, theFile: "world_door_silver.png"},
		{worldType: TILE_DOOR_EPIC, theFile: "world_door_gold.png"},
		{worldType: TILE_CRYSTAL, theFile: "world_crystal.png"},
		{worldType: TILE_CHAIN, theFile: "world_chains.png"},
		{worldType: TILE_OOZE, theFile: "world_ooze.png"},
		{worldType: TILE_WEB, theFile: "world_web.png"},
		{worldType: TILE_BOX, theFile: "world_box.png"},
		{worldType: TILE_STAIRS_UP, theFile: "world_stairs_up.png"},
		{worldType: TILE_STAIRS_DOWN, theFile: "world_stairs_down.png"},
		{worldType: TILE_WALL_NORTH, theFile: "world_brick_north.png"},
		{worldType: TILE_WALL_SOUTH, theFile: "world_brick_south.png"},
		{worldType: TILE_WALL_WEST, theFile: "world_brick_west.png"},
		{worldType: TILE_WALL_EAST, theFile: "world_brick_east.png"},
		{worldType: TILE_WALL_CORNER_NE, theFile: "world_brick_corner_north_east.png"},
		{worldType: TILE_WALL_CORNER_NW, theFile: "world_brick_corner_north_west.png"},
		{worldType: TILE_WALL_CORNER_SE, theFile: "world_brick_corner_south_east.png"},
		{worldType: TILE_WALL_CORNER_SW, theFile: "world_brick_corner_south_west.png"},
		{worldType: TILE_ROOM_DOOR_NORTH, theFile: "world_room_door_north.png"},
		{worldType: TILE_ROOM_DOOR_SOUTH, theFile: "world_room_door_south.png"},
		{worldType: TILE_ROOM_DOOR_EAST, theFile: "world_room_door_east.png"},
		{worldType: TILE_ROOM_DOOR_WEST, theFile: "world_room_door_west.png"},
		{worldType: TILE_WALL_OUTCORNER_NE, theFile: "world_brick_outcorner_north_east.png"},
		{worldType: TILE_WALL_OUTCORNER_NW, theFile: "world_brick_outcorner_north_west.png"},
		{worldType: TILE_WALL_OUTCORNER_SE, theFile: "world_brick_outcorner_south_east.png"},
		{worldType: TILE_WALL_OUTCORNER_SW, theFile: "world_brick_outcorner_south_west.png"},
		{worldType: TILE_WALL_NORTH_TORCH, theFile: "world_brick_north_torch.png"},
		{worldType: TILE_WALL_SOUTH_TORCH, theFile: "world_brick_south_torch.png"},
		{worldType: TILE_WALL_WEST_TORCH, theFile: "world_brick_west_torch.png"},
		{worldType: TILE_WALL_EAST_TORCH, theFile: "world_brick_east_torch.png"},
		{worldType: TILE_SMALL_WALL_HORIZ, theFile: "small_wall_horiz.png"},
		{worldType: TILE_SMALL_WALL_VERT, theFile: "small_wall_vert.png"},
		{worldType: TILE_SMALL_WALL_PILLAR, theFile: "small_wall_pillar.png"},
		{worldType: TILE_SMALL_WALL_NE, theFile: "small_wall_ne.png"},
		{worldType: TILE_SMALL_WALL_NW, theFile: "small_wall_nw.png"},
		{worldType: TILE_SMALL_WALL_SE, theFile: "small_wall_se.png"},
		{worldType: TILE_SMALL_WALL_SW, theFile: "small_wall_sw.png"},
		{worldType: TILE_SMALL_WALL_CAP_EAST, theFile: "small_wall_cap_east.png"},
		{worldType: TILE_SMALL_WALL_CAP_WEST, theFile: "small_wall_cap_west.png"},
		{worldType: TILE_SMALL_WALL_CAP_NORTH, theFile: "small_wall_cap_north.png"},
		{worldType: TILE_SMALL_WALL_CAP_SOUTH, theFile: "small_wall_cap_south.png"},
		{worldType: TILE_SMALL_WALL_INTO_BIG_EAST, theFile: "small_wall_into_big_wall_east.png"},
		{worldType: TILE_SMALL_WALL_INTO_BIG_WEST, theFile: "small_wall_into_big_wall_west.png"},
		{worldType: TILE_SMALL_WALL_INTO_BIG_NORTH, theFile: "small_wall_into_big_wall_north.png"},
		{worldType: TILE_SMALL_WALL_INTO_BIG_SOUTH, theFile: "small_wall_into_big_wall_south.png"},
		
		{worldType: TILE_HEART_CONTAINER, theFile: "heart_container.png"}
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
