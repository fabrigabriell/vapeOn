// Primero importamos la clase CarritoManager que ya tienes definida
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
    }
}

// Código principal
document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!isNaN(productId)) {
        try {
            const response = await fetch('../api/productos.json');
            if (!response.ok) throw new Error("Error al cargar los productos.");
            const productos = await response.json();

            const producto = productos.find(p => p.id === productId);
            console.log("Producto encontrado:", producto);

            if (producto) {
                // Insertar los detalles en el HTML
                document.getElementById('product-name').innerText = producto.name;
                document.getElementById('product-price').innerText = `$${producto.price.toFixed(2)}`;
                document.getElementById('product-description').innerText = producto.description;

                // Verificar y asignar imagen principal
                const productImage1 = document.getElementById('product-image-1');
                if (productImage1) productImage1.src = producto.image || "../img/default.jpg";

                // Asignar imagen secundaria según la marca
                let imagenSecundaria;
                switch (producto.brand.toLowerCase()) {
                    case "smok":
                        imagenSecundaria = "../img/smok_extra.jpg";
                        break;
                    case "voopoo":
                        imagenSecundaria = "../img/voopoo_extra.jpg";
                        break;
                    case "geekvape":
                        imagenSecundaria = "../img/geekvape_extra.jpg";
                        break;
                    default:
                        imagenSecundaria = "../img/default_extra.jpg";
                }

                const productImage2 = document.getElementById('product-image-2');
                if (productImage2) productImage2.src = imagenSecundaria;

                // Manejar el selector de cantidad
                const quantityInput = document.getElementById('cantidad');
                if (quantityInput) {
                    quantityInput.addEventListener('change', function() {
                        const value = parseInt(this.value);
                        if (value < 1) this.value = 1;
                    });
                }

                // Verificar si el botón de agregar al carrito existe
                const addToCartBtn = document.getElementById('add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', function () {
                        const quantity = parseInt(document.getElementById('cantidad').value) || 1;
                        const productoParaCarrito = {
                            ...producto,
                            quantity: quantity
                        };
                        
                        console.log("Botón de agregar al carrito clickeado");
                        console.log("Producto a agregar:", productoParaCarrito);
                        
                        CarritoManager.agregarProducto(productoParaCarrito);
                        alert(`${quantity} unidad(es) de ${producto.name} ha(n) sido agregada(s) al carrito.`);
                    });
                } else {
                    console.error("Botón 'Agregar al carrito' no encontrado.");
                }

                // Cargar reseñas
                const reviewsContainer = document.getElementById('reviews-container');
                reviewsContainer.innerHTML = "";
                const reviews = producto.reviews || [];

                if (reviews.length > 0) {
                    reviews.forEach(review => {
                        const reviewItem = document.createElement('div');
                        reviewItem.className = 'review-item';
                        reviewItem.innerHTML = `<strong>Usuario</strong><p>${review}</p>`;
                        reviewsContainer.appendChild(reviewItem);
                    });
                } else {
                    reviewsContainer.innerHTML = "<p>No hay reseñas aún.</p>";
                }
            } else {
                document.querySelector('.detalle-producto').innerHTML = '<h2>Producto no encontrado</h2>';
            }
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            document.querySelector('.detalle-producto').innerHTML = '<h2>Error al cargar los detalles del producto</h2>';
        }
    } else {
        document.querySelector('.detalle-producto').innerHTML = '<h2>Producto no encontrado</h2>';
    }
});