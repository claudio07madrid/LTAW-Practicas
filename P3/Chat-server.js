//-- Cargar las dependencias
const socketServer = require('socket.io').Server;
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9000;

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
  
  console.log('** NUEVA CONEXIÓN **'.yellow);

   // enviar mensaje de bienvenida al nuevo cliente
   socket.send("¡Bienvenido al chat de GISAM!");

   // notificar a los demás clientes que un nuevo cliente se ha conectado
   socket.broadcast.emit("nuevoCliente", "¡Nuevo usuario conectado!");

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);

    //-- Enviar mensaje de desconexion a todos los clientes conectados
  io.emit('disconectMessage', '** UN CLIENTE SE HA DESCONECTADO **');
  });  

  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
  
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
  }
  });
  
});
//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
