class CarritoManager {
    static STORAGE_KEY = 'carrito';

    static cargar() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
        } catch (error) {
            return [];
        }
    }

    static guardar(carrito) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
        } catch (error) {
            alert("Error al guardar el carrito. Por favor, inténtalo de nuevo.");
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
            // Resta 1 a la cantidad del producto
            if (carrito[index].quantity > 1) {
                carrito[index].quantity--;
            } else {
                // Si la cantidad es 1, elimina el producto del carrito
                carrito.splice(index, 1);
            }
    
            this.guardar(carrito);
            if (this.esPaginaCarrito()) {
                this.actualizarUI();
            }
        }
    }

    static actualizarCantidad(id, cantidad) {
        const carrito = this.cargar();
        const index = carrito.findIndex(item => item.id == id);

        if (index !== -1 && cantidad > 0) {
            carrito[index].quantity = cantidad;
            this.guardar(carrito);
            if (this.esPaginaCarrito()) {
                this.actualizarUI();
            }
        }
    }

    static vaciarCarrito() {
        this.guardar([]); 
        if (this.esPaginaCarrito()) {
            this.actualizarUI();
        }
    }
    

    static actualizarUI() {
        if (!this.esPaginaCarrito()) return;

        const carrito = this.cargar();
        const productosContainer = document.getElementById("productos-container");
        const cartSummary = document.querySelector(".cart-summary p");

        if (!productosContainer) return;

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
                    <input type="number" class="form-control quantity-input" data-id="${producto.id}" value="${producto.quantity}" min="1" max="${producto.stock || 99}">
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm eliminar-producto" data-id="${producto.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            productosContainer.appendChild(fila);
        });

        if (cartSummary) {
            cartSummary.innerHTML = `<strong>Total:</strong> $${totalCarrito.toFixed(2)}`;
        }

        // Inicializar eventos y asegurarse de que no se dupliquen
        this.inicializarEventos();
    }

    static inicializarEventos() {
        if (!this.esPaginaCarrito()) return;
    
        const productosContainer = document.getElementById("productos-container");
    
        // Eliminar previamente cualquier evento en el contenedor
        productosContainer.removeEventListener("click", this.eliminarProductoHandler);
        productosContainer.removeEventListener("change", this.actualizarCantidadHandler);
    
        // Evento para eliminar productos
        this.eliminarProductoHandler = (e) => {
            const eliminarBtn = e.target.closest(".eliminar-producto");
            if (eliminarBtn) {
                const id = eliminarBtn.getAttribute("data-id");
                e.stopPropagation(); // Prevenir la propagación del evento
                this.eliminarProducto(id);
            }
        };
        productosContainer.addEventListener("click", this.eliminarProductoHandler);
    
        // Evento para actualizar cantidad
        this.actualizarCantidadHandler = (e) => {
            if (e.target.classList.contains("quantity-input")) {
                const id = e.target.getAttribute("data-id");
                const cantidad = parseInt(e.target.value);
                this.actualizarCantidad(id, cantidad);
            }
        };
        productosContainer.addEventListener("change", this.actualizarCantidadHandler);
    
        // Evento del botón "Vaciar Carrito"
        const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
        if (vaciarCarritoBtn) {
            // Eliminar cualquier listener previo para evitar duplicación de alertas
            vaciarCarritoBtn.removeEventListener("click", this.vaciarCarritoHandler);
            this.vaciarCarritoHandler = () => {
                if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                    this.vaciarCarrito();
                }
            };
            vaciarCarritoBtn.addEventListener("click", this.vaciarCarritoHandler);
        }
    
        // *** Restaurando el evento del botón "Proceder al Pago" ***
        const procederPagoBtn = document.getElementById("proceder-pago");
        if (procederPagoBtn) {
            procederPagoBtn.removeEventListener("click", this.procederPagoHandler);
            this.procederPagoHandler = () => {
                const carrito = this.cargar();
                if (carrito.length > 0) {
                    const mensaje = carrito.map(producto => `Producto: ${producto.name}, Precio: $${producto.price}, Cantidad: ${producto.quantity}`).join('%0A');
                    const numeroWhatsApp = '+5493624852511'; // Asegúrate de tener el número correcto
                    const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=Hola,%20estoy%20interesado%20en%20los%20siguientes%20productos:%0A${mensaje}`;
                    window.open(enlaceWhatsApp, '_blank');
                } else {
                    alert("Tu carrito está vacío.");
                }
            };
            procederPagoBtn.addEventListener("click", this.procederPagoHandler);
        }
    }    

    static esPaginaCarrito() {
        return window.location.pathname.includes('carrito.html');
    }
}

// Inicializar eventos y UI al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    if (CarritoManager.esPaginaCarrito()) {
        CarritoManager.actualizarUI();
    }
});
