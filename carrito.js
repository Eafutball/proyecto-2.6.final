// Función para recuperar el carrito desde localStorage
const recuperarCarrito = () => {
    try {
        const carrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
        return $.isArray(carrito) ? carrito : [];
    } catch (error) {
        console.error("Error al recuperar el carrito:", error);
        return [];
    }
};



const actualizarTablaCarrito = () => {
  const productosEnCarrito = recuperarCarrito();
  const $tbody = $(".table tbody");

  // Verificar si $tbody existe
  if ($tbody.length === 0) {
      console.log("No se encontró el tbody para actualizar la tabla.");
      return;
  }

  // Limpiar el contenido actual de la tabla
  $tbody.empty();
  console.log("Tabla vaciada.");

  // Iterar sobre los productos en el carrito
  productosEnCarrito.forEach(producto => {
      console.log("Procesando producto:", producto);

      const $fila = $("<tr>");

      // Calcular el subtotal del producto
      const subtotal = producto.precio * producto.cantidad;
      console.log(`Subtotal calculado para el producto ${producto.nombre}: $${subtotal.toFixed(2)}`);

      // Añadir data-id a la fila para identificar el producto
      $fila.data("product-id", producto.id);

      $fila.html(`
          <td class="p-4">
              <div class="media align-items-center">
                  <img src="${producto.imagenDestacada}" class="d-block ui-w-40 ui-bordered mr-4" alt="${producto.nombre}">
                  <div class="media-body">
                      <a href="PaginaProducto.html?id=${producto.id}" class="d-block text-dark nombre-producto">${producto.nombre}</a>
                      <small class="descripcion-producto">${producto.descripcion}</small>
                  </div>
              </div>
          </td>
          <td class="text-right font-weight-semibold align-middle p-4 precio">$${producto.precio.toFixed(2)}</td>
          <td class="align-middle p-4">
              <div class="quantity-control">
                  <button class="btn btn-secondary btn-sm" data-action="decrease">-</button>
                  <input type="number" class="form-control text-center cantidad" value="${producto.cantidad}" min="1" max="10" step="1" readonly>
                  <button class="btn btn-secondary btn-sm" data-action="increase">+</button>
              </div>
          </td>
          <td class="text-right font-weight-semibold align-middle p-4 subtotal">$${subtotal.toFixed(2)}</td>
          <td class="text-center align-middle px-0"><a href="#" class="remove-item" data-id="${producto.id}">×</a></td>
      `);

      // Añadir la fila a la tabla
      $tbody.append($fila);
      console.log(`Fila añadida para el producto ${producto.nombre}.`);

      // Agregar event listeners para los botones de cantidad
      $fila.find('.quantity-control button').on('click', (e) => {
          const action = $(e.target).data('action');
          const $input = $fila.find('.cantidad');
          let cantidad = parseInt($input.val(), 10);

          console.log(`Acción del botón: ${action}. Cantidad actual: ${cantidad}`);

          if (action === 'increase') {
              if (cantidad < parseInt($input.attr('max'), 10)) {
                  cantidad += 1;
              }
          } else if (action === 'decrease') {
              if (cantidad > parseInt($input.attr('min'), 10)) {
                  cantidad -= 1;
              }
          }

          // Actualizar el valor en el input
          $input.val(cantidad);

          // Recalcular el subtotal
          const nuevoSubtotal = producto.precio * cantidad;
          console.log(`Nuevo subtotal para el producto ${producto.nombre}: $${nuevoSubtotal.toFixed(2)}`);
          $fila.find('.subtotal').text(`$${nuevoSubtotal.toFixed(2)}`);

          // Actualizar el producto en el carrito
          producto.cantidad = cantidad;
          producto.subtotal = nuevoSubtotal;
          console.log(producto.cantidad)

          // Guardar el carrito actualizado en el almacenamiento local
          localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
          console.log("Carrito actualizado en localStorage.");

          // Actualizar el total del carrito
          actualizarTotalCarrito();
      });

      // Agregar event listener para el botón de eliminar
      $fila.find('.remove-item').on('click', eliminarProducto);
      console.log(`Evento de eliminación añadido para el producto ${producto.nombre}.`);
  });

  // Actualizar el total del carrito al final de la función
  actualizarTotalCarrito();
  console.log("Total del carrito actualizado.");
};



const guardarCarritoActualizado = (productosEnCarrito) => {
  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
};


