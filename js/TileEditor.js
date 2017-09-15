var _DEBUG_ENABLE_TILE_EDITOR = false;

function roomTileCoordinate() {
    roomCol = Math.floor(WORLD_COLS * mouseX / canvas.offsetWidth);
    roomRow = Math.floor(WORLD_ROWS * mouseY / canvas.offsetHeight);

   	var tileX = (roomCol * WORLD_W);
   	var tileY = (roomRow * WORLD_H);

    tileUnderMouse = rowColToArrayIndex(roomCol, roomRow);
    console.log(roomCol, roomRow, worldGrid[tileUnderMouse]);

    canvasContext.strokeRect(tileX, tileY, WORLD_W, WORLD_H);
    canvasContext.strokeStyle = 'orange';
    canvasContext.lineWidth = 1;
}

function editTileOnMouseClick(evt) {
	if(_DEBUG_ENABLE_TILE_EDITOR) {
		worldGrid[tileUnderMouse]++;
		if (worldGrid[tileUnderMouse] > HIGHEST_TILE_NUMBER) {
			worldGrid[tileUnderMouse] = 0;
		}
		if (worldGrid[tileUnderMouse] == 2) {
			worldGrid[tileUnderMouse]++;
		}
		if (worldGrid[tileUnderMouse] == 6) {
			worldGrid[tileUnderMouse]++;
		}
	}
}

function copyToClipboard() {  
	var layoutString = "";
	for(var i=0; i<currentRoom.layout.length; i++) {
		if (i%16==0)
			layoutString += "\n";
		if (currentRoom.layout[i] < 10) {
			layoutString += "0" + currentRoom.layout[i].toString() + ",";
		} else {
			layoutString += currentRoom.layout[i] + ",";
		}
	}
	
	layoutString = layoutString.slice(0,-1);
	if (_DEBUG_ENABLE_TILE_EDITOR) {
		window.prompt(roomName + "      "+ "Ctrl+C then Enter to close window" +":", 
		layoutString);
	}
}