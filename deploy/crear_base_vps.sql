-- ============================================================
--  Taza Ideal - base de datos en el VPS
--  Usa nombres distintos a los del proyecto anterior (tazaideal)
--  para no tocar sus datos. Ejecutar UNA sola vez como root:
--     sudo mysql < deploy/crear_base_vps.sql
--  Antes, cambia CAMBIA_ESTA_CLAVE por una clave segura y pon la misma
--  en /opt/taza-ideal/application.properties (spring.datasource.password).
--  Las tablas las crea Flyway al arrancar el backend.
-- ============================================================

CREATE DATABASE IF NOT EXISTS taza_ideal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'taza_ideal_app'@'localhost' IDENTIFIED BY 'CAMBIA_ESTA_CLAVE';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
  ON taza_ideal.* TO 'taza_ideal_app'@'localhost';

FLUSH PRIVILEGES;
