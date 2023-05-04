const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const status = document.getElementById("status");

const socket = io();

socket.on("connect", () => {
  status.innerHTML = "Conectado";
});

socket.on("disconectMessage", (msg)=>{
  if (msg === '** UN CLIENTE SE HA DESCONECTADO **') {
    display.innerHTML += '<p style="color:red">' + msg + '</p>';
  } 
});

socket.on("disconnect", ()=> {
  display.innerHTML += '<p style="color:red">¡SERVIDOR DESCONECTADO!</p>';
  status.innerHTML = "Desconectado";
})

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

socket.on("nuevoCliente", (msg) => {
  display.innerHTML += '<p style="color:green">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  msg_entry.value = "";
};