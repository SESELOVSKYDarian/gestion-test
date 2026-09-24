-- Correr en el MariaDB del sistema viejo, con un usuario administrador.
-- Reemplazar:
--   nombre_base     → base del sistema de gestión
--   IP_EASYPANEL    → IP del VPS (o de la VPN, ej. 100.x.x.x de Tailscale)
--   las contraseñas → valores largos y aleatorios

-- usuario de solo lectura: lo usa la API para todas las consultas
CREATE USER IF NOT EXISTS 'gw_lectura'@'IP_EASYPANEL' IDENTIFIED BY 'CAMBIAR_CLAVE_LECTURA';
GRANT SELECT ON nombre_base.* TO 'gw_lectura'@'IP_EASYPANEL';

-- usuario de escritura: solo se usa cuando el panel está en "Lectura y escritura"
-- sin DELETE a propósito si no se quiere permitir borrar; agregarlo solo si hace falta
CREATE USER IF NOT EXISTS 'gw_escritura'@'IP_EASYPANEL' IDENTIFIED BY 'CAMBIAR_CLAVE_ESCRITURA';
GRANT SELECT, INSERT, UPDATE, DELETE ON nombre_base.* TO 'gw_escritura'@'IP_EASYPANEL';

-- para restringir la escritura a algunas tablas, cambiar la línea de arriba por:
-- GRANT SELECT ON nombre_base.* TO 'gw_escritura'@'IP_EASYPANEL';
-- GRANT INSERT, UPDATE ON nombre_base.clientes TO 'gw_escritura'@'IP_EASYPANEL';

FLUSH PRIVILEGES;
