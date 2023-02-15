const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Obtener la ruta del archivo solicitado
  const filePath = path.join(__dirname, req.url);

  // Obtener la extensión del archivo solicitado
  const extname = path.extname(filePath);

  // Establecer el tipo de contenido en función de la extensión del archivo solicitado
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Leer el archivo del disco
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Si ocurre un error, enviar una respuesta con código 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
    } else {
      // Si se lee el archivo correctamente, enviar una respuesta con código 200 y el contenido del archivo
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(9000, () => {
  console.log('Servidor iniciado en http://localhost:9000');
});
