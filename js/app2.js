/* import {
  url,
  getImagen,
  insertarUsuario,
} from "../mascotas-frontend/js/MascotaForm.js"; */

const dominioAPI = "http://localhost:8080/api";

const admin = document.querySelector("#admin");
const divLista = document.querySelector("#tarjetas");
const divPaginacion = document.getElementById("paginacion");
const informacion = document.getElementById("info");
const mostrarMapa = document.getElementById("localizacion");
const botonEnviar = document.getElementById("enviar");
const botonEnviarM = document.getElementById("enviar1");
const formulario = document.getElementById("contactForm");
let perroSeleccionado = document.getElementById("perro");
let gatoSeleccionado = document.getElementById("gato");
let otroSeleccionado = document.getElementById("otro");
const vistaTotal = document.querySelector("#tarjetas");
const vistaDetalle = document.querySelector("#vista-mascota");
const filtroTipo = document.querySelector("#filtro-tipo");
const botonRegistro = document.querySelector("#btn-registro");
const botonSesion = document.querySelector("#btn-inciar-sesion");
const insertarUser = document.querySelector("#enviarForm");
const sesion = document.querySelector("#btn-inciar-sesion");
const cerrar = document.querySelector("#btn-cerrar-sesion");

let paginaActual = 1;
let filas = 8;
let i = 0;
let itemsTotales = [];
let usuariosTotales = [];
let nuevoUsuario = {};
let itemsTotalesUser = [];

/* document.addEventListener("DOMContentLoaded", () => {
  animacion();
});

function animacion() {
  let animation = anime({
    targets: ".letter",
    opacity: 1,
    translateY: 50,
    rotate: {
      value: 360,
      duration: 2000,
      easing: "easeInExpo",
    },
    scale: anime.stagger([0.7, 1], { from: "center" }),
    delay: anime.stagger(100, { start: 1000 }),
    translateX: [-10, 30],
  });
} */

async function init() {
  $("#tarjetas").show();

  //vistaDetalle.style.visibility = "visible";
  $("#vista-mascota").hide();
  await cargarMascotaAsync();
  await cargarUsuarioAsync();

  mostrasLista(filas, paginaActual);
  crearBarraPaginacion(filas);
  admin.addEventListener("click", Admin);
  informacion.addEventListener("click", informacionUsuario);
  mostrarMapa.addEventListener("click", mapa);
  botonEnviar.addEventListener("click", insertarFormulario);
  botonEnviarM.addEventListener("click", insertarFormulario1);
  filtroTipo.addEventListener("click", FiltroTipo);
  sesion.addEventListener("click", InicioSesion);
  cerrar.addEventListener("click", cerrarSesion);
  //insertarUser.addEventListener("click", insertarUsuario);
}

init();

function Registro() {}

async function cargarMascotaAsync() {
  await fetch(`${dominioAPI}/mascotas`)
    .then((result) => result.json())
    .then((data) => {
      itemsTotales = data;
      //console.log(itemsTotales[id][index]);
    });
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

  console.log(itemsPagina);

  // Recorremos el bucle de los items a mostrar
  itemsPagina.forEach((mascota, index) => {
    //console.log(mascota);

    divLista.innerHTML += `
      <div id="${index + 1}" class="tarjeta mb-4" style="width: 20rem;">
      <img class="p-2" src="img/${
        mascota.imagen
      }" class="card-img-top" alt="...">
      <div class="cuerpo-tarjeta">
        <h5 class="card-title">${mascota.titulo}</h5>
        <p class="card-text">${mascota.description}</p>
        <a href="#" onclick="viewMascota(${
          mascota.id
        })" class="btn btn-primary">Adóptame</a>
      </div>
    </div> `;
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

function viewMascota(id) {
  // Recuperamos datos de la mascota
  fetch(dominioAPI + "/mascotas/" + id, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector("#id_mas").innerHTML = data.id;
      document.querySelector("#titulo_mas").innerHTML = data.titulo;
      document.querySelector("#description_mas").innerHTML = data.description;
      document.querySelector("#imagen_mas").src = "/img/" + data.imagen;
    })
    .catch((error) => console.log(error));
  // vistaTotal.style.visibility = "hidden";

  $("#tarjetas").hide();

  //vistaDetalle.style.visibility = "visible";
  $("#vista-mascota").show();
}

/* async function cargarUsuarioAsync() {
  await fetch(`${dominioAPI}/usuarios`)
    .then((result) => result.json())
    .then((data) => {
      usuariosTotales = data;
      console.log(usuariosTotales);
    });
} */

function mostrarAlert2() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "usuario no registrado o contraseña incorrecta",
    showConfirmButton: true,
    timer: 5000,
  });
}

