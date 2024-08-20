// Get the query string from the URL
const URLSearchFragment = window.location.search;

// Initialize URLSearchParams with the query string
const urlSearchParams = new URLSearchParams(URLSearchFragment);

const id = +urlSearchParams.get("id");

const ObtenerLista = async () => {
  try {
    const response = await fetch("Productos.json");

    if (!response.ok) {
      throw new Error(`¡Error HTTP! Estado: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.productos)) {
      throw new Error(
        "Error en el formato de los datos: El array 'productos' falta o no es un array"
      );
    }

    return data.productos;
  } catch (error) {
    console.error("Error al obtener o analizar los datos:", error.message);
    return [];
  }
};

// Define the function to get a specific product by ID
const ObtenerProducto = async () => {
  try {
    const listaProductos = await ObtenerLista();

    // Find the product with the specified ID
    const producto = listaProductos.find((producto) => producto.id === id);

    return producto || null;
  } catch (error) {
    console.error("Error fetching the product:", error);
    throw error;
  }
};

const boton = document.querySelector(".btn");

const MostrarProductoEnDetalle = async () => {
  try {
    // Obtener los datos del producto
    const producto = await ObtenerProducto();

    if (!producto) {
      console.error("Producto no encontrado.");
      return;
    }

    // Actualizar el contenido de la página con los datos del producto
    document.querySelector(".card-title").textContent = producto.nombre;
    document.querySelector(".card-subtitle").textContent =
      producto.categoria.toUpperCase();
    document.querySelector(".box-title + p").textContent = producto.descripcion;
    document.querySelector(".precio").innerHTML = `$${producto.precio.toFixed(
      2
    )}`;

    // Actualizar los detalles del producto
    document.querySelector(".table tbody").innerHTML = `
            <tr><th scope="row">Stock Online</th><td>${
              producto.stock.online ? "Sí" : "No"
            }</td></tr>
            <tr><th scope="row">Stock Tienda Física</th><td>${
              producto.stock.tiendaFisica ? "Sí" : "No"
            }</td></tr>
            <tr><th scope="row">Tiempos de Entrega</th><td>${
              producto.tiemposEntrega
            }</td></tr>
            <tr><th scope="row">Gastos de Envío</th><td>${
              producto.gastosEnvio
            }</td></tr>
            <tr><th scope="row">Opciones de Entrega</th><td>${producto.opcionesEntrega.join(
              ", "
            )}</td></tr>
            <tr><th scope="row">Garantía</th><td>${producto.garantia}</td></tr>
            <tr><th scope="row">Año de Publicación</th><td>${
              producto.anioPublicacion
            }</td></tr>
            <tr><th scope="row">Unidades Vendidas</th><td>${
              producto.unidadesVendidas
            }</td></tr>
            <tr><th scope="row">Cambios y Devoluciones</th><td><a href="${
              producto.enlaceCambiosDevoluciones
            }" target="_blank">${
      producto.enlaceCambiosDevoluciones
    }</a></td></tr>
            <tr><th scope="row">Contacto y Ayuda</th><td><a href="${
              producto.enlaceContactoAyuda
            }" target="_blank">${producto.enlaceContactoAyuda}</a></td></tr>
        `;

    // agregar dataset al boton

    const boton = document.querySelector(".btn");

    if (boton) {
      // Establecer el atributo id del botón
      boton.setAttribute("id", producto.id);
    } else {
      console.warn("Botón no encontrado en el DOM.");
    }

    // Actualizar las imágenes del carousel
    const carouselInner = document.querySelector(
      "#productCarousel .carousel-inner"
    );
    carouselInner.innerHTML = `
            <div class="carousel-item active">
                <img src="${
                  producto.imagenDestacada
                }" class="d-block w-100 rounded" alt="Imagen destacada">
            </div>
            ${producto.galeriaImagenes
              .map(
                (img, index) => `
                <div class="carousel-item">
                    <img src="${img}" class="d-block w-100 rounded" alt="Imagen ${
                  index + 1
                }">
                </div>
            `
              )
              .join("")}
        `;

    // Actualizar la sección de reseñas
    const reseñasContainer = document.querySelector(".reviews .review-list");
    reseñasContainer.innerHTML = producto.resenaUsuarios
      .map(
        (resena) => `
            <div class="review">
                <div class="stars mb-2">
                    ${generateStars(resena.valoracion)}
                </div>
                <p>${resena.comentario}</p>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error mostrando detalles del producto:", error);
  }
};

// Función para generar estrellas basadas en la valoración
const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star filled"></i>';
  }

  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt filled"></i>';
  }

  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  return stars;
};
MostrarProductoEnDetalle();


const carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];



const AgregarEnCarrito = async (e) => {
  try {
      const producto = await ObtenerProducto();

      let carrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

      let productoExistente = carrito.find(item => item.id === producto.id);

      if (productoExistente) {
          productoExistente.cantidad += 1;
          productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
      } else {
          producto.cantidad = 1;
          producto.subtotal = producto.precio; 
          carrito.push(producto);
      }

      localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));

      actualizarConteoCarrito();

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
          icon: 'success',
          title: '¡Producto Agregado!',
          text: `${producto.nombre} ha sido agregado a tu carrito.`,
          confirmButtonText: 'Aceptar'
      });

  } catch (error) {
      console.error("Error al obtener el producto:", error);

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el producto al carrito.',
          confirmButtonText: 'Aceptar'
      });
  }
};



const recuperarCarrito = () => {
    return JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
};

const actualizarConteoCarrito = () => {
    const productosEnCarrito = recuperarCarrito();
    const cartCountElement = document.querySelector(".cart-count");
  
    if (cartCountElement) {
        cartCountElement.textContent = productosEnCarrito.length;
    } else {
        console.warn("No se encontró el elemento con la clase .cart-count");
    }
  };
  
  document.addEventListener('DOMContentLoaded', actualizarConteoCarrito);


