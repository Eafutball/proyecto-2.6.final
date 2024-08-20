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

const MostrarProductos = async () => {
  const columnaDeProductos = document.querySelector(".row");

  try {
    columnaDeProductos.innerHTML = "<p>Loading products...</p>";

    const lista = await ObtenerLista();

    columnaDeProductos.textContent = "";

    if (Array.isArray(lista) && lista.length > 0) {
      const fragment = document.createDocumentFragment();

      lista.forEach((producto) => {
        if (
          producto &&
          producto.nombre &&
          producto.imagenDestacada &&
          producto.precio
        ) {
          const productoDiv = document.createElement("div");
          productoDiv.className =
            "col-sm-6 col-lg-3 mb-2-6 mb-lg-0 product-item";
          productoDiv.dataset.category = producto.categoria || "";

          productoDiv.innerHTML = `
              <div class="card-wrapper mb-4">
                <div class="card-img">
                  <img
                    src="${producto.imagenDestacada}"
                    alt="Imagen de ${producto.nombre}"
                    class="img-fluid"
                  />
                </div>
                <div class="card-body">
                  <div class="text-center">
                    <a href="PaginaProducto.html?id=${producto.id}" class="text-primary link-boton">
                      <button class="btn btn-primary comprar">Comprar</button>
                    </a>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <h4 class="h5 mb-2">
              <a href="PaginaProducto.html?id=${producto.id}" class="text-secondary">${producto.nombre.toUpperCase()}</a>
                </h4>
                <h5 class="mb-0 text-primary">${producto.precio}</h5>
              </div>
            `;

          fragment.appendChild(productoDiv);
        }
      });

      columnaDeProductos.appendChild(fragment);
    } else {
      columnaDeProductos.innerHTML = "<p>No se encontraron productos.</p>";
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    columnaDeProductos.innerHTML =
      "<p>Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.</p>";
  }
};

MostrarProductos();

const RellenarOpciones = async () => {
  try {
    const lista = await ObtenerLista();
    const DropDownMenu = document.querySelector(".categorias");

    DropDownMenu.textContent = "";

    const categorias = new Set(
      lista.map((producto) => producto.categoria).filter(Boolean)
    );

    const fragment = document.createDocumentFragment();

    categorias.forEach((categoria) => {
      const listItem = document.createElement("li");
      const anchor = document.createElement("a");

      anchor.textContent = categoria.toUpperCase();
      anchor.classList.add("dropdown-item");

      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        filterProducts(categoria);
      });

      listItem.appendChild(anchor);
      fragment.appendChild(listItem);
    });

    DropDownMenu.appendChild(fragment);
  } catch (error) {
    console.error("Error al obtener la lista de productos:", error);
  }
};

RellenarOpciones();

function filterProducts(categoria) {
  let productos = document.querySelectorAll(".col-sm-6");
  productos.forEach((producto) => {
    let productCategory = producto.dataset.category;
    if (productCategory === categoria) {
      producto.style.display = "inline-block";
    } else {
      producto.style.display = "none";
    }
  });
}

document.querySelector(".todos").addEventListener("click", () => {
  MostrarProductos();
});
document.querySelector(".mas-caro").addEventListener("click", () => {
  MostrarProductosOrdenadosPorPrecio();
});

document.querySelector(".mas-vendidos").addEventListener("click", () => {
  MostrarProductosOrdenadosPorUnidades();
});

document.querySelector(".mas-reciente").addEventListener("click", () => {
  MostrarProductosMasRecientes();
});

const OrdenarPorPrecio = async () => {
  try {
    const lista = await ObtenerLista();

    if (!Array.isArray(lista)) {
      throw new Error("La lista de productos no es un array");
    }

    lista.forEach((producto) => {
      if (typeof producto.precio !== "number") {
        throw new Error(
          "Todos los productos deben tener la propiedad precio como número"
        );
      }
    });

    const listaOrdenada = lista.sort((a, b) => b.precio - a.precio);

    return listaOrdenada;
  } catch (error) {
    console.error("Error al ordenar la lista de productos:", error);
    return [];
  }
};

const OrdenarPorUnidades = async () => {
  try {
    const lista = await ObtenerLista();

    if (!Array.isArray(lista)) {
      throw new Error("La lista de productos no es un array");
    }

    const listaOrdenada = lista.sort((a, b) => {
      if (
        typeof a.unidadesVendidas !== "number" ||
        typeof b.unidadesVendidas !== "number"
      ) {
        throw new Error("Las propiedades unidadesVendidas deben ser números");
      }
      return b.unidadesVendidas - a.unidadesVendidas;
    });

    return listaOrdenada;
  } catch (error) {
    console.error("Error al ordenar la lista de productos:", error);
    return [];
  }
};

const OrdenarPorMasReciente = async () => {
  try {
    const lista = await ObtenerLista();

    if (!Array.isArray(lista)) {
      throw new Error("La lista de productos no es un array");
    }

    const listaOrdenada = lista.sort((a, b) => {
      if (
        typeof a.anioPublicacion !== "number" ||
        typeof b.anioPublicacion !== "number"
      ) {
        throw new Error("Las propiedades anioPublicacion deben ser números");
      }
      return b.anioPublicacion - a.anioPublicacion;
    });

    return listaOrdenada;
  } catch (error) {
    console.error("Error al ordenar la lista de productos:", error);
    return [];
  }
};