async function Filtro() {
  const palabra = document.querySelector("#filtro-descripcion").value;
  await fetch(dominioAPI + "/mascotas/description/" + palabra)
    .then((result) => result.json())
    .then((data) => {
      if (data && data != "") populateMascotas(data);
      else {
        alert("No se encontró la palabra");
      }
    });
}

async function FiltroTipo(evento) {
  console.log(evento.target.textContent);

  const palabra = evento.target.textContent;

  await fetch(dominioAPI + "/mascotas/tipo/" + palabra)
    .then((result) => result.json())
    .then((data) => {
      if (data && data != "") populateMascotas(data);
      else {
        alert("No se encontró la palabra");
      }
    });
}
function populateMascotas(data) {
  divLista.innerHTML = "";
  data.forEach((mascota) => {
    divLista.innerHTML += `
  <div class="tarjeta mb-4" style="width: 20rem;">
  <img class="p-2" src="img/${mascota.imagen}" class="card-img-top" alt="...">
  <div class="cuerpo-tarjeta">
    <h5 class="card-title">${mascota.titulo}</h5>
    <p class="card-text">${mascota.description}</p>
    <a href="#"  onclick="viewMascota(${mascota.id})" class="btn btn-primary">Adóptame</a>
  </div>
</div> `;
  });
}

// Insertar usuario desde el index
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
  await fetch(`${dominioAPI}/usuarios`)
    .then((result) => result.json())
    .then((data) => {
      itemsTotalesUser = data;
      console.log(itemsTotalesUser);
    });
}

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

function mostrarAlerRegistro() {
  Swal.fire({
    position: "center",
    icon: "info",
    title: "Gracias por registrarse!",
    showConfirmButton: true,
    timer: 5000,
  });
}

function mostrarAlertPass() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Las contraseñas no coinciden",
    showConfirmButton: true,
    timer: 5000,
  });
}

function validarPassword() {
  primerPassword = document.getElementById("pass").value;
  segundoPassword = document.getElementById("reg-password2").value;
  if (primerPassword != segundoPassword) {
    mostrarAlertPass();
  } else {
    true;
  }
}

function checkUsuario() {
  let nombre = document.getElementById("name").value;
  let Papellido = document.getElementById("Papellido").value;
  let email = document.getElementById("mail").value;
  let password = document.getElementById("pass").value;
  //comprobar si algun campo esta vacio
  if (nombre == "" || Papellido == "" || email == "" || password == "") {
    mostrarAlertDatos();
    return false;
  } else {
    return true;
  }
}

function insertarUsuario() {
  let usuarioData = {
    name: document.querySelector("#name").value,
    PrimerApellido: document.querySelector("#Papellido").value,
    SegundoApellido: document.querySelector("#Sapellido").value,
    mail: document.querySelector("#mail").value,
    pass: document.querySelector("#pass").value,
    imagen: getImagen(),
  };

  if (checkUsuario() && validarPassword()) {
    fetch(`${dominioAPI}/usuarios`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    })
      .then((response) => {
        response.json();
        $("#modalRegistro1").modal("hide");
        mostrarAlerRegistro();

        //www.iteramos.com/pregunta/35659/como-ocultar-el-modal-bootstrap-de-javascript
        init();
      })
      .then((response) => console.log(response))
      .catch((error) => error);
  }
}

