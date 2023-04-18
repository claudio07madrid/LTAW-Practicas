const fs = require('fs'); // Importar módulo fs

// Leer archivo tienda.json y parsear a objeto JavaScript
fs.readFile('tienda.json', 'utf8', (err, data) => {
  if (err) throw err;
  const tienda = JSON.parse(data);

  // Obtener número de usuarios y mostrar listado
  const numUsuarios = tienda.usuarios.length;
  console.log(`Número de usuarios registrados en la tienda: ${numUsuarios}`);
  console.log('Listado de usuarios:');
  tienda.usuarios.forEach((usuario) => {
    console.log(usuario.nombre);
  });

  // Obtener número de productos y mostrar listado
  const numProductos = tienda.productos.length;
  console.log(`Número de productos en la tienda: ${numProductos}`);
  console.log('Listado de productos:');
  tienda.productos.forEach((producto) => {
    console.log(`- ${producto.nombre}: ${producto.descripcion} - Precio: ${producto.precio} - Cantidad: ${producto.cantidad}`);
  });

  // Obtener número de pedidos pendientes y mostrar detalles
  const pedidosPendientes = tienda.pedidos.filter((pedido) => {
    return pedido.estatus === 'Pendiente';
  });
  const numPedidosPendientes = pedidosPendientes.length;
  console.log(`Número de pedidos pendientes: ${numPedidosPendientes}`);
  console.log('Detalles de pedidos pendientes:');
  pedidosPendientes.forEach((pedido) => {
    console.log(`Pedido #${pedido.id} - Usuario: ${pedido.usuario} - Total: ${pedido.total}`);
    console.log('Productos:');
    pedido.productos.forEach((producto) => {
      console.log(`- ${producto.nombre}: Cantidad: ${producto.cantidad}`);
    });
    console.log('----------------');
  });
});