const actualizarTotalCarrito = () => {
    const productosEnCarrito = recuperarCarrito();
    const $totalPriceElement = $('#totalPrice');
  
    if ($totalPriceElement.length) {
      const total = productosEnCarrito.reduce((acc, producto) => acc + producto.subtotal, 0);
      $totalPriceElement.text(`$${total.toFixed(2)}`);
    } else {
      console.error('El elemento para mostrar el total no se encontró.');
    }
  };





  const actualizarConteoCarrito = () => {
    const productosEnCarrito = recuperarCarrito();
    const $cartCountElement = $(".cart-count");
  
    $cartCountElement.text(productosEnCarrito.length).toggle(productosEnCarrito.length > 0);
  };
  

  const eliminarProducto = (e) => {
    try {
      if (!$(e.target).hasClass('remove-item')) return;
  
      const productoID = +$(e.target).data('id');
      if (!productoID) {
        console.error("No se pudo obtener el ID del producto desde el data-id.");
        return;
      }
  
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const carrito = recuperarCarrito();
          if (!Array.isArray(carrito)) {
            throw new Error("El carrito recuperado no es un array.");
          }
  
          const index = carrito.findIndex(producto => producto.id === productoID);
          if (index !== -1) {
            // Eliminar el producto del carrito
            carrito.splice(index, 1);
  
            // Guardar el carrito actualizado en el almacenamiento local
            localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
  
            // Actualizar la tabla del carrito, el conteo de productos y el total
            actualizarTablaCarrito();
            actualizarConteoCarrito();
            actualizarTotalCarrito();
  
            Swal.fire(
              '¡Eliminado!',
              'El producto ha sido eliminado.',
              'success'
            );
          } else {
            console.error("No se encontró el producto en el carrito.");
          }
        }
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };



  function actualizarTotal(precioEliminado) {
    const $totalPriceElement = $('#totalPrice');
    const totalActual = parseFloat($totalPriceElement.text().replace('Total: $', '')) || 0;
    const nuevoTotal = Math.max(totalActual - precioEliminado, 0);
    $totalPriceElement.text(`Total: $${nuevoTotal.toFixed(2)}`);
  }






// Inicializar la tabla del carrito al cargar la página
$(document).ready(() => {
    actualizarTablaCarrito();
    actualizarConteoCarrito();
    const $tabla = $(".table tbody");
  
    // Seleccionar todos los enlaces de eliminación y añadirles el manejador de eventos
    $tabla.on('click', '.remove-item', eliminarProducto);
  });



  $(document).ready(function() {
    $('tbody').on('click', 'button', function(event) {
      const $button = $(this);
      const action = $button.data('action');
      const $row = $button.closest('tr');
      const id = $row.data('product-id');
      const $input = $row.find('input[type="number"]');
      const $priceCell = $row.find('td:nth-child(4)');
      const unitPrice = parseFloat($row.find('td:nth-child(2)').text().replace('$', ''));
  
      let quantity = parseInt($input.val(), 10);
  
      $input.val(quantity);
      $priceCell.text(`$${(quantity * unitPrice).toFixed(2)}`);
  
      // Calcular el total general del carrito
      let total = 0;
      $('tbody tr').each(function() {
        const subtotal = parseFloat($(this).find('td:nth-child(4)').text().replace('$', ''));
        total += subtotal;
      });
  
      // Actualizar el total en la página
      $('#totalPrice').text(`$${total.toFixed(2)}`);
    });
  });


    // Obtén el botón y los elementos del total solo una vez
    const $comprarBtn = $('#Comprar');
    const $totalInput = $('.total-input');
    const $totalPriceElement = $('#totalPrice');


    $comprarBtn.on("click", actualizarEntradaTotal);

    $('.tarjeta').on('input', manejarEntradaNumeroTarjeta);
    
    async function manejarEntradaNumeroTarjeta(event) {
      const $entrada = $(event.target);
      const numeroTarjeta = $entrada.val().trim();
  
      console.log('Número de tarjeta ingresado:', numeroTarjeta);
  
      if (numeroTarjeta.length < 6 || numeroTarjeta.length === 0) {
          console.log('Número de tarjeta demasiado corto:', numeroTarjeta.length);
          return;
      }
  
      const bin = numeroTarjeta.slice(0, 6);
      console.log('BIN extraído:', bin);
  
      const urlConsultaBin = `https://data.handyapi.com/bin/${bin}`;
      console.log('URL de consulta BIN:', urlConsultaBin);
  
      try {
          const datos = await obtenerDatosBin(urlConsultaBin);
          console.log('Datos obtenidos:', datos);
  
          const esquema = (datos.Scheme || '').toUpperCase();
          console.log('Esquema de tarjeta:', esquema);
  
          actualizarLogoTarjeta(esquema);
      } catch (error) {
          console.error('Error al verificar la tarjeta:', error);
          mostrarMensajeError('Hubo un problema al verificar la tarjeta. Por favor, inténtelo de nuevo más tarde.');
      }
  }
  
      
      function actualizarEntradaTotal(e) {
        $totalInput.val($totalPriceElement.text());
      }
      
      async function obtenerDatosBin(url) {
        const respuesta = await fetch(url);
      
        if (!respuesta.ok) {
          throw new Error(`Error HTTP! Estado: ${respuesta.status}`);
        }
      
        return await respuesta.json();
      }
      
      function actualizarLogoTarjeta(esquema) {
        const $contenedorLogo = $('#card_image');
        $contenedorLogo.empty();
      
        let origenLogo = '';
        
        if (esquema.includes('MASTERCARD')) {
            origenLogo = 'mastercard.png';
        } else if (esquema.includes('VISA')) {
            origenLogo = 'VISA.png';
        } else if (esquema.length === 0) {
            origenLogo = ''; 
        }
      
        if (origenLogo) {
            const $img = $('<img>')
                .attr('src', origenLogo)
                .attr('alt', `Logo de ${esquema}`)
                .addClass('logo');
            $contenedorLogo.append($img);
        } else {
            $contenedorLogo.text('Tarjeta no reconocida.');
        }
    }
    
      
   
      


      const obtenerTipoDeEnvioSeleccionado = () => {
        const $radios = $('input[name="shipping_method"]');
        const radioSeleccionado = $radios.filter(':checked');
        
        if (radioSeleccionado.length > 0) {
          return radioSeleccionado.val();
        } else {
          return null;
        }
      };


      // Función principal para guardar la factura
