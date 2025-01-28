// script.js

// Llenar el select de cantidad con valores de 1 a 100
const cantidadSelect = document.getElementById('cantidad');
for (let i = 1; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    cantidadSelect.appendChild(option);
}

// Llenar el select de productos con opciones dinámicas desde el servidor
const productoSelect = document.getElementById('producto');
const tallaSelect = document.getElementById('talla'); // Mover esta línea aquí
fetch('/api/productos')
    .then(response => response.json())
    .then(data => {
        data.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto;
            option.textContent = producto;
            productoSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los productos:', error));

// Actualizar el select de tallas cuando se selecciona un producto
productoSelect.addEventListener('change', () => {
    const selectedProducto = productoSelect.value;
    tallaSelect.innerHTML = ''; // Limpiar tallas anteriores

    if (selectedProducto) {
        fetch(`/api/detalles?categoria=${selectedProducto}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.talla;
                    option.textContent = `Talla: ${item.talla} - $${item.precio}`;
                    tallaSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar las tallas:', error));
    }
});

// Variables
const agregarBtn = document.getElementById('agregar');
const tablaProductos = document.getElementById('productosTabla').querySelector('tbody');
const totalSpan = document.getElementById('total');

// Carrito de compras
let carrito = [];

// Función para agregar productos
agregarBtn.addEventListener('click', () => {
    const producto = productoSelect.value;
    const talla = tallaSelect.value;
    const cantidad = parseInt(cantidadSelect.value);

    fetch(`/api/detalles?categoria=${producto}`)
        .then(response => response.json())
        .then(data => {
            const precioUnitario = data.find(item => item.talla === parseInt(talla)).precio;
            const total = precioUnitario * cantidad;

            carrito.push({ producto, talla, precioUnitario, cantidad, total });

            actualizarTabla();
        })
        .catch(error => console.error('Error al obtener el precio del producto:', error));
});

// Función para actualizar la tabla
function actualizarTabla() {
    tablaProductos.innerHTML = '';
    let totalCompra = 0;

    carrito.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.producto}</td>
            <td>${item.talla}</td>
            <td>$${item.precioUnitario.toFixed(2)}</td>
            <td>${item.cantidad}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td><button class="eliminar" data-index="${index}">Eliminar</button></td>
        `;

        tablaProductos.appendChild(row);
        totalCompra += item.total;
    });

    totalSpan.textContent = totalCompra.toFixed(2);

    // Asignar eventos de eliminación
    document.querySelectorAll('.eliminar').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            eliminarProducto(index);
        });
    });
}

// Función para eliminar un producto
function eliminarProducto(index) {
    carrito.splice(index, 1);  // Elimina el producto del carrito
    actualizarTabla();          // Actualiza la tabla después de eliminar
}

// Botón para imprimir
document.getElementById('imprimirTicket').addEventListener('click', () => {
    const ticketTabla = document.getElementById('ticketTabla');
    const ticketTotal = document.getElementById('ticketTotal');
    ticketTabla.innerHTML = '';  // Limpia la tabla de impresión

    let totalCompra = 0;

    carrito.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.producto}</td>
            <td>${item.talla}</td>
            <td>$${item.precioUnitario.toFixed(2)}</td>
            <td>${item.cantidad}</td>
            <td>$${item.total.toFixed(2)}</td>
        `;
        ticketTabla.appendChild(row);
        totalCompra += item.total;
    });

    ticketTotal.textContent = totalCompra.toFixed(2);

    // Mostrar el ticket y ocultar la página principal
    document.getElementById('ticketImpresion').style.visibility = 'visible';
    document.getElementById('app').style.visibility = 'hidden';

    window.print(); // Imprime el ticket

    // Ocultar la vista del ticket y mostrar la vista principal nuevamente
    document.getElementById('ticketImpresion').style.visibility = 'hidden';
    document.getElementById('app').style.visibility = 'visible';
});
