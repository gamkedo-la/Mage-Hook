var _DEBUG_ENABLE_TILE_EDITOR = false;

//console.log(currentRoom.layout);

function roomTileCoordinate()
{
    roomCol = Math.floor(mouseX / WORLD_W);
    roomRow = Math.floor(mouseY / WORLD_H);

    var tileX = (roomCol * WORLD_W);
    var tileY = (roomRow * WORLD_H);
    console.log(tileX, tileY, tileUnderMouse);

    tileUnderMouse = rowColToArrayIndex(roomCol, roomRow);
}