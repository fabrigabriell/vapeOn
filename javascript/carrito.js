class CarritoManager {
    static STORAGE_KEY = 'carrito';

    static cargar() {
        try {
            const carrito = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            console.log("Carrito cargado:", carrito);
            return carrito;
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            return [];
        }
    }

    static guardar(carrito) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
            console.log("Carrito guardado:", carrito);
        } catch (error) {
            console.error("Error al guardar el carrito:", error);
        }
    }

    static agregarProducto(producto) {
        const carrito = this.cargar();
        const index = carrito.findIndex(item => item.id === producto.id);

        if (index === -1) {
            carrito.push(producto);
        } else {
            carrito[index].quantity += producto.quantity;
        }

        this.guardar(carrito);
        if (this.esPaginaCarrito()) {
            this.actualizarUI();
        }
    }

    static eliminarProducto(id) {
        const carrito = this.cargar();
        const index = carrito.findIndex(item => item.id == id);
        
        if (index !== -1) {
            if (carrito[index].quantity > 1) {
                carrito[index].quantity--;
                console.log(`Reducida una unidad del producto ${carrito[index].name}`);
            } else {
                carrito.splice(index, 1);
                console.log(`Eliminado el producto del carrito`);
            }
            
            this.guardar(carrito);
            if (this.esPaginaCarrito()) {
                this.actualizarUI();
            }
        }
    }

    static vaciarCarrito() {
        this.guardar([]); // Guardar un carrito vacío
        if (this.esPaginaCarrito()) {
            this.actualizarUI();
        }
    }

    static actualizarUI() {
        if (!this.esPaginaCarrito()) {
            return;
        }

        const carrito = this.cargar();
        const productosContainer = document.getElementById("productos-container");
        const cartSummary = document.querySelector(".cart-summary p");
        
        if (!productosContainer) {
            console.error("Contenedor de productos no encontrado");
            return;
        }

        productosContainer.innerHTML = "";
        let totalCarrito = 0;

        carrito.forEach(producto => {
            const subtotal = producto.price * producto.quantity;
            totalCarrito += subtotal;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.name}</td>
                <td>$${producto.price.toFixed(2)}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <input type="number" 
                               class="form-control quantity-input" 
                               data-id="${producto.id}" 
                               value="${producto.quantity}" 
                               min="1" 
                               max="${producto.stock || 99}">
                    </div>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td class="text-end"> <!-- Alineación a la derecha -->
                    <button class="btn btn-danger btn-sm eliminar-producto" 
                            data-id="${producto.id}" 
                            title="Eliminar una unidad">
                        -1
                    </button>
                </td>
            `;
            productosContainer.appendChild(fila);
        });

        if (cartSummary) {
            cartSummary.innerHTML = `<strong>Total:</strong> $${totalCarrito.toFixed(2)}`;
        }

        // Agregar botón para vaciar el carrito solo si hay productos
        if (carrito.length > 0) {
            const vaciarCarritoBtn = document.createElement("button");
            vaciarCarritoBtn.className = "btn btn-warning vaciar-carrito";
            vaciarCarritoBtn.innerText = "Vaciar Carrito";
            vaciarCarritoBtn.onclick = () => {
                if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                    this.vaciarCarrito();
                }
            };
            productosContainer.appendChild(vaciarCarritoBtn);
        }
    }

    static inicializarEventos() {
        if (!this.esPaginaCarrito()) {
            return;
        }

        const productosContainer = document.getElementById("productos-container");
        
        if (productosContainer) {
            productosContainer.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                
                if (e.target.classList.contains("eliminar-producto")) {
                    this.eliminarProducto(id);
                }
            });

            productosContainer.addEventListener("change", (e) => {
                if (e.target.classList.contains("quantity-input")) {
                    const id = e.target.getAttribute("data-id");
                    const cantidad = parseInt(e.target.value);
                    this.actualizarCantidad(id, cantidad);
                }
            });
        }
    }

    static esPaginaCarrito() {
        return window.location.pathname.includes('carrito.html');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (CarritoManager.esPaginaCarrito()) {
        CarritoManager.actualizarUI();
        CarritoManager.inicializarEventos();
    }
});