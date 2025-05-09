// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;
let numNodos;


function getRandomNumNodos() {
    return Math.floor(Math.random() * 3) + 3; // genera 3, 4 o 5
}


const nodeRadius = 40;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100; // No hay retardo entre nodos 100

// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");
const msgEstado = document.getElementById("msgEstado");
const msgNodos = document.getElementById("msgNodos");
const msgTiempo = document.getElementById("msgTiempo")


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

    // Método para saber si un nodo está en la lista de conexiones de otro
    isconnected(idn) {

        let isconnected = false;

        this.conexiones.forEach(({ nodo: conexion, peso }) => {
            if (idn == conexion.id) {
                //console.log("id nodo conectado:" + conexion.id);
                isconnected = true;
            }
        });

        return isconnected;
    }
    // Método para saber la distancia entre dos nodos
    node_distance(nx, ny) {

        var a = nx - this.x;
        var b = ny - this.y;

        return Math.floor(Math.sqrt(a * a + b * b));

    }
    // Método para encontrar el nodo más alejado
    far_node(nodos) {

        let distn = 0;
        let cnode = this.id;
        let distaux = 0;
        let pos = 0;
        let npos = 0;

        for (let nodo of nodos) {
            distaux = this.node_distance(nodo.x, nodo.y);

            if (distaux != 0 && distaux > distn) {
                distn = distaux;
                cnode = nodo.id;
                npos = pos;
            }

            pos += 1;
        }

        return { pos: npos, id: cnode, distance: distn, };

    }
    // Método para encontrar el nodo más cercano
    close_node(nodos) {

        let far_node = this.far_node(nodos);
        let cnode = far_node.id;
        let distn = far_node.distance;
        let distaux = 0;
        let pos = 0;
        let npos = 0;

        for (let nodo of nodos) {
            distaux = this.node_distance(nodo.x, nodo.y);

            if (distaux != 0 && distaux <= distn) {
                distn = distaux;
                cnode = nodo.id;
                npos = pos;
            }

            pos += 1;
        }

        return { pos: npos, id: cnode, distance: distn, }

    }

}

// Función para generar una red aleatoria con nodos en diferentes estados de congestión
// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {

    const nodos = [];
    let x = 0, y = 0, delay = 0;
    let nodoActual = 0, nodoAleatorio = 0, pickNode = 0, peso = 0;
    let bSpace = false;

    const xs = Math.floor(canvas.width / numNodos);
    const ys = Math.floor(canvas.height / 2);
    const xr = canvas.width - nodeRadius;
    const yr = canvas.height - nodeRadius;
    let xp = nodeRadius;
    let yp = nodeRadius;
    let xsa = xs;
    let ysa = ys;

    // Generamos los nodos
    for (let i = 0; i < numNodos; i++) {

        //var random_boolean = Math.random() < 0.5;
        if (Math.random() < 0.5) {
            yp = nodeRadius;
            ysa = ys;
        }
        else {
            yp = ys;
            ysa = yr;
        }

        x = randomNumber(xp, xsa); // Generar coordenada x aleatoria
        y = randomNumber(yp, ysa); // Generar coordenada y aleatoria

        xp = xsa;
        xsa = xsa + xs;

        if (xsa > xr && xsa <= canvas.width) {
            xsa = xr;
        }

        if (xsa > xr && xsa < canvas.width) {
            xp = nodeRadius;
            xsa = xs;
        }

        delay = generarRetardo(); // Retardo aleatorio para simular congestión
        nodos.push(new Nodo(i, x, y, delay)); // Generar un nuevo nodo y añadirlo a la lista de nodos de la red
    }

    // Conectamos los nodos usando los más cercanos
    for (let nodo of nodos) {
        const clonedArray = [...nodos];

        for (let j = 0; j < numConexiones; j++) {
            let close_node = nodo.close_node(clonedArray);

            if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
                nodo.conectar(clonedArray[close_node.pos], close_node.distance);
            }

            clonedArray.splice(close_node.pos, 1);
        }
    }

    return nodos;


}

// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
    return Math.random() * nodeRandomDelay;
}

// Generar un número aleatorio dentro de un rango
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Dibujar la red en el canvas
function drawNet(nnodes, ruta = []) {
    // Dibujamos las conexiones entre nodos
    nnodes.forEach(nodo => {
        nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
            ctx.beginPath();
            ctx.moveTo(nodo.x, nodo.y);
            ctx.lineTo(conexion.x, conexion.y);
            ctx.stroke();

            ctx.font = '12px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            pw = "N" + nodo.id + " pw " + peso;
            const midX = Math.floor((nodo.x + conexion.x) / 2);
            const midY = Math.floor((nodo.y + conexion.y) / 2);
            ctx.fillText(pw, midX, midY);

        });
    });

    let nodoDesc; // Descripción del nodo

    // Dibujar nodos
    nnodes.forEach(nodo => {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = ruta.find(n => n.id === nodo.id) ? 'green' : '#FF69B4';
        ctx.fill();
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`N${nodo.id} (${Math.floor(nodo.delay)} ms)`, nodo.x, nodo.y + 5);
    });
}

function getRandomNumNodos() {
    return Math.floor(Math.random() * 3) + 3;
}

// Función de calback para generar la red de manera aleatoria
btnCNet.onclick = () => {
    let numNodos = getRandomNumNodos();

    console.log("Generando red aleatoria...");
    // Generar red de nodos con congestión creada de manera aleatoria redAleatoria
    // Cada nodo tendrá un delay aleatorio para simular el envío de paquetes de datos
    redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);

    if (!redAleatoria || redAleatoria.length === 0) {
        msgEstado.textContent = "Error al generar la red."
    }

    console.log(redAleatoria);
    // Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la red que hemos generado
    drawNet(redAleatoria);

    msgEstado.textContent = "Red generada correctamente.";
    msgNodos.textContent = `Número de nodos: ${redAleatoria.length}`;
    msgTiempo.textContent = "Tiempo total de envío: 0 ms";

}


btnMinPath.onclick = () => {
    if (!redAleatoria || redAleatoria.length === 0) {
        msgEstado.textContent = "Primero, genera la red.";
        return;
    }

    // Supongamos que tienes una red de nodos llamada redAleatoria y tienes nodos origen y destino
    nodoOrigen = redAleatoria[0]; // Nodo de origen
    nodoDestino = redAleatoria[numNodos - 1]; // Nodo de destino

    // Calcular la ruta mínima entre el nodo origen y el nodo destino utilizando Dijkstra con retrasos
    rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
    console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);

    // Calcular tiempo total de retardo de la ruta
    let totalDelay = rutaMinimaConRetardos.reduce((acc, nodo) => acc + nodo.delay, 0);

    // Volvemos a dibujar todo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet(redAleatoria, rutaMinimaConRetardos);

    msgEstado.textContent = "Ruta mínima calculada correctamente.";
    msgTiempo.textContent = `Tiempo total de envío: ${Math.floor(totalDelay)} ms`;


}