var _DEBUG_ENABLE_TILE_EDITOR = false;

//console.log(currentRoom.layout);
function roomTileCoordinate() {
    roomCol = Math.floor(WORLD_COLS * mouseX / canvas.offsetWidth);
    roomRow = Math.floor(WORLD_ROWS * mouseY / canvas.offsetHeight);

   // var tileX = (roomCol * WORLD_W);
   // var tileY = (roomRow * WORLD_H);

    //var tileUnderMouse = rowColToArrayIndex(roomCol, roomRow);
    console.log(mouseX, mouseY,roomCol,roomRow);
}