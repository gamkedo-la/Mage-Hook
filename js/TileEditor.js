var _DEBUG_ENABLE_TILE_EDITOR = false;

//console.log(currentRoom.layout);

function roomTileCoordinate() {
    roomCol = Math.floor(WORLD_COLS * mouseX / canvas.offsetWidth);
    roomRow = Math.floor(WORLD_ROWS * mouseY / canvas.offsetHeight);

   // var tileX = (roomCol * WORLD_W);
   // var tileY = (roomRow * WORLD_H);

    tileUnderMouse = rowColToArrayIndex(roomCol, roomRow);
    console.log(roomCol, roomRow, worldGrid[tileUnderMouse]);
}

function editTileOnMouseClick(evt) {
	if(_DEBUG_ENABLE_TILE_EDITOR) {
		worldGrid[tileUnderMouse]++;
		if (worldGrid[tileUnderMouse] > HIGHEST_TILE_NUMBER)
			worldGrid[tileUnderMouse] = 0;
		if (worldGrid[tileUnderMouse] == 2)
			worldGrid[tileUnderMouse]++;
		if (worldGrid[tileUnderMouse] == 6)
			worldGrid[tileUnderMouse]++;
	}
}