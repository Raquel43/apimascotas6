const dominioAPI = "http://localhost:8080/api/mascotas";
const dominioAPIform = "http://localhost:8080/api/formularios";
const dominioAPIuser = "http://localhost:8080/api/usuarios";
const dominioAPIrol = "http://localhost:8080/api/rols";
const Mascotas = document.querySelector("#mascotas");
const Formularios = document.querySelector("#formularios");
const Usuarios = document.querySelector("#usuarios");
const selectRol = document.querySelector("#roles");

const divLista = document.querySelector("#head");
const divListaBody = document.querySelector("#body");
const divPaginacion = document.getElementById("paginacion");
let usuario = JSON.parse(sessionStorage.getItem("user"));

let permiso = usuario.roles.find((role) => role.nombre == "Editor");

let itemsTotalesRol = [];

let rol = "";
datosRoles = [];

let paginaActual = 1;
let filas = 3;

//PRINCIPIO JAVASCRIPT MASCOTAS
let itemsTotales = [];

async function init() {
  await cargarMascotaAsync();
  crearBarraPaginacionMascotas(filas);
  getUserFromStorage();
  Mascotas.addEventListener("click", init);
  Formularios.addEventListener("click", () => FORM(permiso));
  Usuarios.addEventListener("click", () => USERS(permiso));
  selectRol.addEventListener("change", capturarRol);
}

init();

async function cargarMascotaAsync() {
  await fetch(dominioAPI)
    .then((result) => result.json())
    .then((data) => {
      itemsTotales = data;
      mostrasListaMascotas(filas, paginaActual);
    });
}

function mostrasListaMascotas(filasPorPagina, pagina) {
  // Inicializar contenedor
  divListaBody.innerHTML = "";
  // Calculamos los items de la pagina
  let inicial = filasPorPagina * (pagina - 1); // restamos uno porque los array comienza por 0
  let final = inicial + filasPorPagina;
  // Sublista con los items de la página
  let itemsPagina = itemsTotales.slice(inicial, final);

  console.log(itemsPagina);
  divLista.innerHTML = `


  <tr>
     <th scope="col">#</th>
     <th scope="col">Tipo</th>
     <th scope="col">Título</th>
     <th scope="col">Descripción</th>
     <th scope="col">Edad</th>
     <th scope="col">Imagen</th>
     <th scope="col"><button onclick="nuevoMascota()" class="btn btn-success btn-sm"><i
              class="fas fa-plus" aria-hidden="true"></i></button> </th>
  </tr>
  
  
  
  `;
  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((mascota, index) => {
    divListaBody.innerHTML += `
   
      <tr>
      <th scope="row">${index}</th>
      <td>${mascota.tipo}</td>
      <td>${mascota.titulo}</td>
      <td>${mascota.description}</td>
      <td>${mascota.edad}</td>
      <td style="width:150px"><img src="../../img/${mascota.imagen}" width="100%"></td>
      <td>
          <span data-toggle="modal" data-target="#modal-edicion">
              <button onclick="editarMascota('${mascota.id}')" class="btn btn-success btn-sm" role="button" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          </span>
          <button onclick="confirmarBorrarMascota('${mascota.id}')" class="btn btn-success btn-sm" title="Eliminar"><i class="fas fa-trash" aria-hidden="true"></i></button>
      </td>
  </tr>
  `;
  });
}

function crearBarraPaginacionMascotas(filasPorPagina) {
  divPaginacion.innerHTML = "";

  // Cálculo de páginas a mostrar
  let contadorPaginas = Math.ceil(itemsTotales.length / filasPorPagina);
  // Creación de un botón por página
  for (let i = 1; i <= contadorPaginas; i++) {
    // Por cada página creamos un botón
    let btn = crearBotonPaginacionMascotas(i);
    divPaginacion.appendChild(btn);
  }
}

