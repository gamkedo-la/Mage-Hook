var canvas, canvasContext;

var blueWarrior = new warriorClass();

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

	loadImages();
}

function imageLoadingDoneSoStartGame() {
	var framesPerSecond = 30;
	setInterval(updateAll, 1000/framesPerSecond);

	setupInput();

	loadLevel(levelOne);
}

function loadLevel(whichLevel) {
	worldGrid = whichLevel.slice();
	blueWarrior.reset(sprites.Player.standSouth, "Blue Storm");
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
}

function moveAll() {
	blueWarrior.move();
	//console.log(blueWarrior.x);
	//console.log(blueWarrior.y);
}

function drawAll() {
	canvasContext.save();
	canvasContext.translate(-camPanX,-camPanY);
	drawWorld();
	blueWarrior.draw();
	canvasContext.restore();
} 