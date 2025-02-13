// Constantes y variables globales
const STORAGE_KEY = 'carrito';
let productosGlobales = [];

// Definición de CarritoManager
const CarritoManager = {
    cargar: function() {
        const carrito = localStorage.getItem(STORAGE_KEY);
        return carrito ? JSON.parse(carrito) : [];
    },
    guardar: function(carrito) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }
};

// Carga de productos con mejor manejo de errores
async function cargarProductos() {
    try {
        const response = await fetch('../api/productos.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        productosGlobales = data;
        mostrarProductos(data);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('No se pudieron cargar los productos. Por favor, intenta más tarde.');
    }
}

// Mostrar productos con validaciones y link a detalles
function mostrarProductos(productos) {
    const productosContainer = document.getElementById("productos-container");
    if (!productosContainer) {
        console.error("Contenedor de productos no encontrado");
        return;
    }

    productosContainer.innerHTML = '';

    productos.forEach(producto => {
        const productoElemento = document.createElement("div");
        productoElemento.classList.add("col-12", "col-md-4", "mb-4", "producto");
        
        // Crear la card completa como un enlace
        productoElemento.innerHTML = `
            <div class="card h-100" style="cursor: pointer;" onclick="window.location.href='detalle_producto.html?id=${producto.id}'">
                <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.name}</h5>
                    <p class="card-text">${producto.description || ''}</p>
                    <div class="mt-auto">
                        <p class="card-text fw-bold">$${producto.price}</p>
                        <button class="btn btn-primary agregar-carrito" 
                                data-id="${producto.id}"
                                onclick="event.stopPropagation();">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        productosContainer.appendChild(productoElemento);
    });

    // Inicializar eventos después de mostrar los productos
    inicializarEventos();
}

// Función para filtrar productos
function filtrarProductos() {
    const marcaSeleccionada = document.getElementById('marca').value;
    const tipoSeleccionado = document.getElementById('tipo').value;

    const productosFiltrados = productosGlobales.filter(producto => {
        const cumpleMarca = !marcaSeleccionada || producto.brand === marcaSeleccionada;
        const cumpleTipo = !tipoSeleccionado || producto.type === tipoSeleccionado;
        return cumpleMarca && cumpleTipo;
    });

    mostrarProductos(productosFiltrados);
}

// Inicializar eventos
function inicializarEventos() {
    const botonesAgregar = document.querySelectorAll(".agregar-carrito");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevenir que el click se propague a la card
            const id = parseInt(e.target.getAttribute("data-id"));
            const producto = productosGlobales.find(p => p.id === id);
            if (producto) {
                const carrito = CarritoManager.cargar();
 const index = carrito.findIndex(item => item.id === producto.id);
                if (index === -1) {
                    carrito.push({ ...producto, quantity: 1 });
                } else {
                    carrito[index].quantity += 1;
                }
                CarritoManager.guardar(carrito);
                alert(`${producto.name} ha sido agregado al carrito.`);
            }
        });
    });
}

// Mostrar error en la interfaz
function mostrarError(mensaje) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("alert", "alert-danger", "mt-3");
    errorContainer.textContent = mensaje;
    
    const container = document.querySelector(".container");
    if (container) {
        container.insertBefore(errorContainer, container.firstChild);
        
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await cargarProductos();
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        mostrarError('Hubo un error al cargar la página. Por favor, recarga.');
    }
});