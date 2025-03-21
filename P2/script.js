const claveDiv = document.getElementById('clave');
const intentosSpan = document.getElementById('intentos');
const tiempoSpan = document.getElementById('tiempo'); // Aquí usaremos Crono
const botonesDiv = document.getElementById('botones');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');

let clave = [];
let descubiertos = [];
let intentos = 10;
let iniciado = false;

// Crear instancia del cronómetro
const crono = new Crono(tiempoSpan);

// Crear botones 0-9
for (let i = 0; i <= 9; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.onclick = () => comprobarNumero(i);
    botonesDiv.appendChild(btn);
}

// Generar nueva clave
function nuevaClave() {
    clave = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
    descubiertos = [false, false, false, false];
    intentos = 10;
    iniciado = false;
    crono.stop();
    crono.reset();
    actualizarVista();
}

// Mostrar clave, intentos
function actualizarVista() {
    claveDiv.innerHTML = clave.map((n, i) =>
        descubiertos[i] ? `<span class="acertado">${n}</span>` : `<span class="oculto">*</span>`
    ).join(' ');
    intentosSpan.textContent = intentos;
}

// Comprobar número pulsado
function comprobarNumero(num) {
    if (!iniciado) {
        crono.start();
        iniciado = true;
    }

    let acierto = false;
    clave.forEach((n, i) => {
        if (n === num && !descubiertos[i]) {
            descubiertos[i] = true;
            acierto = true;
        }
    });

    if (!acierto) intentos--;

    actualizarVista();

    if (descubiertos.every(Boolean)) {
        crono.stop();
        alert('¡Ganaste!');
        nuevaClave();
    } else if (intentos === 0) {
        alert('¡Sin intentos! Reiniciando...');
        nuevaClave();
    }
}

// Botones control
startBtn.onclick = () => crono.start();
stopBtn.onclick = () => crono.stop();
resetBtn.onclick = () => nuevaClave();

// Inicializar
nuevaClave();
