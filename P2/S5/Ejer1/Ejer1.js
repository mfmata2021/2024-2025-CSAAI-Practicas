//-- Contador de clics de botón

console.log("Ejecutando JS...");

//-- Para acceder a los documentos del DOM
//-- Declaramos las variables extraídas del DOM como constantes, es decir que su valor no varía a lo largo de este código
const display = document.getElementById('display');
const boton = document.getElementById('boton');


//-- Let se usa para declarar variables que van a ser modificadas a lo largo del código
//-- Esta variable es el contador de clics 
let cont = 0;

//-- Manejador de clic, retrollamada del boton
boton.onclick = () => {
    console.log("Click!");

    //-- Cada vez que se haga click, aumentamos un valor del contador
    cont += 1;

    //-- Finalmente actualizamos el display
    display.innerHTML = cont;
}