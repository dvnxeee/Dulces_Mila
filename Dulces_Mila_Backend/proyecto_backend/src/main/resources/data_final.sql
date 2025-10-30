-- REQUISITO: Mínimo 5 categorías de productos
INSERT INTO categorias (nombre) VALUES
('Tortas'),
('Kuchenes'),
('Galletas'),
('Pasteles'),
('Bebidas');

-- REQUISITO : Al menos 1 usuario administrador por defecto
INSERT INTO usuarios (nombre, email, contraseña, rol, estado, fecha_creacion) VALUES
(
    'Administrador',
    'admin@mila.com',
    '$2a$10$6/4z9ZLyJ27O8RX7Xb93ruPdZEJmqZjx8J/luzUGPvEQgUpTYpU.u',
    'SUPER_ADMIN',
    'ACTIVO',
    NOW() -- NOW() pone la fecha y hora actual
);

-- REQUISITO : Mínimo 15 productos realistas
-- Usamos los IDs de las categorías que creamos (1=Tortas, 2=Kuchenes, etc.)
INSERT INTO productos (nombre, descripcion, precio, stock, imagen, estado, fecha_creacion, categoria_id) VALUES
('Torta de Mil Hojas', 'Clásica torta chilena con capas de hojarasca, manjar y crema pastelera.', 18000, 10, '/uploads/2.jpg', 'ACTIVO', NOW(), 1),
('Torta Tres Leches', 'Bizcocho esponjoso bañado en tres tipos de leche, cubierto con merengue.', 15000, 12, '/uploads/2.jpg', 'ACTIVO', NOW(), 1),
('Torta de Chocolate', 'Intenso bizcocho de chocolate relleno y cubierto de ganache de chocolate.', 17000, 8, '/uploads/2.jpg', 'ACTIVO', NOW(), 1),
('Cheesecake Frutos Rojos', 'Base de galleta, crema de queso y salsa de frutos rojos.', 14000, 15, '/uploads/2.jpg', 'ACTIVO', NOW(), 1),
('Torta de Zanahoria', 'Bizcocho húmedo de zanahoria y nueces, con frosting de queso crema.', 16000, 7, '/uploads/2.jpg', 'ACTIVO', NOW(), 1),
('Kuchen de Manzana', 'Tradicional kuchen sureño con base de masa, manzanas y cubierta de miga.', 12000, 15, '/uploads/2.jpg', 'ACTIVO', NOW(), 2),
('Kuchen de Nuez', 'Base de masa dulce rellena de nueces acarameladas.', 13000, 10, '/uploads/2.jpg', 'ACTIVO', NOW(), 2),
('Kuchen de Frambuesa', 'Base de masa y crema, cubierta de frambuesas frescas.', 12500, 14, '/uploads/2.jpg', 'ACTIVO', NOW(), 2),
('Galletas de Avena y Pasas', 'Pack de 6 galletas caseras de avena con pasas.', 3500, 50, '/uploads/2.jpg', 'ACTIVO', NOW(), 3),
('Alfajores de Maicena', 'Pack de 6 alfajores rellenos de manjar y coco rallado.', 4000, 40, '/uploads/2.jpg', 'ACTIVO', NOW(), 3),
('Pastel de Chirimoya Alegre', 'Suave bizcocho relleno de crema de chirimoya y un toque de naranja.', 16000, 8, '/uploads/2.jpg', 'ACTIVO', NOW(), 4),
('Brazo de Reina', 'Clásico brazo de reina relleno de manjar y cubierto de azúcar flor.', 9000, 20, '/uploads/2.jpg', 'ACTIVO', NOW(), 4),
('Eclairs de Chocolate', 'Pack de 4 eclairs rellenos de crema pastelera y cubiertos de chocolate.', 5000, 25, '/uploads/2.jpg', 'ACTIVO', NOW(), 4),
('Café de Grano (Bolsa)', 'Bolsa de 250g de café de grano tostado artesanal.', 8000, 30, '/uploads/2.jpg', 'ACTIVO', NOW(), 5),
('Jugo Natural de Naranja', 'Botella de 1L de jugo de naranja recién exprimido.', 4500, 20, '/uploads/2.jpg', 'ACTIVO', NOW(), 5);