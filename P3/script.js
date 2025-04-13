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

const launcher = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    w: 50,
    h: 80,
    direccion: '',
    misiles: []
};

//  EVENTOS DE TECLADO
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

//  FUNCIÓN DE DISPARO
function disparar() {
    launcher.misiles.push({
        x: launcher.x + launcher.w / 2 - 2,
        y: launcher.y,
        w: 4,
        h: 10
    });
}

//  LOOP PRINCIPAL DE DIBUJO Y ANIMACIÓN
function draw() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);


    // Dibujar nave
    ctx.drawImage(naveImage, launcher.x, launcher.y, launcher.w, launcher.h);
    ctx.fillRect(launcher.x, launcher.y, launcher.w, launcher.h);

    // Mover nave
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
        if (m.y < 0) {
            launcher.misiles.splice(i, 1);
            i--; // Ajustar el índice al eliminar
        }
    }

    requestAnimationFrame(draw);
}

// Iniciar animación
draw();
