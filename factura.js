document.addEventListener('DOMContentLoaded', () => {
    // Obtener la factura del almacenamiento local
    const facturaJson = localStorage.getItem('factura');
    console.log('Factura JSON obtenida del almacenamiento local:', facturaJson);
    
    // Si no hay factura en el almacenamiento local, mostrar un mensaje
    if (!facturaJson) {
        document.body.innerHTML = '<div class="container"><div class="alert alert-danger" role="alert">No se encontró ninguna factura en el almacenamiento local.</div></div>';
        console.log('No se encontró ninguna factura en el almacenamiento local.');
        return;
    }
    
    // Parsear el JSON a un objeto JavaScript
    const factura = JSON.parse(facturaJson);
    console.log('Factura parseada:', factura);
    
    // Actualizar los datos de la factura en la página
    const fechaElement = document.getElementById('fecha');
    const numeroFacturaElement = document.getElementById('numeroFactura');
    
    fechaElement.textContent = new Date(factura.fecha).toLocaleDateString();
    numeroFacturaElement.textContent = `Número de Factura: ${factura.numeroFactura}`;
    console.log('Fecha de la factura:', fechaElement.textContent);
    console.log('Número de Factura:', numeroFacturaElement.textContent);
    
    // Datos del vendedor
    document.getElementById('vendedorNombre').textContent = `Nombre: ${factura.datosVendedor.nombre}`;
    document.getElementById('vendedorDireccion').textContent = `Dirección: ${factura.datosVendedor.direccion}`;
    document.getElementById('vendedorTelefono').textContent = `Teléfono: ${factura.datosVendedor.telefono}`;
    document.getElementById('vendedorCorreoElectronico').textContent = `Correo Electrónico: ${factura.datosVendedor.correoElectronico}`;
    document.getElementById('vendedorNIF').textContent = `NIF: ${factura.datosVendedor.nif}`;
    console.log('Datos del vendedor:', factura.datosVendedor);
    
    // Datos del comprador
    document.getElementById('compradorNombre').textContent = `Nombre: ${factura.datosComprador.nombre}`;
    document.getElementById('compradorDireccion').textContent = `Dirección: ${factura.datosComprador.direccion}`;
    document.getElementById('compradorCorreoElectronico').textContent = `Correo Electrónico: ${factura.datosComprador.correoElectronico}`;
    console.log('Datos del comprador:', factura.datosComprador);
    
    // Detalles de la compra
    const detallesCompra = document.getElementById('detallesCompra');
    
    // Limpiar contenido previo antes de añadir nuevos detalles
    detallesCompra.innerHTML = '';
    console.log('Contenido previo de detallesCompra limpiado');
    
    factura.detallesCompra.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio.toFixed(2)}</td>
            <td>${(item.cantidad * item.precio).toFixed(2)}</td>
        `;
        detallesCompra.appendChild(row);
        console.log('Añadido detalle:', item);
    });
    
    // Resumen
    document.getElementById('tipoDeEnvio').textContent = `Tipo de Envío: ${factura.tipoDeEnvio}`;
    document.getElementById('total').textContent = `Total: ${factura.total}`;
    document.getElementById('medioPago').textContent = `Medio de Pago: ${factura.medioPago}`;
    console.log('Resumen de la factura:', {
        tipoDeEnvio: factura.tipoDeEnvio,
        total: factura.total,
        medioPago: factura.medioPago
    });
});

