document.addEventListener("DOMContentLoaded", () => {
    const productos = document.querySelectorAll(".producto");
    const filtros = document.querySelectorAll(".dropdown-content a");

    filtros.forEach(filtro => {
        filtro.addEventListener("click", (e) => {
            e.preventDefault();
            const filtroCaladas = filtro.textContent;

            productos.forEach(producto => {
                const caladas = producto.querySelector("p").textContent;
                producto.style.display = caladas.includes(filtroCaladas) ? "block" : "none";
            });
        });
    });
});
const botonesCarrito = document.querySelectorAll(".agregar-carrito");

botonesCarrito.forEach(boton => {
    boton.addEventListener("click", () => {
        alert("Producto agregado al carrito");
    });
});

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = Array(100).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 0.5,
}));

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = canvas.height;
    });
    requestAnimationFrame(animate);
}

animate();

const botonTema = document.getElementById("toggle-tema");
botonTema.addEventListener("click", () => {
    document.body.classList.toggle("tema-oscuro");
});

// Función para filtrar productos
function filtrarProductos() {
    const marca = document.getElementById("marca").value;
    const tipo = document.getElementById("tipo").value;
    const productos = document.querySelectorAll(".producto");

    productos.forEach(producto => {
        const productoMarca = producto.getAttribute("data-marca");
        const productoTipo = producto.getAttribute("data-tipo");

        if ((marca === "" || productoMarca === marca) && (tipo === "" || productoTipo === tipo)) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });
}
