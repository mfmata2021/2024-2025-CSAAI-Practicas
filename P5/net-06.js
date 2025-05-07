// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;

const nodeRadius = 20;
const numNodos = 5;
const nodeConnect = 2

// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");

// Clase para representar un nodo en el grafo
class Nodo {

    constructor(id, x, y, delay) {
        this.id = id; // Identificador del nodo
        this.x = x; // Coordenada X del nodo
        this.y = y; // Coordenada Y del nodo
        this.delay = delay; // Retardo del nodo en milisegundos
        this.conexiones = []; // Array de conexiones a otros nodos
    }

    // Método para agregar una conexión desde este nodo a otro nodo con un peso dado
    conectar(nodo, peso) {
        this.conexiones.push({ nodo, peso });
    }

}

// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {

    const nodos = [];
    let x = 0, y = 0, delay = 0;
    let nodoActual = 0, nodoAleatorio = 0, pickNode = 0, peso = 0;

    // Generamos los nodos
    for (let i = 0; i < numNodos; i++) {
        x = Math.random() * canvas.width; // Obtenemos un valor aleatorio para la coordenada x del nodo
        y = Math.random() * canvas.height; // Obtenemos un valor aleatorio para la coordenada y del nodo
        delay = generarRetardo(); // Retardo aleatorio para simular congestión
        nodos.push(new Nodo(i, x, y, delay)); // Generar un nuevo nodo y añadirlo a la lista de nodos de la red
    }

    // Conectamos los nodos
    for (let i = 0; i < numNodos; i++) {
        nodoActual = nodos[i];
        for (let j = 0; j < numConexiones; j++) {
            pickNode = Math.floor(Math.random() * numNodos);
            nodoAleatorio = nodos[pickNode];
            peso = Math.random() * 100; // Peso aleatorio para simular la distancia entre nodos
            nodoActual.conectar(nodoAleatorio, peso);
        }
    }

    return nodos;
}
// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
    return Math.random() * 1000;
}

// Dibujar la red en el canvas
function drawNet(nnodes) {
    // Dibujamos las conexiones entre nodos
    nnodes.forEach(nodo => {
        nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
            ctx.beginPath();
            ctx.moveTo(nodo.x, nodo.y);
            ctx.lineTo(conexion.x, conexion.y);
            ctx.stroke();
        });
    });

    // Dibujamos los nodos
    nnodes.forEach(nodo => {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(nodo.id, nodo.x, nodo.y + 5);
    });
}