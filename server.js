//server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Middleware para manejar datos en formato JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Datos de los productos (simulando base de datos)
const productos = {
  "Camisas": [
    { talla: 3, precio: 5 },
    { talla: 4, precio: 5 },
    { talla: 6, precio: 5.5 },
    { talla: 8, precio: 5.5 },
    { talla: 10, precio: 6 },
    { talla: 12, precio: 6 },
    { talla: 13, precio: 6.5 },
    { talla: 14, precio: 6.5 },
    { talla: 15, precio: 6.5 },
    { talla: 16, precio: 7 }
  ],
  "Falda Beige": [
    { talla: 10, precio: 7.75 },
    { talla: 12, precio: 8.3 },
    { talla: 13, precio: 8.6 },
    { talla: 14, precio: 8.75 },
    { talla: 15, precio: 9 },
    { talla: 16, precio: 9.25 },
    { talla: 18, precio: 9.5 }
  ],
  "Faldas": [
    { talla: 2, precio: 4 },
    { talla: 3, precio: 4.6 },
    { talla: 4, precio: 6 },
    { talla: 6, precio: 6.6 },
    { talla: 8, precio: 7.25 },
    { talla: 10, precio: 7.6 },
    { talla: 12, precio: 8.25 },
    { talla: 13, precio: 8.5 },
    { talla: 14, precio: 8.6 },
    { talla: 15, precio: 8.85 },
    { talla: 16, precio: 9 },
    { talla: 18, precio: 9.5 },
    { talla: 20, precio: 9.5 }
  ],
  "Pantalones": [
    { talla: 1, precio: 4.6 },
    { talla: 2, precio: 5.3 },
    { talla: 3, precio: 5.75 },
    { talla: 4, precio: 6.5 },
    { talla: 5, precio: 7.15 },
    { talla: 6, precio: 7.6 },
    { talla: 7, precio: 8.25 },
    { talla: 8, precio: 8.7 },
    { talla: 9, precio: 9.25 },
    { talla: 10, precio: 10 },
    { talla: 12, precio: 10.25 },
    { talla: 14, precio: 10.4 },
    { talla: 28, precio: 11.75 },
    { talla: 30, precio: 11.75 },
    { talla: 32, precio: 11.75 },
    { talla: 34, precio: 11.75 },
    { talla: 36, precio: 11.75 },
    { talla: 38, precio: 12},
    { talla: 40, precio: 12.25 },
    { talla: 42, precio: 13 },
    { talla: 44, precio: 13 },
    { talla: 46, precio: 13 }
  ]
};

// Ruta base para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para obtener los productos
app.get('/api/productos', (req, res) => {
  const categorias = Object.keys(productos);
  res.json(categorias);
});

// Endpoint para obtener las tallas y precios de un producto específico
app.get('/api/detalles', (req, res) => {
  const { categoria } = req.query;

  // Validar la categoría
  if (!categoria) {
    return res.status(400).json({ error: 'Se requiere la categoría' });
  }

  const detalles = productos[categoria];
  if (!detalles) {
    return res.status(400).json({ error: 'Categoría no válida' });
  }

  res.json(detalles);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