function crearBotonPaginacionMascotas(pagina) {
  // Creación elemento HTML botón
  let button = document.createElement("button");
  button.innerText = pagina;
  // Mostramos el botón activado si coincide con la página actual
  if (paginaActual == pagina) button.classList.add("active");

  // Acción a ejecutar en el evento click del botón
  button.addEventListener("click", function () {
    paginaActual = pagina; // Actualizamos la página a ver
    //coje el numero actual del boton(5-1)=4x3 que ha hecho click y de eso le resta la cantidad
    // de botones que hay a la izquierda hasta el botón que has hecho click

    mostrasListaMascotas(filas, paginaActual); // Mostar datos de la página

    // Desactivar botón activo actual
    let botonActual = document.querySelector(".pagenumbers button.active");
    botonActual.classList.remove("active");
    // Activar botón del click
    button.classList.add("active");
  });

  return button;
}

function insertarMascota() {
  let mascotaData = {
    tipo: document.querySelector("#tipo").value,
    titulo: document.querySelector("#titulo").value,
    description: document.querySelector("#description").value,
    edad: document.querySelector("#edad").value,
    imagen: document.querySelector("#imagen").value,
  };

  fetch(dominioAPI, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mascotaData),
  })
    .then((response) => {
      response.json();
      init();
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function modificaMascota() {
  let mascotaData = {
    id: document.querySelector("#id").value,
    tipo: document.querySelector("#tipo").value,
    titulo: document.querySelector("#titulo").value,
    description: document.querySelector("#description").value,
    edad: document.querySelector("#edad").value,
    imagen: document.querySelector("#imagen").value,
  };
  console.log("Datos a modificar", mascotaData);

  fetch(dominioAPI, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mascotaData),
  })
    .then((response) => {
      alert("Mascota modificada");
      response.json();
      init();
    })
    .catch((error) => {
      console.log(error);
    });
}

function editarMascota(id) {
  // Recuperamos datos del mascota y configuramos los datos en el formulario
  fetch(`${dominioAPI}/${id}`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#id").value = data.id;
      document.querySelector("#tipo").value = data.tipo;
      document.querySelector("#titulo").value = data.titulo;
      document.querySelector("#description").value = data.description;
      document.querySelector("#edad").value = data.edad;
      document.querySelector("#imagen").value = data.imagen;
      myModal1.show();
    })
    .catch((error) => {
      console.log(error);
    });
}

