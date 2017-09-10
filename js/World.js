const WORLD_W = 20;
const WORLD_H = 20;
const WORLD_GAP = 0;
const WORLD_COLS = 16;
const WORLD_ROWS = 9;
//rooms are defined now in rooms.js
var worldGrid = [];

const TILE_GROUND = 0;
const TILE_WALL = 1;
const TILE_PLAYERSTART = 2;
const TILE_SKULL = 3;
const TILE_KEY_COMMON = 4;
const TILE_DOOR_COMMON = 5;
const TILE_ENEMYSTART = 6;
const TILE_TRAP = 7;
const TILE_CHAIN = 8;
const TILE_OOZE = 9;
const TILE_WEB = 10;
const TILE_BOX = 11;
const TILE_KEY_RARE = 12;
const TILE_KEY_EPIC = 13;
const TILE_DOOR_RARE = 14;
const TILE_DOOR_EPIC = 15;
const TILE_CRYSTAL = 16;

function returnTileTypeAtColRow(col, row) {
	if(col >= 0 && col < WORLD_COLS &&
		row >= 0 && row < WORLD_ROWS) {
		 var worldIndexUnderCoord = rowColToArrayIndex(col, row);
		 return worldGrid[worldIndexUnderCoord];
	} else {
		return WORLD_WALL;
	}
}

function getTileIndexAtPixelCoord(atX, atY) {
	var playerWorldCol = Math.floor(atX / WORLD_W);
	var playerWorldRow = Math.floor(atY / WORLD_H);
	var worldIndexUnderPlayer = rowColToArrayIndex(playerWorldCol, playerWorldRow);

	if(playerWorldCol >= 0 && playerWorldCol < WORLD_COLS &&
		playerWorldRow >= 0 && playerWorldRow < WORLD_ROWS) {
		return worldIndexUnderPlayer;
	} // end of valid col and row

	return undefined;
} // end of playerWorldHandling func

function rowColToArrayIndex(col, row) {
	return col + WORLD_COLS * row;
}

function tileTypeHasTransparency(checkTileType) {
	return (checkTileType == TILE_SKULL ||
			checkTileType == TILE_DOOR_COMMON ||
			checkTileType == TILE_CHAIN ||
			checkTileType == TILE_OOZE ||
			checkTileType == TILE_WEB ||
			checkTileType == TILE_BOX ||
			checkTileType == TILE_DOOR_EPIC ||
			checkTileType == TILE_DOOR_RARE);
}

function drawWorld() {

	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;
	for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);
			var tileKindHere = worldGrid[arrayIndex];
			var useImg = worldPics[tileKindHere];

			if( tileTypeHasTransparency(tileKindHere) ) {
				canvasContext.drawImage(worldPics[TILE_GROUND],drawTileX,drawTileY);
			}

			canvasContext.drawImage(useImg,drawTileX,drawTileY);
			// colorText(arrayIndex, drawTileX, drawTileY+12, 'white');

			drawTileX += WORLD_W;
			arrayIndex++;
		} // end of for each col
		drawTileY += WORLD_H;
		drawTileX = 0;
	} // end of for each row
} // end of drawWorld func
