var canvas, canvasContext;
var levelOneRun = false;
const FRAMES_PER_SECOND = 30;
const SPRITE_FRAMES_PER_SECOND = 8;

var blueWarrior = new warriorClass();
var testSprite = {}; // test object

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", canvas.width/2, canvas.height/2, 'white');

	loadImages();
}

function imageLoadingDoneSoStartGame() {
	setInterval(updateAll, 1000/FRAMES_PER_SECOND);

	setupInput();

	loadLevel(room1f1.layout);

}

function loadLevel(whichLevel) {
	worldGrid = whichLevel.slice();
	blueWarrior.reset(sprites.Player.standSouth, "Blue Storm");

	var testSpritePic = sprites.Slime.idleAnimation;
	testSprite = new spriteClass(testSpritePic, 32, 32, 6); // NOTE(Cipherpunk): temporary object
}

function updateAll() {
	moveAll();
	drawAll();
	cameraLock();
	room1f1.roomChange();
	room2f1.roomChange();
}

function moveAll() {
	blueWarrior.move();
	testSprite.update();
	//console.log(blueWarrior.x);
	//console.log(blueWarrior.y);
}

function drawAll() {
	canvasContext.save();
	canvasContext.translate(-camPanX,-camPanY);
	drawWorld();
	blueWarrior.draw();
	testSprite.render(canvas.width/2, canvas.height/2);
	canvasContext.restore();
}
