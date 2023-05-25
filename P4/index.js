//-- Cargar el módulo de electron
const electron = require('electron');

const displays = document.getElementById("displays");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const ip = document.getElementById("ip");
const boton = document.getElementById("btn_test")
const nrClientes = document.getElementById("nrClientes");


info1.textContent = process.arch;
info2.textContent = process.platform;
info3.textContent = process.cwd();
info4.textContent = process.versions.node;
info5.textContent = process.versions.chrome;
info6.textContent = process.versions.electron;

boton.onclick = () => {
  console.log("Boton apretado");
  electron.ipcRenderer.invoke("boton","HOLA, PROBANDO...");
}

electron.ipcRenderer.on("ip",(event,mensaje) => {
  ip.innerHTML = mensaje + "/Chat.html";
  ip.href = mensaje + "/Chat.html";
});

electron.ipcRenderer.on("recibiendo",(event,mensaje) => {
  displays.innerHTML += mensaje + "</p>";
});

nrClientes.textContent = 0;
electron.ipcRenderer.on("nrClientes",(event,mensaje) => {
  nrClientes.textContent = mensaje;
});

