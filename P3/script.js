const canvas = document.getElementById('my_canvas');
const ctx = canvas.getContext('2d');

// Cargar imágenes
const backgroundImage = new Image();
const naveImage = new Image();
const enemiespic1 = new Image();
const explosionImage = new Image();



backgroundImage.src = "background.jpg";
naveImage.src = "nave_rosa.png";
enemiespic1.src = "enemigos_rosa.png";
explosionImage.src = "explosion.png";

// Cargar sonidos
const disparoAudio = new Audio('disparo.mp3');
const explosionAudio = new Audio('explosion.mp3');

// Nave del jugador
const launcher = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    w: 50,
    h: 80,
    direccion: '',
    misiles: []
};

let score = 0;
let gameOver = false;
let victory = false;

// Crear enemigos
let enemigos = [];
let enemyWidth = 50;
let enemyHeight = 50;
let rows = 3;
let cols = 8;
let enemySpeed = 1;
let enemyDirection = 1;
let explosiones = []; // {x, y, frame}


for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        enemigos.push({
            x: j * (enemyWidth + 10) + 50,
            y: i * (enemyHeight + 10) + 50,
            w: enemyWidth,
            h: enemyHeight,
            alive: true
        });
    }
}

// Eventos de teclado
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
        launcher.direccion = 'Izquierda';
    } else if (event.code === 'ArrowRight') {
        launcher.direccion = 'Derecha';
    } else if (event.code === 'Space') {
        disparar();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        launcher.direccion = '';
    }
});

// Botones táctiles
document.getElementById('Izquierda').addEventListener('mousedown', () => launcher.direccion = 'Izquierda');
document.getElementById('Derecha').addEventListener('mousedown', () => launcher.direccion = 'Derecha');
document.getElementById('Disparar').addEventListener('click', disparar);
document.getElementById('Izquierda').addEventListener('mouseup', () => launcher.direccion = '');
document.getElementById('Derecha').addEventListener('mouseup', () => launcher.direccion = '');

// Disparo
function disparar() {
    if (gameOver || victory) return;
    launcher.misiles.push({
        x: launcher.x + launcher.w / 2 - 2,
        y: launcher.y,
        w: 4,
        h: 10
    });
    disparoAudio.currentTime = 0;
    disparoAudio.play();
}

// Dibujo y animación
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    if (victory) {
        ctx.fillStyle = 'green';
        ctx.font = '30px Arial';
        ctx.fillText('¡VICTORIA!', canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    // Dibujar nave
    ctx.drawImage(naveImage, launcher.x, launcher.y, launcher.w, launcher.h);

    // Movimiento de la nave
    if (launcher.direccion === 'Izquierda' && launcher.x > 0) {
        launcher.x -= 5;
    } else if (launcher.direccion === 'Derecha' && launcher.x + launcher.w < canvas.width) {
        launcher.x += 5;
    }

    // Misiles
    ctx.fillStyle = 'red';
    for (let i = 0; i < launcher.misiles.length; i++) {
        const m = launcher.misiles[i];
        ctx.fillRect(m.x, m.y, m.w, m.h);
        m.y -= 10;

        // Eliminar si sale de canvas
        if (m.y < 0) {
            launcher.misiles.splice(i, 1);
            i--;
        }

        // Colisión con enemigos
        for (let j = 0; j < enemigos.length; j++) {
            const enemy = enemigos[j];
            if (enemy.alive && m.x < enemy.x + enemy.w && m.x + m.w > enemy.x && m.y < enemy.y + enemy.h && m.y + m.h > enemy.y) {
                enemy.alive = false;
                explosiones.push({
                    x: enemy.x,
                    y: enemy.y,
                    frame: 0
                });
                launcher.misiles.splice(i, 1);
                i--;
                score += 10;
                explosionAudio.currentTime = 0;
                explosionAudio.play();
                enemySpeed += 0.05;
                checkVictory();
                break;
            }
        }
    }

    // Movimiento de enemigos
    let shouldChangeDirection = false;
    for (let i = 0; i < enemigos.length; i++) {
        const enemy = enemigos[i];
        if (!enemy.alive) continue;
        enemy.x += enemySpeed * enemyDirection;
        if (enemy.x + enemy.w >= canvas.width || enemy.x <= 0) {
            shouldChangeDirection = true;
        }
    }

    if (shouldChangeDirection) {
        enemyDirection *= -1;
        for (let i = 0; i < enemigos.length; i++) {
            enemigos[i].y += 20;
        }
    }

    // Dibujar enemigos
    for (let i = 0; i < enemigos.length; i++) {
        const enemy = enemigos[i];
        if (enemy.alive) {
            ctx.drawImage(enemiespic1, enemy.x, enemy.y, enemy.w, enemy.h);
        }
    }
    for (let i = 0; i < explosiones.length; i++) {
        const ex = explosiones[i];
        ctx.drawImage(explosionImage, ex.x, ex.y, 50, 50);
        ex.frame++;

        if (ex.frame > 15) {
            explosiones.splice(i, 1);
            i--;
        }
    }


    // Colisión con el jugador (Game Over)
    for (let i = 0; i < enemigos.length; i++) {
        const enemy = enemigos[i];
        if (enemy.alive && enemy.y + enemy.h >= launcher.y) {
            gameOver = true;
            break;
        }
    }

    // Mostrar puntuación
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuación: ' + score, 10, 30);

    requestAnimationFrame(draw);
}

function checkVictory() {
    const allDead = enemigos.every(e => !e.alive);
    if (allDead) {
        victory = true;
    }
}

// Iniciar juego
draw();