function Admin() {
  let usuarios = itemsTotalesUser;
  console.log("Estos son mis usuarios", usuarios);
  Swal.fire({
    title: "Acceso",
    html: `<input type="text" id="login" class="swal2-input" placeholder="Usuario">
    <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
    confirmButtonText: "Acceder al Panel",
    focusConfirm: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector("#login").value;
      const password = Swal.getPopup().querySelector("#password").value;
      let usuario = usuarios.find((user) => user.name == login);
      if (!login || !password) {
        Swal.showValidationMessage(
          `Por favor, introduzca usuario y contraseña`
        );
      } else if (usuario && usuario.pass == password) {
        nuevoUsuario = usuario;
        console.log(nuevoUsuario);
        let permiso = usuario.roles.find(
          (role) => role.nombre == "Administrador" || role.nombre == "Editor"
        );

        if (permiso) {
          saveUserInStorage();
          alert("validación correcta");

          window.location.assign("../mascotas-frontend/mascotas-form.html");
        } else {
          alert("No tienes permisos");
        }
      } else {
        mostrarAlert2();
      }
    },
  });
} /* else {
    let usuario = itemsTotalesUser.find((user) => user.name);
    let permiso = usuario.roles.find(
      (role) => role.nombre == "Administrador" || role.nombre == "Editor"
    );

    if (permiso) {
      saveUserInStorage();
      alert("validación correcta");

      window.location.assign("../mascotas-frontend/mascotas-form.html");
    } else {
      alert("No tienes permisos");
    }
  } */

function InicioSesion() {
  let usuarios = itemsTotalesUser;
  console.log("Estos son mis usuarios", usuarios);
  Swal.fire({
    title: "Acceso",
    html: `<input type="text" id="login" class="swal2-input" placeholder="Usuario">
    <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
    confirmButtonText: "Acceder al Panel",
    focusConfirm: false,
    preConfirm: () => {
      const login = Swal.getPopup().querySelector("#login").value;
      const password = Swal.getPopup().querySelector("#password").value;
      let usuario = usuarios.find((user) => user.name == login);
      if (!login || !password) {
        Swal.showValidationMessage(
          `Por favor, introduzca usuario y contraseña`
        );
      } else if (usuario && usuario.pass == password) {
        nuevoUsuario = usuario;
        saveUserInStorage();
        alert("validación correcta");
        sesion.innerHTML = `<p id="user"><img src="${usuario.imagen}">&nbsp;${usuario.name}</p>`;
        console.log(nuevoUsuario);
      } else {
        mostrarAlert2();
      }
    },
  });
}

function cerrarSesion() {
  sessionStorage.removeItem("user");
  sesion.innerHTML = "Iniciar Sesión";
}

function saveUserInStorage() {
  // Comprovar en primer lloc si l'objecte Storage es troba definit al motor del navegador
  if (typeof Storage == "undefined") {
    alert("sessionStorage no soportado por el navegador");
  } else {
    sessionStorage.setItem("user", JSON.stringify(nuevoUsuario));
  }

  console.log("Datos guardados correctamente");
  //entrar();
}

function informacionUsuario() {
  Swal.fire({
    position: "center",
    icon: "info",
    html: '<img src="img/perroGracioso.png">',
    title:
      "Si necesita más información, rellene el formulario de contacto o llame por télefono en horario de oficina, de lunes a viernes de 9 a 14 hrs",
    showConfirmButton: true,
  });
}

function mapa() {
  Swal.fire({
    position: "center",
    icon: "info",
    title: "Nos puedes encontrar aquí:",
    html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.1471270365987!2d2.6786244153726355!3d39.6464032794621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297eceb1a8fc1e3%3A0xc973c6495c361cc9!2sCam%C3%AD%20de%20Son%20Reus%2C%20Illes%20Balears!5e0!3m2!1ses!2ses!4v1622645159325!5m2!1ses!2ses" width="400" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
    showConfirmButton: true,
  });
}

