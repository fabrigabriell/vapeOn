let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
    cargarProductos();

    const marcaSelect = document.getElementById("marca");
    const tipoSelect = document.getElementById("tipo");

    if (marcaSelect) {
        marcaSelect.addEventListener("change", filtrarProductos);
    }

    if (tipoSelect) {
        tipoSelect.addEventListener("change", filtrarProductos);
    }
});

function cargarProductos() {
    fetch('../api/productos.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-4 mb-4';
        card.innerHTML = `
            <div class="card producto" onclick="window.location.href='detalle_producto.html?id=${producto.id}'" style="cursor: pointer;">
                <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
                <div class="card-body">
                    <h5 class="card-title">${producto.name}</h5>
                    <p class="card-text">Precio: $${producto.price.toFixed(2)}</p>
                    <p class="card-text">Stock: ${producto.stock}</p>
                    <p class="card-text">Puffs: ${producto.puffs}</p>
                    <p class="card-text">Marca: ${producto.brand}</p>
                    <button class="btn btn-primary agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const botonesCarrito = container.querySelectorAll(".agregar-carrito");
    botonesCarrito.forEach(boton => {
        boton.addEventListener("click", (event) => {
            event.stopPropagation();
            const id = parseInt(boton.getAttribute("data-id"));
            agregarAlCarrito(id);
            alert("Producto agregado al carrito");
        });
    });
}

function agregarAlCarrito(id) {
    const producto = carrito.find(item => item.id === id);
    if (producto) {
        producto.quantity += 1;
    } else {
        fetch('../api/productos.json')
            .then(response => response.json())
            .then(data => {
                const nuevoProducto = data.find(p => p.id === id);
                if (nuevoProducto) {
                    carrito.push({ ...nuevoProducto, quantity: 1 });
                    guardarCarrito();
                }
            })
            .catch(error => console.error('Error al cargar el JSON:', error));
    }
}

function filtrarProductos() {
    const marca = document.getElementById("marca").value;
    const tipo = document.getElementById("tipo").value;

    fetch('../api/productos.json')
        .then(response => response.json())
        .then(data => {
            const productosFiltrados = data.filter(producto => {
                const marcaCoincide = marca === "" || producto.brand === marca;
                const tipoCoincide = tipo === "" || producto.type === tipo;
                return marcaCoincide && tipoCoincide;
            });
            mostrarProductos(productosFiltrados);
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}