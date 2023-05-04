const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const status = document.getElementById("status");

const socket = io();

socket.on("connect", () => {
  status.innerHTML = "Conectado";
});

socket.on("disconnect", () => {
  status.innerHTML = "Desconectado";
  display.innerHTML = "¡SERVIDOR DESCONECTADO!";
});

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

socket.on("nuevoCliente", (msg) => {
  display.innerHTML += '<p style="color:green">' + msg + '</p>';
});

msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  msg_entry.value = "";
};
