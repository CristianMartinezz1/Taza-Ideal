-- ============================================================
--  Taza Ideal - crear la base de datos y el usuario de la aplicacion
--  Ejecutar UNA sola vez como root (MySQL Workbench o consola):
--     mysql -u root -p < database/crear_base.sql
--  Antes de ejecutarlo, cambia CAMBIA_ESTA_CLAVE por una clave segura
--  y pon esa misma clave en backend/src/main/resources/application.properties
--  Las tablas NO se crean aqui: las crea Flyway (db/migration) al arrancar.
-- ============================================================

CREATE DATABASE IF NOT EXISTS tazaideal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'tazaideal_app'@'localhost' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';

-- Permisos solo sobre la base tazaideal (no sobre todo el servidor)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
  ON tazaideal.* TO 'tazaideal_app'@'localhost';

FLUSH PRIVILEGES;
