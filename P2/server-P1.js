const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 8090;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");
// Ruta de la imagen en el servidor
const imagePath = 'https://github.com/claudio07madrid/LTAW-Practicas/blob/main/P1/fondo.jpg?raw=true';

// Leyendo el archivo de imagen
fs.readFile(imagePath, (err, data) => {
  if (err) {
    // Si hay un error, envía un mensaje de error al cliente
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al leer el archivo de imagen');
    return;
  }

  // Configurando la respuesta para enviar una imagen JPEG
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  res.end(data);
});
  
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);