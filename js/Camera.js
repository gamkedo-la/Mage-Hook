var camPanX = 0.0;
var camPanY = 0.0;

function cameraLock() {
    if(camPanX < 50) {
      camPanX = 50;
    }
    if(camPanY < 50) {
      camPanY = 50;
    }
    var maxPanRight = (WORLD_COLS-1) * WORLD_W - canvas.width;
    var maxPanTop = (WORLD_ROWS-1) * WORLD_H - canvas.height;
    if(camPanX > maxPanRight) {
      camPanX = maxPanRight;
    }
    if(camPanY > maxPanTop) {
      camPanY = maxPanTop;
    }
  }