function letrasMaximas() {
  let nombre = document.getElementById("nombre").value;
  if (nombre.length > 30) {
    alert("Nombre demasiado largo");
    return false;
  } else {
    return true;
  }
}

function checkFormulario() {
  let nombre = document.getElementById("nombre").value;
  let email = document.getElementById("email").value;
  let telefono = document.getElementById("telefono").value;
  let mensaje = document.getElementById("mensaje").value;
  //comprobar si algun campo esta vacio
  if (nombre == "" || email == "" || mensaje == "" || telefono == "") {
    mostrarAlertDatos();
    return false;
  } else {
    return true;
  }
}

function mostrarAlertDatos() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Faltan datos obligatorios",
    showConfirmButton: true,
    timer: 5000,
  });
}

function validarTelefono() {
  let valor = document.getElementById("telefono").value;
  if (isNaN(valor) || valor.length < 9 || valor.length > 15) {
    mostrarAlertTel();
    return false;
  } else {
    return true;
  }
}

//Alerta que se muestra si el telefono es incorrecto
function mostrarAlertTel() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Número de teléfono invalido",
    showConfirmButton: true,
    timer: 5000,
  });
}

function validarEmail(elemento) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

  if (!regex.test(elemento)) {
    mostrarAlertMail();
    return false;
  } else {
    return true;
  }
}

//La siguiente función muestra un alert si el email es incorrecto
function mostrarAlertMail() {
  Swal.fire({
    position: "center",
    icon: "error",
    title: "Email incorrecto",
    showConfirmButton: true,
    timer: 5000,
  });
}

function insertarFormulario() {
  let formularioData = {
    name: document.querySelector("#nombre").value,
    mail: document.querySelector("#email").value,
    telefono: document.querySelector("#telefono").value,
    mensaje: document.querySelector("#mensaje").value,
  };
  if (checkFormulario() && letrasMaximas() && validarTelefono()) {
    try {
      fetch(`${dominioAPI}/formularios`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formularioData),
      });
      mostrarAlertFormulario();
      formulario.reset();
    } catch (error) {
      if (typeof Promise) {
        alert("se ha producido un error");
      }
    }
  }
}

function mostrarAlertFormulario() {
  Swal.fire({
    position: "center",
    icon: "info",
    title:
      "Gracias por ponerse en contacto con nosotros, en breve le contestaremos!",
    showConfirmButton: true,
    timer: 5000,
  });
}

// Enviar formulario de la vista detalle

function checkFormulario() {
  let nombre = document.getElementById("nombre1").value;
  let email = document.getElementById("email1").value;
  let telefono = document.getElementById("telefono1").value;
  let mensaje = document.getElementById("mensaje1").value;
  //comprobar si algun campo esta vacio
  if (nombre == "" || email == "" || mensaje == "" || telefono == "") {
    mostrarAlertDatos();
    return false;
  } else {
    return true;
  }
}

function validarTelefono() {
  let valor = document.getElementById("telefono1").value;
  if (isNaN(valor) || valor.length < 9 || valor.length > 15) {
    mostrarAlertTel();
    return false;
  } else {
    return true;
  }
}

function insertarFormulario1() {
  let formularioData = {
    name: document.querySelector("#nombre1").value,
    mail: document.querySelector("#email1").value,
    telefono: document.querySelector("#telefono1").value,
    mensaje: document.querySelector("#mensaje1").value,
  };
  if (checkFormulario() && letrasMaximas() && validarTelefono()) {
    try {
      fetch(`${dominioAPI}/formularios`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formularioData),
      });
      mostrarAlertFormulario();
      formulario.reset();
    } catch (error) {
      if (typeof Promise) {
        alert("se ha producido un error");
      }
    }
  }
}