function confirmarBorrarMascota(id) {
  Swal.fire({
    title: "¿De verdad quieres Borrar?",
    icon: "question",
    confirmButtonText: "Seleccionar",
    showCancelButton: true,
    cancelButtonText: "No quiero borrar",
    stopKeydownPropagation: true,
  }).then((resultado) => {
    if (resultado.value) {
      eliminarMascota(id);
    }
  });
}
function eliminarMascota(id) {
  fetch(dominioAPI + id, { method: "DELETE" })
    .then((response) => {
      //response.json();
      init();
      Swal.fire({
        title: "Mascota eliminada con éxito",
      });
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function guardarMascota() {
  const id = document.querySelector("#id").value;
  if (id == "") insertarMascota();
  else modificaMascota(id);

  myModal1.hide();
}

function nuevoMascota() {
  document.querySelector("#id").value = "";
  document.querySelector("#form-data-mascota").reset();
  myModal1.show();
}

// FIN PARTE JAVASCRIPT MASCOTAS

// PRINCIPIO PARTE FORMULARIOS
let paginaActualForm = 1;
let filasForm = 6;

let Totales = [];

async function FORM(editor) {
  if (!editor) {
    await cargarFormularioAsync();
    crearBarraPaginacionForm(filasForm);
  } else {
    alert("No tienes permisos suficientes");
  }
}

async function cargarFormularioAsync() {
  await fetch(dominioAPIform)
    .then((result) => result.json())
    .then((data) => {
      Totales = data;
      console.log("Estos son los datos del formulario", Totales);
      mostrasListaForm(filasForm, paginaActualForm);
    });
}

function mostrasListaForm(filasPorPagina, pagina) {
  // Inicializar contenedor
  divListaBody.innerHTML = "";
  // Calculamos los items de la pagina
  let inicial = filasPorPagina * (pagina - 1); // restamos uno porque los array comienza por 0
  let final = inicial + filasPorPagina;
  // Sublista con los items de la página
  let itemsPagina = Totales.slice(inicial, final);

  console.log(itemsPagina);

  divLista.innerHTML = `
  <tr>
    <th scope="col">#</th>
    <th scope="col">Nombre</th>
    <th scope="col">Email</th>
    <th scope="col">Telefono</th>
    <th scope="col">Mensaje</th>

    <th scope="col"><button onclick=" nuevoFormulario()" class="btn btn-success btn-sm"><i
    class="fas fa-plus" aria-hidden="true"></i></button> </th>
    </tr>
  
  
  `;

  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((formulario, index) => {
    //console.log(formulario);
    divListaBody.innerHTML += `
      <tr>
      <th scope="row">${index + 1}</th>
      <td>${formulario.name}</td>
      <td>${formulario.mail}</td>
      <td>${formulario.telefono}</td>
      <td>${formulario.mensaje}</td>
      <td>
          <span data-toggle="modal" data-target="#modal-edicion">
              <button onclick="editarFormulario('${
                formulario.id
              }')" class="btn btn-success btn-sm" role="button" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          </span>
          <button onclick="confirmarBorrarForm('${
            formulario.id
          }')" class="btn btn-success btn-sm" title="Eliminar"><i class="fas fa-trash" aria-hidden="true"></i></button>
      </td>
  </tr>
              `;
  });
}

function crearBarraPaginacionForm(filasPorPagina) {
  divPaginacion.innerHTML = "";

  // Cálculo de páginas a mostrar
  let contadorPaginas = Math.ceil(Totales.length / filasPorPagina);
  // Creación de un botón por página
  for (let i = 1; i <= contadorPaginas; i++) {
    // Por cada página creamos un botón
    let btn = crearBotonPaginacionForm(i);
    divPaginacion.appendChild(btn);
  }
}

function crearBotonPaginacionForm(pagina) {
  // Creación elemento HTML botón
  let button = document.createElement("button");
  button.innerText = pagina;
  // Mostramos el botón activado si coincide con la página actual
  if (paginaActualForm == pagina) button.classList.add("active");

  // Acción a ejecutar en el evento click del botón
  button.addEventListener("click", function () {
    paginaActualForm = pagina; // Actualizamos la página a ver
    mostrasListaForm(filasForm, paginaActualForm); // Mostar datos de la página

    // Desactivar botón activo actual
    let botonActual = document.querySelector(".pagenumbers button.active");
    botonActual.classList.remove("active");
    // Activar botón del click
    button.classList.add("active");
  });

  return button;
}

function insertarFormulario() {
  let formularioData = {
    name: document.querySelector("#nombre").value,
    mail: document.querySelector("#email").value,
    telefono: document.querySelector("#telefono").value,
    mensaje: document.querySelector("#mensaje").value,
  };

  fetch(dominioAPIform, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formularioData),
  })
    .then((response) => {
      response.json();
      FORM();
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function modificaFormulario() {
  let formularioData = {
    id: document.querySelector("#id").value,
    name: document.querySelector("#nombre").value,
    mail: document.querySelector("#email").value,
    telefono: document.querySelector("#telefono").value,
    mensaje: document.querySelector("#mensaje").value,
  };
  console.log("Datos a modificar", formularioData);

  fetch(dominioAPIform, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formularioData),
  })
    .then((response) => {
      alert("Formulario modificado");
      response.json();
      FORM();
    })
    .catch((error) => {
      console.log(error);
    });
}

function editarFormulario(id) {
  // Recuperamos datos del formulario y configuramos los datos en el formulario
  fetch(`${dominioAPIform}/${id}`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#id").value = data.id;
      document.querySelector("#nombre").value = data.name;
      document.querySelector("#email").value = data.mail;
      document.querySelector("#telefono").value = data.telefono;
      document.querySelector("#mensaje").value = data.mensaje;
      myModal2.show();
    })
    .catch((error) => {
      console.log(error);
    });
}

function confirmarBorrarForm(id) {
  Swal.fire({
    title: "¿De verdad quieres Borrar?",
    icon: "question",
    confirmButtonText: "Seleccionar",
    showCancelButton: true,
    cancelButtonText: "No quiero borrar",
    stopKeydownPropagation: true,
  }).then((resultado) => {
    if (resultado.value) {
      eliminarFormulario(id);
    }
  });
}
function eliminarFormulario(id) {
  fetch(dominioAPIform + "/" + id, { method: "DELETE" })
    .then((response) => {
      //response.json();
      cargarFormularioAsync();
      Swal.fire({
        title: "Formulario eliminado con éxito",
      });
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function guardarFormulario() {
  const id = document.querySelector("#id").value;
  if (id == "") insertarFormulario();
  else modificaFormulario(id);

  myModal2.hide();
  FORM();
}

function nuevoFormulario() {
  document.querySelector("#id").value = "";
  document.querySelector("#form-data-formulario").reset();
  myModal2.show();
}

//FIN PARTE FORMULARIOS

//PRINCIPIO PARTE USUARIOS
let paginaActualUser = 1;
let filasUser = 6;

let itemsTotalesUser = [];

async function USERS(editor) {
  if (!editor) {
    await cargarUsuarioAsync();
    await cargarRolAsync();
    crearBarraPaginacionUser(filasUser);
  } else {
    alert("No tienes permisos suficientes");
  }
}

async function cargarRolAsync() {
  await fetch(dominioAPIrol)
    .then((result) => result.json())
    .then((data) => {
      itemsTotalesRol = data;
      console.log("roles", itemsTotalesRol);
      populateRol(itemsTotalesRol);
    });
}

function populateRol(Roles) {
  selectRol.innerHTML = "";
  Roles.forEach((rol) => {
    selectRol.innerHTML += `
    <option id="opt-${rol.id}" value="${rol.id}">${rol.nombre}</option>
    `;
  });
}

function capturarRol() {
  rol = document.getElementById("roles").value;
  alert(rol);
}

function capturarRoles(roles) {
  roles.forEach((rol) => {
    datosRoles.push(rol);
  });
}

//La siguiente constante es un array de rutas de las que saco la imagen de perfil
const url = [
  "https://thispersondoesnotexist.com/image",
  "https://thiscatdoesnotexist.com/",
  "https://thishorsedoesnotexist.com/",
  "https://source.unsplash.com/random",
  "http://placeimg.com/200/200/any",
  "https://loremflickr.com/320/240?random=1",
  "https://loremflickr.com/320/240?random=2",
  "https://loremflickr.com/320/240?random=3",
  "https://loremflickr.com/320/240?random=4",
  "https://loremflickr.com/320/240/dog",
  "https://loremflickr.com/g/320/240/paris",
  "https://loremflickr.com/320/240/brazil,rio",
  "https://loremflickr.com/320/240/paris,girl/all",
  "https://loremflickr.com/320/240",
  "../img/user.png",
];

async function cargarUsuarioAsync() {
  await fetch(dominioAPIuser)
    .then((result) => result.json())
    .then((data) => {
      itemsTotalesUser = data;
      mostrasListaUser(filasUser, paginaActualUser);
      console.log(itemsTotalesUser);
    });
}

//Función que comprueba si una ruta de imagen está al introducir nuevos usuarios
//y si está el nuevo usuario tendrá la siguiente imagen de la lista,
//sino el index se reinicia a 0.
function getImagen() {
  let usuarios = itemsTotalesUser;
  console.log("Estos son ", usuarios);
  let posicionUsuario = usuarios.length - 1;
  console.log("Este es mi penultimo usuario", posicionUsuario);
  let img = usuarios[posicionUsuario].imagen;
  console.log("Esta es mi imagen", img);
  let index = url.indexOf(img);
  console.log("Mi imagen esta en", index);

  if (index == url.length - 1 || index == -1) {
    index = 0;
  } else {
    index++;
  }
  return url[index];
}

function mostrasListaUser(filasPorPagina, pagina) {
  // Inicializar contenedor
  divListaBody.innerHTML = "";
  // Calculamos los items de la pagina
  let inicial = filasPorPagina * (pagina - 1); // restamos uno porque los array comienza por 0
  let final = inicial + filasPorPagina;
  // Sublista con los items de la página
  let itemsPagina = itemsTotalesUser.slice(inicial, final);

  console.log(itemsPagina);

  divLista.innerHTML = `
  <tr>
  <th scope="col">#</th>
  <th scope="col">Imagen</th>
  <th scope="col">Nombre y apellidos</th>
  <th scope="col">Email</th>
  <th scope="col">Rol</th>
  <th scope="col">Password</th>

  <th scope="col"><button onclick="nuevoUsuario()" class="btn btn-success btn-sm"><i
  class="fas fa-plus" aria-hidden="true"></i></button> </th>
</tr>
  
  
  `;

  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((usuario, index) => {
    divListaBody.innerHTML += `
<tr>
      <th scope="row">${index + 1}</th>
      <td width=10%><img src="${
        usuario.imagen
      }" style="border-radius: 100%" width=100%></td>
      <td width=5%>${usuario.name} ${usuario.primerApellido} 
        ${usuario.segundoApellido}</td>
      <td width=20%>${usuario.mail}</td>
      <td>${pintarRoles(usuario.roles)}</td>
      <td style="background-color: black; " ></td>
      <td>
          <span data-toggle="modal" data-target="#modal-edicion">
              <button onclick="editarUsuario('${
                usuario.id
              }')" class="btn btn-success btn-sm" role="button" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          </span>
          <button onclick="confirmarBorrarUser('${
            usuario.id
          }')" class="btn btn-success btn-sm" title="Eliminar"><i class="fas fa-trash" aria-hidden="true"></i></button>
      </td>
  </tr>
              `;
  });
}

//Función que captura el nombre del rol
function pintarRoles(roles) {
  let output = "";
  roles.forEach((rol) => {
    output += `${rol.nombre},`;
  });
  //Expresion regular, si en el ultimo texto hay una coma se reemplaza a vacio
  output = output.replace(new RegExp(",$"), "");
  return output;
}

function crearBarraPaginacionUser(filasPorPagina) {
  divPaginacion.innerHTML = "";

  // Cálculo de páginas a mostrar
  let contadorPaginas = Math.ceil(itemsTotalesUser.length / filasPorPagina);
  // Creación de un botón por página
  for (let i = 1; i <= contadorPaginas; i++) {
    // Por cada página creamos un botón
    let btn = crearBotonPaginacionUser(i);
    divPaginacion.appendChild(btn);
  }
}

function crearBotonPaginacionUser(pagina) {
  // Creación elemento HTML botón
  let button = document.createElement("button");
  button.innerText = pagina;
  // Mostramos el botón activado si coincide con la página actual
  if (paginaActualUser == pagina) button.classList.add("active");

  // Acción a ejecutar en el evento click del botón
  button.addEventListener("click", function () {
    paginaActualUser = pagina; // Actualizamos la página a ver
    mostrasListaUser(filasUser, paginaActualUser); // Mostar datos de la página

    // Desactivar botón activo actual
    let botonActual = document.querySelector(".pagenumbers button.active");
    botonActual.classList.remove("active");
    // Activar botón del click
    button.classList.add("active");
  });

  return button;
}

function conseguirRoles() {
  let optRoles = [];
  document.querySelectorAll("#roles option").forEach((opt) => {
    if (opt.selected) {
      let rol = {
        id: opt.value,
        nombre: opt.textContent,
      };
      optRoles.push(rol);
    }
  });
  return optRoles;
}

function insertarUsuario() {
  let usuarioData = {
    name: document.querySelector("#name").value,
    primerApellido: document.querySelector("#Papellido").value,
    segundoApellido: document.querySelector("#Sapellido").value,
    mail: document.querySelector("#mail").value,
    pass: document.querySelector("#pass").value,
    roles: conseguirRoles(),
    imagen: getImagen(),
  };
  console.log("Insertar", usuarioData);

  fetch(dominioAPIuser, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuarioData),
  })
    .then((response) => {
      response.json();
      USERS();
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function modificaUsuario() {
  let usuarioData = {
    id: document.querySelector("#id").value,
    name: document.querySelector("#name").value,
    primerApellido: document.querySelector("#Papellido").value,
    segundoApellido: document.querySelector("#Sapellido").value,
    mail: document.querySelector("#mail").value,
    pass: document.querySelector("#pass").value,
    roles: conseguirRoles(),
  };
  console.log("Datos a modificar", usuarioData);

  fetch(dominioAPIuser, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuarioData),
  })
    .then((response) => {
      alert("Usuario modificado", usuarioData);
      response.json();
      USERS();
    })
    .catch((error) => {
      console.log(error);
    });
}

function editarUsuario(id) {
  document.querySelectorAll("#roles option").forEach((opt) => {
    opt.selected = false;
  });
  // Recuperamos datos del usuario y configuramos los datos en el formulario
  fetch(`${dominioAPIuser}/${id}`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#id").value = data.id;
      document.querySelector("#name").value = data.name;
      document.querySelector("#Papellido").value = data.primerApellido;
      document.querySelector("#Sapellido").value = data.segundoApellido;
      document.querySelector("#mail").value = data.mail;
      document.querySelector("#pass").value = data.pass;
      document.querySelector("#imagen").value = data.imagen;
      data.roles.forEach((rol) => {
        document.querySelector(`#opt-${rol.id}`).selected = true;
      });
      myModal3.show();
    })
    .catch((error) => {
      console.log(error);
    });
}

function confirmarBorrarUser(id) {
  Swal.fire({
    title: "¿De verdad quieres Borrar?",
    icon: "question",
    confirmButtonText: "Seleccionar",
    showCancelButton: true,
    cancelButtonText: "No quiero borrar",
    stopKeydownPropagation: true,
  }).then((resultado) => {
    if (resultado.value) {
      eliminarUsuario(id);
    }
  });
}
function eliminarUsuario(id) {
  fetch(dominioAPIuser + "/" + id, { method: "DELETE" })
    .then((response) => {
      //response.json();
      cargarUsuarioAsync();
      Swal.fire({
        title: "Usuario eliminado con éxito",
      });
    })
    .then((response) => console.log(response))
    .catch((error) => error);
}

function guardarUsuario() {
  const id = document.querySelector("#id").value;
  if (id == "") insertarUsuario();
  else modificaUsuario(id);
  USERS();
  myModal3.hide();
}

function nuevoUsuario() {
  document.querySelector("#id").value = "";
  document.querySelector("#form-data-usuario").reset();
  myModal3.show();
}

function getUserFromStorage() {
  let container = document.getElementById("user");
  container.innerHTML = `<p><img src="${usuario.imagen}" width=15%>&nbsp;${usuario.name}</p>`;
}

/* function ShowSelected() {
  
  var cod = document.getElementById("roles").value;
  alert(cod);
} */