const MostrarProductosOrdenadosPorPrecio = async () => {
  try {
    let listaOrdenada = await OrdenarPorPrecio();

    let columnaDeProductos = document.querySelector(".row");

    columnaDeProductos.textContent = "";

    if (listaOrdenada && listaOrdenada.length > 0) {
      const productosHtml = listaOrdenada
        .map(
          (producto) => `
                <div class="col-sm-6 col-lg-3 mb-2-6 mb-lg-0 product-item" data-category="${
                  producto.categoria
                }">
                    <div class="card-wrapper mb-4">
                        <div class="card-img">
                            <img
                                src="${producto.imagenDestacada}"
                                alt="Imagen de ${producto.nombre}"
                                class="img-fluid"
                            />
                        </div>
                        <div class="card-body">
                            <div class="text-center">
                                    <button class="btn btn-primary comprar">Comprar</button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <h4 class="h5 mb-2">
                      <a href="PaginaProducto.html?id=${producto.id}" class="text-secondary">${producto.nombre}</a>
                        </h4>
                        <h5 class="mb-0 text-primary">$${producto.precio.toFixed(
                          2
                        )}</h5>
                    </div>
                </div>
            `
        )
        .join("");

      columnaDeProductos.innerHTML = productosHtml;
    } else {
      columnaDeProductos.innerHTML = "<p>No se encontraron productos.</p>";
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    let columnaDeProductos = document.querySelector(".row");
    if (columnaDeProductos) {
      columnaDeProductos.innerHTML = "<p>Error al cargar los productos.</p>";
    }
  }
};

const MostrarProductosOrdenadosPorUnidades = async () => {
  try {
    const listaOrdenada = await OrdenarPorUnidades();

    const columnaDeProductos = document.querySelector(".row");

    columnaDeProductos.textContent = "";

    if (listaOrdenada.length > 0) {
      const productosHtml = listaOrdenada
        .map(
          (producto) => `
                <div class="col-sm-6 col-lg-3 mb-2-6 mb-lg-0 product-item" data-category="${
                  producto.categoria
                }">
                    <div class="card-wrapper mb-4">
                        <div class="card-img">
                            <img
                                src="${producto.imagenDestacada}"
                                alt="Imagen de ${producto.nombre}"
                                class="img-fluid"
                            />
                        </div>
                        <div class="card-body">
                            <div class="text-center">
                                    <button class="btn btn-primary comprar">Comprar</button>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="text-center">
                        <h4 class="h5 mb-2">
                                      <a href="PaginaProducto.html?id=${producto.id}" class="text-secondary">${producto.nombre}</a>
                        </h4>
                        <h5 class="mb-0 text-primary">$${producto.precio.toFixed(
                          2
                        )}</h5>
                    </div>
                </div>
            `
        )
        .join("");

      // Asignar el HTML generado al elemento
      columnaDeProductos.innerHTML = productosHtml;
    } else {
      columnaDeProductos.innerHTML = "<p>No se encontraron productos.</p>";
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    // Mostrar un mensaje de error en el HTML
    const columnaDeProductos = document.querySelector(".row");
    if (columnaDeProductos) {
      columnaDeProductos.innerHTML = "<p>Error al cargar los productos.</p>";
    }
  }
};

const MostrarProductosMasRecientes = async () => {
  try {
    // Obtener la lista de productos ordenados por unidades vendidas
    const listaOrdenada = await OrdenarPorMasReciente();

    // Seleccionar el elemento donde se mostrarán los productos
    const columnaDeProductos = document.querySelector(".row");

    // Verificar si la lista de productos no está vacía
    if (listaOrdenada.length > 0) {
      // Crear el HTML para cada producto
      const productosHtml = listaOrdenada.map((producto) => `
        <div class="col-sm-6 col-lg-3 mb-2-6 mb-lg-0 product-item" data-category="${producto.categoria}">
          <div class="card-wrapper mb-4">
            <div class="card-img">
              <img src="${producto.imagenDestacada}" alt="Imagen de ${producto.nombre}" class="img-fluid" />
            </div>
            <div class="card-body">
              <div class="text-center">
                  <button class="btn btn-primary comprar">Comprar</button>
                </a>
              </div>
            </div>
          </div>
          <div class="text-center">
            <h4 class="h5 mb-2">
              <a href="PaginaProducto.html?id=${producto.id}" class="text-secondary">${producto.nombre}</a>
            </h4>
            <h5 class="mb-0 text-primary">$${producto.precio.toFixed(2)}</h5>
          </div>
        </div>
      `).join("");

      // Asignar el HTML generado al elemento
      columnaDeProductos.innerHTML = productosHtml;
    } else {
      columnaDeProductos.innerHTML = "<p>No se encontraron productos.</p>";
    }
  } catch (error) {
    console.error("Error al obtener productos:", error);
    // Mostrar un mensaje de error en el HTML
    const columnaDeProductos = document.querySelector(".row");
    if (columnaDeProductos) {
      columnaDeProductos.innerHTML = "<p>Error al cargar los productos.</p>";
    }
  }
};
// Función para recuperar el carrito desde localStorage
const recuperarCarrito = () => {
  try {
    const carrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    console.error("Error al recuperar el carrito:", error);
    return [];
  }
};

// Función para actualizar el conteo del carrito
const actualizarConteoCarrito = () => {
  const productosEnCarrito = recuperarCarrito();
  const cartCountElement = document.querySelector(".cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = productosEnCarrito.length;
  } else {
    console.warn("No se encontró el elemento con la clase .cart-count");
  }
};

// Ejemplo de uso de la función recuperarCarrito en la consola
console.log("Carrito actual:", recuperarCarrito());

// Llamar a actualizarConteoCarrito para asegurarse de que el conteo esté actualizado
document.addEventListener("DOMContentLoaded", actualizarConteoCarrito);
