const MIN_DECAY_TIME = .2;
const MAX_DECAY_TIME = .4;
const MIN_PARTICLE_VELOCITY = -1;
const MAX_PARTICLE_VELOCITY = 1;
const PARTICLE_SIZE = 1;

var particle = [];

function particleClass(posX, posY) {

    var size;
    var x = posX;
    var y = posY;
    var decayTimer = MIN_DECAY_TIME + Math.random() * MAX_DECAY_TIME;
    var velX = MIN_PARTICLE_VELOCITY + Math.random() * MAX_PARTICLE_VELOCITY;
    var velY = MIN_PARTICLE_VELOCITY + Math.random() * MAX_PARTICLE_VELOCITY;
    var angle = Math.random() * Math.PI * 2;

    var red = Math.round(Math.random() * 255);
    var blue = Math.round(Math.random() * 255);
    var green = Math.round(Math.random() * 255);
    var color = "rgb(" + red + "," + blue + "," + green + ")";

    this.remove = false;

    this.update = function() {
        decayTimer -= TIME_PER_TICK;
        size = PARTICLE_SIZE;
        if (decayTimer <= 0) {
            this.remove = true;
        }

        x += Math.cos(angle) * velX;
        y += Math.sin(angle) * velY;
    }

    this.draw = function() {
        colorRect(x, y, size, size, color);
    }
}

function updateParticles() {
    for (var i = 0; i < particle.length; i++) {
        particle[i].update();
    }
    for (var i = particle.length -1; i >= 0; i--) {
        particle[i].update();
        if (particle[i].remove) {
            particle.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (var i = 0; i < particle.length; i++) {
        particle[i].draw();
    }
}
