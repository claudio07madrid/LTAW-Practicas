const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { ifError } = require('assert');

const port = 9000;

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('formularioUsuarios.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('form1-resp.html', 'utf-8');


console.log(`Servidor iniciado en http://localhost:${port}`);


const server = http.createServer((req, res) => {
  let mainURL = new URL(req.url, "http://" + req.headers["host"]);
  // Obtener la ruta del archivo solicitado
  let filePath = path.join(__dirname, req.url);
  // Obtener solo el nombre del archivo sin la ruta
  let fileName = path.basename(filePath);
  
  // Si se accede a la raíz de la URL, cambiar la ruta del archivo a index.html
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, '/tienda.html');
  }

  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;

  let cookie;

  
  if (req.url === '/productos') {
    // Si se solicita la URL /productos, leer los productos del archivo tienda.json
    fs.readFile(path.join(__dirname, 'tienda.json'), (err, data) => {
      if (err) {
        // Si hay un error al leer el archivo, enviar una respuesta con código 500 y un mensaje de error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor');
        console.log('Error interno del servidor');
      } else {
        // Si se puede leer el archivo, parsear el contenido como un objeto JSON y enviar una respuesta con código 200 y los productos
        const tienda = JSON.parse(data);
        const productos = tienda.productos;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(productos));

        console.log('Productos enviados');
      }
    });
  }

  // Imprimir solo el nombre del archivo solicitado
  console.log(`Se ha solicitado el archivo: ` + mainURL);

  // Verificar si el archivo existe en el disco
  if (fileName.split("?")[0] != "procesar") {
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
  }else {
    console.log("Estamos entrando");
    let usuarioEncontrado = false;
    console.log(fileName);
    usuario = mainURL.searchParams.get('Usuario');
    contrasena = mainURL.searchParams.get('password');
    console.log(usuario);
    console.log(contrasena);
    archivoJSON = fs.readFileSync("tienda.json");
    diccionario = JSON.parse(archivoJSON);
    diccionario["usuarios"].forEach(element => {
      if(usuario == element["nombreUsuario"] && contrasena == element["contrasena"]){
        console.log("si tioooooooooooooooooooooooooooo");
        usuarioEncontrado = true;
        return;
      }
    });
    if(usuarioEncontrado){
      console.log("Usuario encontrado ENVIANDO COOKIE YES UNCLE");
      res.setHeader("Set-Cookie","user = " + usuario);
      cookie = req.headers.cookie;
      fs.readFile('tienda.html', function (err, data) {
        if (err) throw err;
        let home = data.toString();
        home = home.replace("<p></p>","<p>Usuario: "+ usuario +"</p>");
        console.log("hola");
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(home);
        res.end();
      });
  } else {
      // hacer algo si el usuario no se encuentra
      console.log("El usuario no existe");
      res.writeHead(302, { 'Location': '/errorUsuario.html' });
      res.end();
   }  
   //-- Leer la Cookie recibida y mostrarla en la consola
  
  console.log("AQUI ESTÁ LA COOKIE: " + cookie);

  }


});

server.listen(port, () => {
});

