//-- Cargar el módulo de electron
const electron = require('electron');

console.log("Arrancando electron...");

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', ()=>{
  win = new electron.BrowserWindow({
    width:640,
    height:380,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  console.log("Evento Ready!");
  win.loadFile("index.html");
  win.on('ready-to-show', () => {
    win.webContents.send('ip', 'http://' + ip.address() + ':' + PUERTO);
  });

  electron.ipcMain.handle("boton", async(event, mensaje) => {
    console.log(mensaje);
    io.send("Hola a todos", mensaje);
    win.webContents.send("recibiendo", "Hola a todos");
  }
  )
});

//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const ip = require('ip');

const PUERTO = 8080;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = new socketServer(server);


//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido al chat de GISAM' + '<p><a href="/Chat.html">EMPIEZA A CHATEAR</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('/'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **');

   // enviar mensaje de bienvenida al nuevo cliente
   socket.send("¡Bienvenido al chat de GISAM!");

   
  win.webContents.send("nrClientes",io.engine.clientsCount);

   // notificar a los demás clientes que un nuevo cliente se ha conectado
   socket.broadcast.emit("nuevoCliente", "¡Nuevo usuario conectado!");

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **');

    //-- Enviar mensaje de desconexion a todos los clientes conectados
  io.emit('disconectMessage', '** UN CLIENTE SE HA DESCONECTADO **');

  
  win.webContents.send("nrClientes",io.engine.clientsCount);
  });  

  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg);
  
    //-- Si el mensaje comienza con un "/", se interpreta como un comando
    if (msg.split("/")[1]) {
      //-- Separar el comando y los argumentos (si los hay)

      const comando = msg.split("/")[1];
      const argumento = msg.split(":")[0];


    switch(comando) {
      case "help":
        socket.send("Comandos disponibles: /help, /list, /hello, /date");
        break;
      case "list":
        socket.send("Número de usuarios conectados: " + io.engine.clientsCount);
        break;
      case "hello":
        const nombre = argumento || "desconocido"
        socket.send(`¡Hola! ¿Cómo estás ${nombre}?`);
        break;
      case "date":
        const date = new Date().toLocaleDateString();
        socket.send("La fecha actual es: " + date);
        break;

      default:
        socket.send("Comando desconocido. Inténtalo de nuevo.");
        break;
    }
    }else {
    //-- Reenviar mensaje a todos los clientes conectados
    io.send(msg);
    win.webContents.send("recibiendo", msg);
  }
  });
  
});
//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
