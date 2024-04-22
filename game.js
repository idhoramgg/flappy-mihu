const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

let bird = {
    x: 50,
    y: 150,
    width: 34,  // Adjust based on your image size
    height: 24, // Adjust based on your image size
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    sprite: new Image()
};

bird.sprite.src = 'mihu.png';  // Make sure the path to your image is correct

let pipes = [];
let pipeWidth = 20;
let pipeGap = 100;
let frame = 0;
let score = 0;

function drawBird() {
    ctx.drawImage(bird.sprite, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.velocity *= 0.9;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }
}

function drawPipes() {
    pipes.forEach(function(pipe) {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 60 === 0) {
        let top = Math.floor(Math.random() * (canvas.height - pipeGap));
        let bottom = canvas.height - top - pipeGap;
        pipes.push({x: canvas.width, top: top, bottom: bottom});
    }
    pipes.forEach(function(pipe, index) {
        pipe.x -= 2;
        if (pipe.x + pipeWidth < 0) {
            score++;
            pipes.splice(index, 1);
        }
    });
}

function handleCollision() {
    pipes.forEach(function(pipe) {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            gameOver();
        }
    });
}

function gameOver() {
    ctx.fillStyle = 'black';
    ctx.fillText("Game Over!", 120, canvas.height / 2);
    pipes = [];
    bird.y = 150;
    score = 0;
    bird.velocity = 0;
}

canvas.addEventListener('click', function() {
    bird.velocity += bird.lift;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    updateBird();
    drawPipes();
    updatePipes();
    handleCollision();
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 20);
    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
