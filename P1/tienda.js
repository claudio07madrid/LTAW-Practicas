const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Obtener la ruta del archivo solicitado
  const filePath = path.join(__dirname, req.url);

  // Verificar si el archivo existe en el disco
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si el archivo no existe, enviar una respuesta con código 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
    } else {
      // Si el archivo existe, leer el archivo del disco y enviarlo al cliente
      fs.readFile(filePath, (err, data) => {
        if (err) {
          // Si ocurre un error al leer el archivo, enviar una respuesta con código 500
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor');
        } else {
          // Establecer el tipo de contenido en función de la extensión del archivo solicitado
          let contentType = 'text/html';
          switch (path.extname(filePath)) {
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

          // Enviar una respuesta con código 200 y el contenido del archivo solicitado
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  });
});

server.listen(9000, () => {
  console.log('Servidor iniciado en http://localhost:9000');
});

