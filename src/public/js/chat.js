const inputMensaje = document.getElementById("mensaje");
const divMensajes = document.getElementById("mensajes");

//codigo de la libreria sweet alert
Swal.fire({
  title: "Identifiquese",
  input: "text",
  text: "Ingrese su nickname",
  inputValidator: (value) => {
    return !value && "Debe ingresar un nombre...!!!";
  },
  allowOutsideClick: false,
}).then((datos) => {
  let { value: nombre } = datos;
  if (nombre) {
    document.title = nombre;
  }
  inputMensaje.focus();
  const socket = io();

  socket.emit("id", nombre);

  socket.on("nuevoUsuario", (nombre) => {
    Swal.fire({
      text: `${nombre} se ha conectado...!!!`,
      toast: true,
      position: "top-right",
    });
  });

  socket.on("nuevoMensaje", (nombre, mensaje) => {
    let p = document.createElement("p");
    p.classList.add("mensaje");
    let s = document.createElement("strong");
    let sp = document.createElement("span");
    let i = document.createElement("i");

    s.textContent = nombre;
    sp.textContent = " dice ";
    i.textContent = mensaje;
    p.append(s, sp, i);
    divMensajes.append(p);
    divMensajes.scrollTop = divMensajes.scrollHeight;
  });

  socket.on("mensajesPrevios", (mensajes) => {
    mensajes.forEach((datos) => {
      let p = document.createElement("p");
      p.classList.add("mensaje");
      let s = document.createElement("strong");
      let sp = document.createElement("span");
      let i = document.createElement("i");

      s.textContent = datos.nombre;
      sp.textContent = " dice ";
      i.textContent = datos.mensaje;
      p.append(s, sp, i);
      divMensajes.append(p);
      divMensajes.scrollTop = divMensajes.scrollHeight;
    });
  });

  socket.on("saleUsuario", (nombre) => {
    let p = document.createElement("p");
    p.classList.add("mensaje");
    let s = document.createElement("strong");
    let sp = document.createElement("span");

    s.textContent = nombre;
    sp.textContent = " se ha retirado del server... :( ";
    p.append(s, sp);
    divMensajes.append(p);
    divMensajes.scrollTop = divMensajes.scrollHeight;
  });

  //creo un evento
  inputMensaje.addEventListener("keyup", (e) => {
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
      socket.emit("mensaje", nombre, e.target.value.trim());
      e.target.value = "";
      e.target.focus();
    }
  });
}); // fin then sa2
