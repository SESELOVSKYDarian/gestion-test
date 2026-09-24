// tablas de la base del panel (3FN)
// niveles_acceso lo comparten la configuracion global y las claves de la API
export const ESQUEMA_PANEL: string[] = [
  `CREATE TABLE IF NOT EXISTS niveles_acceso (
    id TINYINT UNSIGNED PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(40) NOT NULL
  )`,
  `INSERT INTO niveles_acceso (id, codigo, nombre) VALUES
    (1, 'lectura', 'Solo lectura'),
    (2, 'escritura', 'Lectura y escritura')
   ON DUPLICATE KEY UPDATE nombre = VALUES(nombre)`,
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    nombre VARCHAR(80) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS configuracion_api (
    id TINYINT UNSIGNED PRIMARY KEY,
    nivel_id TINYINT UNSIGNED NOT NULL,
    actualizado_por INT UNSIGNED NULL,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_config_unica CHECK (id = 1),
    FOREIGN KEY (nivel_id) REFERENCES niveles_acceso (id),
    FOREIGN KEY (actualizado_por) REFERENCES usuarios (id) ON DELETE SET NULL
  )`,
  // arranca siempre en solo lectura
  `INSERT IGNORE INTO configuracion_api (id, nivel_id) VALUES (1, 1)`,
  `CREATE TABLE IF NOT EXISTS api_claves (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    clave_publica CHAR(39) NOT NULL UNIQUE,
    secreto_hash CHAR(64) NOT NULL,
    nivel_id TINYINT UNSIGNED NOT NULL,
    creada_por INT UNSIGNED NULL,
    creada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_uso_en DATETIME NULL,
    revocada_en DATETIME NULL,
    FOREIGN KEY (nivel_id) REFERENCES niveles_acceso (id),
    FOREIGN KEY (creada_por) REFERENCES usuarios (id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tablas_expuestas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(64) NOT NULL UNIQUE,
    permite_escritura TINYINT(1) NOT NULL DEFAULT 0,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS auditoria (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    api_clave_id INT UNSIGNED NULL,
    usuario_id INT UNSIGNED NULL,
    accion VARCHAR(20) NOT NULL,
    tabla VARCHAR(64) NULL,
    estado SMALLINT UNSIGNED NOT NULL,
    detalle VARCHAR(255) NULL,
    ip VARCHAR(45) NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX ix_auditoria_fecha (creado_en),
    CONSTRAINT ck_auditoria_accion CHECK (accion IN
      ('tablas', 'esquema', 'listar', 'buscar', 'crear', 'modificar', 'eliminar', 'modo', 'login')),
    FOREIGN KEY (api_clave_id) REFERENCES api_claves (id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
  )`,
];
