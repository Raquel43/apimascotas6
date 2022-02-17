const divLista = document.querySelector("#lista-mascotas");
const divPaginacion = document.getElementById("paginacion");

let paginaActual = 1;
let filas = 5;
let id = 0;

let itemsTotales=[];

async function init() {
  for (i = 1; i <= 50; i++) {
    await cargarPokemonAsync(i);
  }

  mostrasLista(filas, paginaActual);
  crearBarraPaginacion(filas);
}

init();
async function cargarPokemonAsync(id) {
  let respuesta = await fetch(` const dominioAPI = "http://localhost:5000/mascotas";${id}`);
  data = await respuesta.json();
  itemsTotales.push(data);
}

// Mostrar lista de botones
function mostrasLista(filasPorPagina, pagina) {
  // Inicializar contenedor
  divLista.innerHTML = "";
  // Calculamos los items de la pagina
  let inicial = filasPorPagina * (pagina - 1); // restamos uno porque los array comienza por 0
  let final = inicial + filasPorPagina;
  // Sublista con los items de la página
  let itemsPagina = itemsTotales.slice(inicial, final);

  let habilidades = "";

  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((mascotaJSON) => {
       divLista.innerHTML += `
            <div id="mascota-${
              mascotaJSON.id
            }" class="card" style="width: 18rem;">
          <img src="${
            mascotaJSON.imagen
          }" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${mascotaJSON.titulo.toUpperCase()}</h5>
            <p class="card-text">Habilidades: ${habilidades}</p>
            <a href="#" class="btn btn-primary">Detalles</a>
          </div>
        </div>
            `;
  });
}

// Crear barrar de paginación
function crearBarraPaginacion(filasPorPagina) {
  divPaginacion.innerHTML = "";

  // Cálculo de páginas a mostrar
  let contadorPaginas = Math.ceil(itemsTotales.length / filasPorPagina);
  // Creación de un botón por página
  for (let i = 1; i <= contadorPaginas; i++) {
    // Por cada página creamos un botón
    let btn = crearBotonPaginacion(i);
    divPaginacion.appendChild(btn);
  }
}

// Crear el objeto botón con la acción a ejecutar
function crearBotonPaginacion(pagina) {
  // Creación elemento HTML botón
  let button = document.createElement("button");
  button.innerText = pagina;
  // Mostramos el botón activado si coincide con la página actual
  if (paginaActual == pagina) button.classList.add("active");

  // Acción a ejecutar en el evento click del botón
  button.addEventListener("click", function () {
    paginaActual = pagina; // Actualizamos la página a ver
    mostrasLista(filas, paginaActual); // Mostar datos de la página

    // Desactivar botón activo actual
    let botonActual = document.querySelector(".pagenumbers button.active");
    botonActual.classList.remove("active");
    // Activar botón del click
    button.classList.add("active");
  });

  return button;
}
