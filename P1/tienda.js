const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Obtener la ruta del archivo solicitado
  const filePath = path.join('tienda.html', req.url);

  // Leer el archivo del disco
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si ocurre un error, enviar una respuesta con código 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
    } else {
      // Si se lee el archivo correctamente, enviar una respuesta con código 200 y el contenido del archivo
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
});

server.listen(9000, () => {
  console.log('Servidor iniciado en http://localhost:9000');
});