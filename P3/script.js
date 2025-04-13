const canvas = document.getElementById('my_canvas');
const ctx = canvas.getContext('2d');

// Cargar imágenes
const backgroundImage = new Image();
const naveImage = new Image();
const enemiespic1 = new Image();
const enemiespic2 = new Image();

backgroundImage.src = "background.jpg";
naveImage.src = "nave_rosa.png";
enemiespic1.src = "enemigos_rosa.png";
enemiespic2.src = "enemigos_rosa.png";

// Inicializar variables
const launcher = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    w: 50,
    h: 80,
    direccion: '',
    misiles: []
};

let score = 0; // Puntuación inicial
let gameOver = false;
let victory = false;

// Crear enemigos
let enemigos = [];
let enemyWidth = 50;
let enemyHeight = 50;
let rows = 3;
let cols = 8;

// Inicializar enemigos
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

// Cargar sonidos
const disparoAudio = new Audio('disparo.mp3');
const explosionAudio = new Audio('explosion.mp3');

// Evento de teclado
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

// Función para disparar
function disparar() {
    if (gameOver || victory) return; // No dispara si el juego terminó
    launcher.misiles.push({
        x: launcher.x + launcher.w / 2 - 2,
        y: launcher.y,
        w: 4,
        h: 10
    });

    // Reproducir sonido de disparo
    disparoAudio.play();
}

// Dibujar y animar
function draw() {
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Dibujar la nave
    ctx.drawImage(naveImage, launcher.x, launcher.y, launcher.w, launcher.h);

    // Mover la nave
    if (launcher.direccion === 'Izquierda' && launcher.x > 0) {
        launcher.x -= 5;
    } else if (launcher.direccion === 'Derecha' && launcher.x + launcher.w < canvas.width) {
        launcher.x += 5;
    }

    // Dibujar y mover misiles
    ctx.fillStyle = 'red';
    for (let i = 0; i < launcher.misiles.length; i++) {
        const m = launcher.misiles[i];
        ctx.fillRect(m.x, m.y, m.w, m.h);
        m.y -= 10;

        // Eliminar misil si se sale del canvas
        if (m.y < 0) {
            launcher.misiles.splice(i, 1);
            i--; // Ajustar índice
        }

        // Colisión con enemigos
        for (let j = 0; j < enemigos.length; j++) {
            const enemy = enemigos[j];
            if (enemy.alive && m.x < enemy.x + enemy.w && m.x + m.w > enemy.x && m.y < enemy.y + enemy.h && m.y + m.h > enemy.y) {
                // Colisión detectada
                enemy.alive = false;
                launcher.misiles.splice(i, 1); // Eliminar el misil
                score += 10; // Aumentar puntuación
                explosionAudio.play(); // Reproducir sonido de explosión
                checkVictory(); // Comprobar si se han destruido todos los enemigos
                break;
            }
        }
    }

    // Dibujar enemigos
    for (let i = 0; i < enemigos.length; i++) {
        const enemy = enemigos[i];
        if (enemy.alive) {
            ctx.drawImage(enemiespic1, enemy.x, enemy.y, enemy.w, enemy.h);
        }
    }

    // Verificar si algún enemigo llegó al fondo
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

    requestAnimationFrame(draw); // Llamada recursiva para continuar con la animación
}

// Comprobar si todos los enemigos han sido destruidos
function checkVictory() {
    let allDead = true;
    for (let i = 0; i < enemigos.length; i++) {
        if (enemigos[i].alive) {
            allDead = false;
            break;
        }
    }
    if (allDead) {
        victory = true;
    }
}

// Iniciar el juego
draw();