const guardarFactura = () => {
    // Obtén el tipo de envío seleccionado
    const tipoDeEnvioSeleccionado = obtenerTipoDeEnvioSeleccionado();
    if (!tipoDeEnvioSeleccionado) {
        mostrarMensajeError('Por favor, seleccione un tipo de envío.');
        return;
    }

    // Recupera el carrito de compras
    const carrito = recuperarCarrito();
    if (carrito.length === 0) {
        mostrarMensajeError('El carrito está vacío.');
        return;
    }

    // Obtén el valor total de la compra
    const totalInput = $('.total-input');
    const total = totalInput.length > 0 ? totalInput.val() : '';
    if (!total) {
        mostrarMensajeError('No se pudo encontrar el campo de total o está vacío.');
        return;
    }

    // Crea el objeto factura
    const factura = crearFactura(tipoDeEnvioSeleccionado, carrito, total);

    // Guarda la factura en el almacenamiento local
    guardarFacturaEnLocalStorage(factura);

    // Elimina los productos del carrito
    eliminarProductosDelCarrito();

    // Muestra el popup de éxito
    mostrarPopupExito();
};



// Función para crear el objeto de la factura
const crearFactura = (tipoDeEnvio, carrito, total) => ({
    fecha: new Date().toISOString(),
    numeroFactura: generarNumeroFactura(),
    datosVendedor: {
        nombre: 'Endurance Essencials',
        direccion: 'Pozos de Santa Ana',
        telefono: '87157693',
        correoElectronico: 'eandreszambrano4@gmail.com',
        nif: 'NIF'
    },
    datosComprador: {
        nombre: $('.Nombre').val(),
        direccion: $('.direccion').val(),
        correoElectronico: $('.correo-electronico').val()
    },
    detallesCompra: carrito,
    tipoDeEnvio,
    total,
    medioPago: 'Tarjeta de Crédito'
});

// Función para generar un número de factura aleatorio
const generarNumeroFactura = () => Math.floor(Math.random() * 900000) + 100000;

// Función para guardar la factura en el almacenamiento local
const guardarFacturaEnLocalStorage = (factura) => {
    localStorage.setItem('factura', JSON.stringify(factura));
};

// Función para eliminar los productos del carrito
const eliminarProductosDelCarrito = () => {
    localStorage.removeItem('productos-en-carrito');
};

// Función para mostrar un popup de éxito usando SweetAlert2
const mostrarPopupExito = () => {
    Swal.fire({
        icon: 'success',
        title: 'Factura Guardada',
        text: 'La factura se ha guardado correctamente.',
        confirmButtonText: 'Ir a la Factura'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'Factura.html';
        }
    });
};

    
    
    
    
const mostrarMensajeError = (mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonText: 'Aceptar'
    });
};
    



    

    
    