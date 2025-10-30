-- MySQL syntax
-- Borra las tablas si ya existen, para empezar de cero
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS categorias;

-- Creación de la tabla de Categorías
CREATE TABLE categorias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (nombre)
);

-- Creación de la tabla de Usuarios
CREATE TABLE usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contraseña VARCHAR(60) NOT NULL, -- 60 para el hash BCrypt
    rol VARCHAR(20) NOT NULL,
    estado VARCHAR(10) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
);

-- Creación de la tabla de Productos
CREATE TABLE productos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    precio BIGINT NOT NULL, -- Para pesos chilenos (Long)
    stock INTEGER NOT NULL,
    imagen VARCHAR(255),
    estado VARCHAR(10) NOT NULL,
    fecha_creacion DATETIME NOT NULL,
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    -- Definición de la Llave Foránea
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);