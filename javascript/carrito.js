class CarritoManager {
    static STORAGE_KEY = 'carrito';

    static cargar() {
        try {
            const carrito = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
            return carrito;
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
            if (carrito[index].quantity > 1) {
                carrito[index].quantity--;
            } else {
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
                <td class="text-end">
                    <button class="btn btn-danger btn-sm eliminar-producto" 
                            data-id="${producto.id}" 
                            title="Eliminar una unidad">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            productosContainer.appendChild(fila);
        });
    
        if (cartSummary) {
            cartSummary.innerHTML = `<strong>Total:</strong> $${totalCarrito.toFixed(2)}`;
        }
    
        // Agregar botón para vaciar el carrito solo si hay productos
        const vaciarCarritoBtnContainer = document.createElement("div");
        vaciarCarritoBtnContainer.className = "text-end mt-3"; // Añadir margen superior para separación
    
        if (carrito.length > 0) {
            const vaciarCarritoBtn = document.createElement("button");
            vaciarCarritoBtn.className = "btn btn-warning vaciar-carrito";
            vaciarCarritoBtn.innerText = "Vaciar Carrito";
            vaciarCarritoBtn.onclick = () => {
                if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                    this.vaciarCarrito();
                }
            };
            vaciarCarritoBtnContainer.appendChild(vaciarCarritoBtn);
        }
    
        // Asegúrate de que el botón de proceder al pago esté presente
        const procederPagoBtn = document.getElementById("proceder-pago");
        if (procederPagoBtn) {
            procederPagoBtn.parentNode.insertBefore(vaciarCarritoBtnContainer, procederPagoBtn.nextSibling);
        }
    }

    static inicializarEventos() {
        if (!this.esPaginaCarrito()) {
            return;
        }
    
        const productosContainer = document.getElementById("productos-container");
        const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    
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
    
        // Asignar evento al botón de vaciar carrito
        if (vaciarCarritoBtn) {
            vaciarCarritoBtn.addEventListener("click", () => {
                if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
                    this.vaciarCarrito();
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