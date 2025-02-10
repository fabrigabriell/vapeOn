// Simulación de datos del carrito
let carrito = [
    { id: 1, name: "Dispositivo Vape A", price: 50.00, quantity: 1, image: "../img/img4.jpg" },
    { id: 2, name: "Líquido Vape B", price: 25.00, quantity: 1, image: "../img/img5.jpg" }
];

// Función para renderizar el carrito
function renderizarCarrito() {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ''; // Limpiar el contenido actual

    let total = 0;

    carrito.forEach(item => {
        const totalItem = item.price * item.quantity;
        total += totalItem;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" class="img-fluid product-img">
                <span class="product-name">${item.name}</span>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="form-control quantity-input" data-id="${item.id}">
            </td>
            <td>$${totalItem.toFixed(2)}</td>
            <td><button class="btn btn-danger" data-id="${item.id}">Eliminar</button></td>
        `;
        tbody.appendChild(row);
    });

    // Actualizar el total en el resumen del carrito
    document.querySelector('.cart-summary p').innerText = `Total: $${total.toFixed(2)}`;
}

// Función para manejar la eliminación de un producto
function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderizarCarrito();
}

// Función para manejar la actualización de la cantidad
function actualizarCantidad(id, cantidad) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.quantity = cantidad;
        renderizarCarrito();
    }
}

// Evento de carga del documento
document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();

    // Manejar el evento de clic en los botones de eliminar
    document.querySelector("tbody").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-danger")) {
            const id = parseInt(e.target.getAttribute("data-id"));
            eliminarProducto(id);
        }
    });

    // Manejar el evento de cambio en las cantidades
    document.querySelector("tbody").addEventListener("input", (e) => {
        if (e.target.classList.contains("quantity-input")) {
            const id = parseInt(e.target.getAttribute("data-id"));
            const cantidad = parseInt(e.target.value);
            actualizarCantidad(id, cantidad);
        }
    });
});