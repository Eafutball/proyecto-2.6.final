
const actualizarConteoCarrito = () => {
    // Recupera el carrito de productos
    const productosEnCarrito = recuperarCarrito();
    
    // Selecciona el elemento del DOM donde se mostrará el conteo
    const cartCountElement = document.querySelector(".cart-count");
    
    // Verifica si el elemento existe
    if (cartCountElement) {
        // Actualiza el texto del elemento con la cantidad de productos
        cartCountElement.textContent = productosEnCarrito.length;

        // Muestra u oculta el elemento basado en la cantidad de productos
        cartCountElement.style.display = productosEnCarrito.length > 0 ? 'block' : 'none';
    }
};


const recuperarCarrito = () => {
    try {
        // Recupera el carrito del almacenamiento local
        const carrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
        
        // Verifica si el valor recuperado es un array, sino devuelve un array vacío
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        // Muestra el error en la consola y devuelve un array vacío
        console.error("Error al recuperar el carrito:", error);
        return [];
    }
};


  actualizarConteoCarrito()