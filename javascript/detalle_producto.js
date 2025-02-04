// Simulación de datos de productos
const productos = [
    { id: 1, name: "Dispositivo Vape A", price: 50.00, description: "Este dispositivo de vapeo ofrece una experiencia única con su diseño ergonómico y tecnología avanzada.", image: "../img/img4.jpg", reviews: ["¡Me encanta este dispositivo! Funciona perfectamente y tiene un gran sabor.", "Buena calidad, pero me gustaría que tuviera más opciones de color."] },
    { id: 2, name: "Líquido Vape B", price: 25.00, description: "Líquido de vapeo con sabor a frutas tropicales.", image: "../img/img5.jpg", reviews: ["Sabor increíble, definitivamente lo volveré a comprar."] },
    { id: 3, name: "Accesorio Vape C", price: 15.00, description: "Accesorio esencial para cualquier usuario de vapeo.", image: "../img/img6.jpg", reviews: [] }
];

// Obtener el ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// Cargar los detalles del producto
const producto = productos.find(p => p.id === productId);
if (producto) {
    document.getElementById('product-image').src = producto.image;
    document.getElementById('product-name').innerText = producto.name;
    document.getElementById('product-price').innerText = `$${producto.price.toFixed(2)}`;
    document.getElementById('product-description').innerText = producto.description;

    // Cargar reseñas
    const reviewsContainer = document.getElementById('reviews-container');
    producto.reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `<strong>Usuario</strong><p>${review}</p>`;
        reviewsContainer.appendChild(reviewItem);
    });
} else {
    document.querySelector('.detalle-producto').innerHTML = '<h2>Producto no encontrado</h2>';
}