-- Base de ejemplo que imita al sistema de gestión viejo.
-- Solo para probar en local. En producción la API apunta a la base real.

CREATE DATABASE IF NOT EXISTS legacy_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE legacy_demo;

CREATE TABLE IF NOT EXISTS provincias (
  id_provincia SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clientes (
  id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  razon_social VARCHAR(120) NOT NULL,
  cuit CHAR(13) NOT NULL UNIQUE,
  email VARCHAR(160) NULL,
  telefono VARCHAR(30) NULL,
  id_provincia SMALLINT UNSIGNED NOT NULL,
  fecha_alta DATE NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (id_provincia) REFERENCES provincias (id_provincia)
);

CREATE TABLE IF NOT EXISTS rubros (
  id_rubro SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS articulos (
  id_articulo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  descripcion VARCHAR(120) NOT NULL,
  id_rubro SMALLINT UNSIGNED NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_rubro) REFERENCES rubros (id_rubro)
);

CREATE TABLE IF NOT EXISTS facturas (
  id_factura INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  punto_venta SMALLINT UNSIGNED NOT NULL,
  numero INT UNSIGNED NOT NULL,
  id_cliente INT UNSIGNED NOT NULL,
  fecha DATETIME NOT NULL,
  UNIQUE KEY uq_factura (punto_venta, numero),
  FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
);

CREATE TABLE IF NOT EXISTS factura_items (
  id_factura INT UNSIGNED NOT NULL,
  renglon SMALLINT UNSIGNED NOT NULL,
  id_articulo INT UNSIGNED NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id_factura, renglon),
  FOREIGN KEY (id_factura) REFERENCES facturas (id_factura),
  FOREIGN KEY (id_articulo) REFERENCES articulos (id_articulo)
);

-- tabla vieja sin clave primaria: la API la puede leer pero no escribir
CREATE TABLE IF NOT EXISTS log_sistema_viejo (
  fecha DATETIME NOT NULL,
  usuario VARCHAR(30) NOT NULL,
  mensaje VARCHAR(255) NOT NULL
);

INSERT IGNORE INTO provincias (id_provincia, nombre) VALUES
  (1, 'Buenos Aires'), (2, 'Córdoba'), (3, 'Santa Fe'), (4, 'Mendoza'), (5, 'Tucumán');

INSERT IGNORE INTO rubros (id_rubro, descripcion) VALUES
  (1, 'Ferretería'), (2, 'Electricidad'), (3, 'Pinturería'), (4, 'Sanitarios');

INSERT IGNORE INTO clientes (id_cliente, razon_social, cuit, email, telefono, id_provincia, fecha_alta, activo) VALUES
  (1, 'Construcciones del Sur SRL', '30-71234567-8', 'compras@delsur.com.ar', '011 4567-1200', 1, '2019-03-11', 1),
  (2, 'Ferretería Don Aldo', '20-28765432-1', 'aldo@donaldo.com.ar', '0351 422-8811', 2, '2020-07-02', 1),
  (3, 'Electro Litoral SA', '30-70987654-3', 'admin@electrolitoral.com', '0342 455-9021', 3, '2018-11-20', 1),
  (4, 'Pinturas Cuyo', '27-31456789-0', NULL, '0261 423-7788', 4, '2021-01-15', 0),
  (5, 'Obras Norte SAS', '30-71888777-5', 'obras@norte.com.ar', NULL, 5, '2022-05-30', 1);

INSERT IGNORE INTO articulos (id_articulo, codigo, descripcion, id_rubro, precio, stock) VALUES
  (1, 'FER-0001', 'Martillo carpintero 27mm', 1, 15890.00, 42),
  (2, 'FER-0002', 'Destornillador philips PH2', 1, 4320.50, 120),
  (3, 'ELE-0001', 'Cable unipolar 2.5mm x 100m', 2, 89500.00, 18),
  (4, 'ELE-0002', 'Térmica bipolar 20A', 2, 23750.00, 35),
  (5, 'PIN-0001', 'Látex interior blanco 20L', 3, 112300.00, 9),
  (6, 'SAN-0001', 'Canilla monocomando cocina', 4, 67800.00, 14);

INSERT IGNORE INTO facturas (id_factura, punto_venta, numero, id_cliente, fecha) VALUES
  (1, 1, 10231, 1, '2026-09-01 10:15:00'),
  (2, 1, 10232, 2, '2026-09-02 16:40:00'),
  (3, 2, 551, 3, '2026-09-10 09:05:00');

INSERT IGNORE INTO factura_items (id_factura, renglon, id_articulo, cantidad, precio_unitario) VALUES
  (1, 1, 1, 2, 15890.00), (1, 2, 3, 1, 89500.00),
  (2, 1, 2, 10, 4320.50),
  (3, 1, 4, 4, 23750.00), (3, 2, 5, 1, 112300.00);

INSERT INTO log_sistema_viejo (fecha, usuario, mensaje)
SELECT '2026-09-01 08:00:00', 'admin', 'Cierre de caja' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM log_sistema_viejo);
