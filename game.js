const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Adjust the canvas size
function adjustCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
adjustCanvasSize();
window.addEventListener('resize', adjustCanvasSize);

let bird = {
    x: 50,
    y: canvas.height / 2,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
    sprite: new Image()
};
bird.sprite.src = 'mihu.png';

let pipes = [];
let pipeWidth = 20;
let pipeGap = 200;  // Increased gap size for easier navigation
let pipeSpeed = 2;  // Reduced pipe speed for easier gameplay
let pipeFrequency = 200;  // Increase the frequency value for less frequent pipes
let frame = 0;
let score = 0;
let gameRunning = true;
let animationFrameId = null;  // ID untuk requestAnimationFrame

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
    if (frame % pipeFrequency === 0) {  // Adjusted for less frequent pipes
        let top = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 10;  // Slightly randomize the top gap start
        let bottom = canvas.height - top - pipeGap;
        pipes.push({x: canvas.width, top: top, bottom: bottom});
    }
    pipes.forEach(function(pipe, index) {
        pipe.x -= pipeSpeed;  // Adjusted speed
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
    ctx.font = "30px 'Press Start 2P'";
    ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2);
    gameRunning = false;
    // animationFrameId = null;
    setTimeout(function() {
        pipes = [];
        bird.y = canvas.height / 2;
        score = 0;
        bird.velocity = 0;
        gameRunning = true;
        frame = 0;
        cancelAnimationFrame(animationFrameId);  // Batalkan frame yang sedang berjalan
        gameLoop();  // Memulai loop game lagi
    }, 2000);
}

canvas.addEventListener('click', function() {
    if (gameRunning) {
        bird.velocity += bird.lift;
    }
});

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        updateBird();
        drawPipes();
        updatePipes();
        handleCollision();
        ctx.fillStyle = 'black';
        ctx.font = "16px 'Press Start 2P'";  // Ukuran font dan font yang dipakai
        ctx.fillText(`Score: ${score}`, 10, 50);  // Posisi teks score
        frame++;
    }
    animationFrameId = requestAnimationFrame(gameLoop);  // Simpan ID frame
}

gameLoop();
