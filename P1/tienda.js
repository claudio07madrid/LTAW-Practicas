const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  // Obtener la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url);
  // Agregar la siguiente línea para imprimir la solicitud del cliente en el terminal
  console.log(`Se ha solicitado el archivo ${filePath}`);

  // Si se accede a la raíz de la URL, cambiar la ruta del archivo a index.html
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, '/tienda.html');
  }

  // Verificar si el archivo existe en el disco
  fs.readFile(filePath, (err, data) => {
    if (err) {
      //Si el archivo solicitado no existe, se comprueba si el error es del tipo ENOENT, que indica que el archivo no existe.
      if (err.code === 'ENOENT') {
        // Si el archivo no existe, enviar una respuesta con código 404 y mostrar la página de error
        const errorPath = path.join(__dirname, 'tiendaerror.html');
        fs.readFile(errorPath, (err, data) => {
          if (err) {
            // Si no se puede leer la página de error, enviar una respuesta con código 404 y texto plano
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
            console.log('Archivo no encontrado');
          } else {
            // Si se puede leer la página de error, enviar una respuesta con código 404 y la página de error
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(data);
            console.log('Archivo no encontrado');
          }
        });
      } else {
        // Si ocurre otro tipo de error al leer el archivo, enviar una respuesta con código 500 y texto plano
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
        console.log('Error interno del servidor')
      }
    } else {
      // Si el archivo existe, establecer el tipo de contenido en función de la extensión del archivo solicitado
      let contentType = 'text/html';
      switch (path.extname(filePath)) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
          case '.ttf':
            contentType = 'font/ttf';
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
});

server.listen(9000, () => {
  console.log('Servidor iniciado en http://localhost:9000');
});

