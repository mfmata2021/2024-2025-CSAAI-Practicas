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

// Crear sonidos
const disparoSound = new Audio('disparo.mp3');
const explosionSound = new Audio('explosion.mp3');

// Caza estelar
const launcher = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    w: 50,
    h: 80,
    direccion: '',
    misiles: []
};

// Naves alienígenas
const aliens = [];
const alienRows = 3;
const alienCols = 8;
const alienWidth = 40;
const alienHeight = 40;

// Crear las naves alienígenas
for (let row = 0; row < alienRows; row++) {
    aliens[row] = [];
    for (let col = 0; col < alienCols; col++) {
        aliens[row][col] = {
            x: 50 + col * (alienWidth + 10),
            y: 50 + row * (alienHeight + 10),
            w: alienWidth,
            h: alienHeight,
            alive: true
        };
    }
}

// EVENTOS DE TECLADO
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

// EVENTOS DE BOTONES (ratón o táctil)
document.getElementById('Izquierda').addEventListener('mousedown', () => launcher.direccion = 'Izquierda');
document.getElementById('Derecha').addEventListener('mousedown', () => launcher.direccion = 'Derecha');
document.getElementById('Disparar').addEventListener('click', disparar);
document.getElementById('Izquierda').addEventListener('mouseup', () => launcher.direccion = '');
document.getElementById('Derecha').addEventListener('mouseup', () => launcher.direccion = '');

// FUNCIÓN DE DISPARO
function disparar() {
    disparoSound.play();
    launcher.misiles.push({
        x: launcher.x + launcher.w / 2 - 2,
        y: launcher.y,
        w: 4,
        h: 10
    });
}

// MOVER LAS NAVES ALIENÍGENAS
let alienDirection = 1; // 1 para mover a la derecha, -1 para mover a la izquierda

function moverAliens() {
    let changeDirection = false;
    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien.alive) {
                alien.x += alienDirection * 1; // Velocidad de movimiento de los alienígenas
                if (alien.x + alien.w > canvas.width || alien.x < 0) {
                    changeDirection = true;
                }
            }
        });
    });

    // Cambiar la dirección de movimiento cuando los alienígenas lleguen al borde
    if (changeDirection) {
        alienDirection *= -1;
        aliens.forEach(row => {
            row.forEach(alien => {
                alien.y += 10; // Descienden al cambiar de dirección
            });
        });
    }
}

// DETECTAR COLISIONES ENTRE LOS MISILES Y LOS ALIENÍGENAS
function detectarColisiones() {
    for (let i = 0; i < launcher.misiles.length; i++) {
        const m = launcher.misiles[i];
        aliens.forEach(row => {
            row.forEach(alien => {
                if (alien.alive && m.x < alien.x + alien.w && m.x + m.w > alien.x && m.y < alien.y + alien.h && m.y + m.h > alien.y) {
                    alien.alive = false;
                    launcher.misiles.splice(i, 1);
                    i--; // Ajustar el índice al eliminar el misil
                    explosionSound.play(); // Sonido de explosión
                }
            });
        });
    }
}

// DIBUJAR Y ANIMAR EL JUEGO
function draw() {
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
        m.y -= 10; // Velocidad de disparo
        if (m.y < 0) {
            launcher.misiles.splice(i, 1);
            i--; // Ajustar el índice al eliminar
        }
    }

    // Dibujar las naves alienígenas
    aliens.forEach(row => {
        row.forEach(alien => {
            if (alien.alive) {
                ctx.drawImage(enemiespic1, alien.x, alien.y, alien.w, alien.h); // Usamos la imagen del alien
            }
        });
    });

    // Mover las naves alienígenas
    moverAliens();

    // Detectar colisiones
    detectarColisiones();

    requestAnimationFrame(draw); // Bucle de animación
}

// Iniciar animación
draw();
