const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const menu = document.getElementById("menu");
const backBtn = document.getElementById("back-to-menu-btn");

let gameRunning = false;
let controlMethod = 'keyboard';
let difficulty = 'easy';

const colors = { ball: "#FF1493", paddle: "#FF69B4", net: "#FFB6C1", text: "#C71585", speedLabel: "#d14789" };

const ball = { x: 600, y: 300, radius: 12, speed: 8, velocityX: 8, velocityY: 8 };
const user = { x: 10, y: 240, width: 15, height: 120, score: 0, dy: 0 };
const com = { x: 1175, y: 240, width: 15, height: 120, score: 0, speed: 0.06 };

function setDiff(lvl, btn) {
    difficulty = lvl;
    const btns = btn.parentElement.querySelectorAll('.choice');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (lvl === 'easy') { ball.speed = 7; com.speed = 0.05; }
    if (lvl === 'medium') { ball.speed = 10; com.speed = 0.11; }
    if (lvl === 'hard') { ball.speed = 14; com.speed = 0.17; }
}

function setControl(mode, btn) {
    controlMethod = mode;
    const btns = btn.parentElement.querySelectorAll('.choice');
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function startGame() {
    menu.style.display = "none";
    backBtn.style.display = "block";
    gameRunning = true;
    resetBall();
}

function showMenu() {
    menu.style.display = "flex";
    backBtn.style.display = "none";
    gameRunning = false;
}

function drawRect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.fill();
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 20) drawRect(canvas.width / 2 - 1, i, 2, 10, colors.net);
}

function drawText(text, x, y, size = "70px", color = colors.text) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size} Arial`;
    ctx.fillText(text, x, y);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    let currentSpeed = (difficulty === 'hard') ? 14 : (difficulty === 'medium' ? 10 : 7);
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * currentSpeed;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * currentSpeed;
    ball.speed = currentSpeed;
}

function update() {
    if (!gameRunning) return;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (controlMethod === 'keyboard') { user.y += user.dy; }
    if (user.y < 0) user.y = 0;
    if (user.y > canvas.height - user.height) user.y = canvas.height - user.height;

    com.y += (ball.y - (com.y + com.height / 2)) * com.speed;
    if (com.y < 0) com.y = 0;
    if (com.y > canvas.height - com.height) com.y = canvas.height - com.height;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.velocityY = -ball.velocityY;

    let player = (ball.x < canvas.width / 2) ? user : com;
    if (player.x < ball.x + ball.radius && player.y < ball.y + ball.radius &&
        player.x + player.width > ball.x - ball.radius && player.y + player.height > ball.y - ball.radius) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.5;
    }

    if (ball.x - ball.radius < 0) { com.score++; resetBall(); }
    else if (ball.x + ball.radius > canvas.width) { user.score++; resetBall(); }
}

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") { user.score = 0; com.score = 0; resetBall(); }
    if (controlMethod === 'keyboard') {
        if (e.key === "ArrowUp" || e.key === "w") user.dy = -12;
        if (e.key === "ArrowDown" || e.key === "s") user.dy = 12;
    }
});

window.addEventListener("keyup", () => { user.dy = 0; });

canvas.addEventListener("mousemove", (e) => {
    if (controlMethod === 'mouse' && gameRunning) {
        let rect = canvas.getBoundingClientRect();
        let scaleY = canvas.height / rect.height;
        user.y = (e.clientY - rect.top) * scaleY - user.height / 2;
    }
});

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#ffe4e1");
    drawNet();
    drawText(user.score, 300, 100);
    drawText(com.score, 900, 100);
    drawText(`Speed: ${ball.speed.toFixed(1)}`, canvas.width / 2 - 85, 50, "25px", colors.speedLabel);
    drawRect(user.x, user.y, user.width, user.height, colors.paddle);
    drawRect(com.x, com.y, com.width, com.height, colors.paddle);
    drawArc(ball.x, ball.y, ball.radius, colors.ball);
}

setInterval(() => { update(); render(); }, 1000 / 60);
