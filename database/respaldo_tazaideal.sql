-- ============================================================
--  Taza Ideal - respaldo completo de la base de datos (mysqldump)
--  Esquema + datos de prueba. Las contrasenas estan hasheadas con BCrypt.
--  Restaurar en una base vacia:
--     mysql -u root -p tazaideal < database/respaldo_tazaideal.sql
-- ============================================================


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categorias_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Espresso','Bebidas a base de espresso, intensas y cortas',1),(2,'Con leche','Bebidas calientes con leche espumada',1),(3,'Frios','Bebidas frias y frappes',1),(4,'Filtrados','Cafe de metodo: goteo, prensa y pour over',1),(5,'Panaderia','Pan dulce y snacks para acompanar',1),(6,'Granos','Cafe en grano para llevar a casa',1);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `producto_id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `tamano` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leche` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_detalle_pedido` (`pedido_id`),
  KEY `ix_detalle_producto` (`producto_id`),
  CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  CONSTRAINT `ck_detalle_cantidad` CHECK ((`cantidad` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,5,1,65.00,'Grande','Entera'),(2,1,13,1,38.00,NULL,NULL),(3,2,2,2,42.00,'Mediano',NULL),(4,3,8,1,75.00,'Grande','Entera'),(5,3,14,2,25.00,NULL,NULL),(6,4,6,1,68.00,'Mediano','Avena'),(7,5,4,2,58.00,'Mediano','Deslactosada'),(8,6,9,1,62.00,'Grande',NULL),(9,6,13,1,38.00,NULL,NULL),(10,7,11,2,40.00,'Mediano',NULL),(11,7,14,1,25.00,NULL,NULL),(12,8,1,1,45.00,'Chico',NULL),(13,9,10,1,66.00,'Grande','Entera'),(14,9,12,1,70.00,'Mediano',NULL),(15,10,5,1,65.00,'Mediano','Avena'),(16,11,7,1,60.00,'Grande','Entera'),(17,12,4,1,58.00,'Grande','Entera'),(18,12,13,1,38.00,NULL,NULL),(19,13,8,2,75.00,'Mediano','Entera'),(20,14,3,1,48.00,'Chico','Entera'),(21,15,6,1,68.00,'Grande','Entera'),(22,15,14,1,25.00,NULL,NULL),(27,18,2,1,42.00,'Chico','Leche entera');
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiquetas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_etiquetas_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `etiquetas` WRITE;
/*!40000 ALTER TABLE `etiquetas` DISABLE KEYS */;
INSERT INTO `etiquetas` VALUES (1,'caliente'),(8,'chocolate'),(6,'con leche'),(3,'dulce'),(9,'especiado'),(2,'fria'),(4,'intenso'),(10,'para comer'),(7,'sin leche'),(5,'suave');
/*!40000 ALTER TABLE `etiquetas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','esquema','SQL','V1__esquema.sql',-475342698,'tazaideal_app','2026-11-27 13:42:00',1044,1),(2,'2','datos prueba','SQL','V2__datos_prueba.sql',-1338150040,'tazaideal_app','2026-11-27 13:46:28',179,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `codigo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` bigint NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `hora_recogida` datetime DEFAULT NULL,
  `notas` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pedidos_codigo` (`codigo`),
  KEY `ix_pedidos_usuario` (`usuario_id`),
  KEY `ix_pedidos_estado_fecha` (`estado`,`creado_en`),
  CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `ck_pedidos_estado` CHECK ((`estado` in (_utf8mb4'PENDIENTE',_utf8mb4'EN_PREPARACION',_utf8mb4'LISTO',_utf8mb4'ENTREGADO',_utf8mb4'CANCELADO'))),
  CONSTRAINT `ck_pedidos_total` CHECK ((`total` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,'TI-1001',4,'ENTREGADO','2026-11-18 14:25:00',NULL,103.00,'2026-11-18 14:10:00','2026-11-18 14:10:00'),(2,'TI-1002',5,'ENTREGADO','2026-11-19 15:40:00','Sin azucar',84.00,'2026-11-19 15:25:00','2026-11-19 15:25:00'),(3,'TI-1003',6,'ENTREGADO','2026-11-20 16:55:00',NULL,125.00,'2026-11-20 16:40:00','2026-11-20 16:40:00'),(4,'TI-1004',7,'CANCELADO','2026-11-21 13:20:00',NULL,68.00,'2026-11-21 13:05:00','2026-11-21 13:05:00'),(5,'TI-1005',8,'ENTREGADO','2026-11-22 17:45:00',NULL,116.00,'2026-11-22 17:30:00','2026-11-22 17:30:00'),(6,'TI-1006',9,'ENTREGADO','2026-11-23 15:05:00',NULL,100.00,'2026-11-23 14:50:00','2026-11-23 14:50:00'),(7,'TI-1007',10,'ENTREGADO','2026-11-24 15:30:00','Para llevar',105.00,'2026-11-24 15:15:00','2026-11-24 15:15:00'),(8,'TI-1008',4,'ENTREGADO','2026-11-25 16:15:00',NULL,45.00,'2026-11-25 16:00:00','2026-11-25 16:00:00'),(9,'TI-1009',11,'ENTREGADO','2026-11-25 18:35:00',NULL,136.00,'2026-11-25 18:20:00','2026-11-25 18:20:00'),(10,'TI-1010',12,'LISTO','2026-11-26 14:50:00',NULL,65.00,'2026-11-26 14:35:00','2026-11-26 14:35:00'),(11,'TI-1011',5,'LISTO','2026-11-26 15:25:00',NULL,60.00,'2026-11-26 15:10:00','2026-11-26 15:10:00'),(12,'TI-1012',6,'EN_PREPARACION','2026-11-26 16:00:00','Extra caliente',96.00,'2026-11-26 15:45:00','2026-11-26 15:45:00'),(13,'TI-1013',13,'EN_PREPARACION','2026-11-26 16:20:00',NULL,150.00,'2026-11-26 16:05:00','2026-11-26 16:05:00'),(14,'TI-1014',7,'PENDIENTE','2026-11-26 16:45:00',NULL,48.00,'2026-11-26 16:30:00','2026-11-26 16:30:00'),(15,'TI-1015',8,'PENDIENTE','2026-11-26 16:55:00','Recojo en 20 min',93.00,'2026-11-26 16:40:00','2026-11-26 16:40:00'),(18,'TI-1018',4,'LISTO','2026-11-28 03:26:00',NULL,42.00,'2026-11-28 03:01:54','2026-11-28 03:15:27');
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `producto_etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_etiquetas` (
  `producto_id` bigint NOT NULL,
  `etiqueta_id` bigint NOT NULL,
  PRIMARY KEY (`producto_id`,`etiqueta_id`),
  KEY `ix_pe_etiqueta` (`etiqueta_id`),
  CONSTRAINT `fk_pe_etiqueta` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pe_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `producto_etiquetas` WRITE;
/*!40000 ALTER TABLE `producto_etiquetas` DISABLE KEYS */;
INSERT INTO `producto_etiquetas` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(11,1),(12,1),(8,2),(9,2),(10,2),(5,3),(6,3),(8,3),(10,3),(14,3),(1,4),(3,4),(9,4),(15,4),(2,5),(4,5),(12,5),(3,6),(4,6),(5,6),(6,6),(7,6),(8,6),(10,6),(1,7),(2,7),(9,7),(11,7),(12,7),(6,8),(8,8),(7,9),(11,9),(13,10),(14,10);
/*!40000 ALTER TABLE `producto_etiquetas` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `categoria_id` bigint NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_productos_nombre` (`nombre`),
  KEY `ix_productos_categoria` (`categoria_id`),
  KEY `ix_productos_disponible` (`disponible`),
  CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `ck_productos_precio` CHECK ((`precio` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Espresso doble','Doble carga de espresso, cuerpo intenso y crema espesa.',45.00,'/img/espresso-doble.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(2,1,'Americano','Espresso con agua caliente, suave y aromatico.',42.00,'/img/americano.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(3,1,'Cortado','Espresso con un toque de leche texturizada.',48.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(4,2,'Capuchino','Espresso, leche y abundante espuma con canela.',58.00,'/img/capuchino.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(5,2,'Latte caramelo','Espresso con leche y jarabe de caramelo.',65.00,'/img/latte-caramelo.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(6,2,'Mocha','Espresso con chocolate y leche, coronado con cacao.',68.00,'/img/mocha.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(7,2,'Chai latte','Te chai especiado con leche espumada.',60.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(8,3,'Frappe moka','Cafe, chocolate y hielo licuados con crema batida.',75.00,'/img/frappe-moka.png',1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(9,3,'Cold brew','Cafe extraido en frio por 18 horas, sin amargor.',62.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(10,3,'Latte helado de vainilla','Espresso, leche fria y vainilla sobre hielo.',66.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(11,4,'Cafe de olla','Cafe con piloncillo y canela, receta tradicional.',40.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(12,4,'Pour over Chiapas','Metodo V60 con grano de Chiapas, notas citricas.',70.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(13,5,'Croissant de mantequilla','Hojaldre horneado cada manana.',38.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(14,5,'Concha de vainilla','Pan dulce tradicional.',25.00,NULL,1,'2026-11-27 07:46:28','2026-11-27 07:46:28'),(15,6,'Grano Veracruz 250 g','Tueste medio, notas a chocolate y nuez.',180.00,NULL,0,'2026-11-27 07:46:28','2026-11-27 07:46:28');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `resultados_encuesta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultados_encuesta` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `producto_id` bigint NOT NULL,
  `respuestas` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coincidencia` int NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_resultados_usuario` (`usuario_id`),
  KEY `ix_resultados_producto` (`producto_id`),
  CONSTRAINT `fk_resultados_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
  CONSTRAINT `fk_resultados_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ck_resultados_coincidencia` CHECK ((`coincidencia` between 0 and 100))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `resultados_encuesta` WRITE;
/*!40000 ALTER TABLE `resultados_encuesta` DISABLE KEYS */;
INSERT INTO `resultados_encuesta` VALUES (1,4,5,'{\"temperatura\": \"caliente\", \"sabor\": \"dulce\", \"leche\": \"si\", \"intensidad\": \"suave\", \"chocolate\": \"no\", \"momento\": \"tarde\"}',92,'2026-11-10 12:00:00'),(2,5,2,'{\"temperatura\": \"caliente\", \"sabor\": \"amargo\", \"leche\": \"no\", \"intensidad\": \"suave\", \"chocolate\": \"no\", \"momento\": \"manana\"}',88,'2026-11-11 12:00:00'),(3,6,8,'{\"temperatura\": \"fria\", \"sabor\": \"dulce\", \"leche\": \"si\", \"intensidad\": \"suave\", \"chocolate\": \"si\", \"momento\": \"tarde\"}',95,'2026-11-12 12:00:00'),(4,7,6,'{\"temperatura\": \"caliente\", \"sabor\": \"dulce\", \"leche\": \"si\", \"intensidad\": \"media\", \"chocolate\": \"si\", \"momento\": \"noche\"}',90,'2026-11-13 12:00:00'),(5,8,4,'{\"temperatura\": \"caliente\", \"sabor\": \"equilibrado\", \"leche\": \"si\", \"intensidad\": \"suave\", \"chocolate\": \"no\", \"momento\": \"manana\"}',85,'2026-11-14 12:00:00'),(6,9,9,'{\"temperatura\": \"fria\", \"sabor\": \"amargo\", \"leche\": \"no\", \"intensidad\": \"fuerte\", \"chocolate\": \"no\", \"momento\": \"manana\"}',93,'2026-11-15 12:00:00'),(7,10,11,'{\"temperatura\": \"caliente\", \"sabor\": \"especiado\", \"leche\": \"no\", \"intensidad\": \"media\", \"chocolate\": \"no\", \"momento\": \"tarde\"}',87,'2026-11-16 12:00:00'),(8,11,10,'{\"temperatura\": \"fria\", \"sabor\": \"dulce\", \"leche\": \"si\", \"intensidad\": \"suave\", \"chocolate\": \"no\", \"momento\": \"tarde\"}',89,'2026-11-17 12:00:00'),(9,12,7,'{\"temperatura\": \"caliente\", \"sabor\": \"especiado\", \"leche\": \"si\", \"intensidad\": \"suave\", \"chocolate\": \"no\", \"momento\": \"noche\"}',84,'2026-11-18 12:00:00'),(10,13,1,'{\"temperatura\": \"caliente\", \"sabor\": \"amargo\", \"leche\": \"no\", \"intensidad\": \"fuerte\", \"chocolate\": \"no\", \"momento\": \"manana\"}',96,'2026-11-19 12:00:00');
/*!40000 ALTER TABLE `resultados_encuesta` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','Acceso total: usuarios, productos, categorias y pedidos'),(2,'BARISTA','Prepara los pedidos y cambia su estado'),(3,'CLIENTE','Contesta la encuesta, hace y sigue sus pedidos');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tokens_recuperacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_recuperacion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `token` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_en` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tokens_recuperacion_token` (`token`),
  KEY `ix_tokens_recuperacion_usuario` (`usuario_id`),
  CONSTRAINT `fk_tokens_recuperacion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tokens_recuperacion` WRITE;
/*!40000 ALTER TABLE `tokens_recuperacion` DISABLE KEYS */;
INSERT INTO `tokens_recuperacion` VALUES (2,4,'FxPDsm9Ev2LtHcPwaQ5frC-IgGqNERQejJdHXyGyFPY','2026-11-28 04:06:55',1);
/*!40000 ALTER TABLE `tokens_recuperacion` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `tokens_revocados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens_revocados` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `jti` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_en` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tokens_revocados_jti` (`jti`),
  KEY `ix_tokens_revocados_expira` (`expira_en`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tokens_revocados` WRITE;
/*!40000 ALTER TABLE `tokens_revocados` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens_revocados` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rol_id` bigint NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `correo_verificado` tinyint(1) NOT NULL DEFAULT '0',
  `codigo_verificacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_vence_en` datetime DEFAULT NULL,
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`),
  KEY `ix_usuarios_rol` (`rol_id`),
  KEY `ix_usuarios_activo` (`activo`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'Administrador Taza Ideal','admin@tazaideal.com','$2a$10$LHHUvZGKyLh9Q39tOK/iZuiPjKkxIgX2mXnLk/aSGljMpvc9iKleq','5510000001',NULL,1,1,NULL,NULL,'2026-11-01 15:00:00','2026-11-27 07:46:28'),(2,2,'Andres Rios','andres@tazaideal.com','$2a$10$f9tGSM/46E07gbHJhwG.vO4icfktba582FI77zAqK0IRVGi3M7/7G','5510000002',NULL,1,1,NULL,NULL,'2026-11-02 15:00:00','2026-11-27 07:46:28'),(3,2,'Valentina Cruz','valentina@tazaideal.com','$2a$10$f9tGSM/46E07gbHJhwG.vO4icfktba582FI77zAqK0IRVGi3M7/7G','5510000003',NULL,1,1,NULL,NULL,'2026-11-03 15:00:00','2026-11-27 07:46:28'),(4,3,'Lucia Hernandez','lucia.hernandez@example.com','$2a$10$lUQBRwvPEzz.qO..3eTKiuL/zk/xpYX42AbiEbe9dt0K5Elox7yiq','5520000004',NULL,1,1,NULL,NULL,'2026-11-04 15:00:00','2026-11-28 03:37:13'),(5,3,'Mateo Ramirez','mateo.ramirez@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000005',NULL,1,1,NULL,NULL,'2026-11-05 15:00:00','2026-11-27 07:46:28'),(6,3,'Sofia Torres','sofia.torres@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000006',NULL,1,1,NULL,NULL,'2026-11-06 15:00:00','2026-11-27 07:46:28'),(7,3,'Diego Morales','diego.morales@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000007',NULL,1,1,NULL,NULL,'2026-11-07 15:00:00','2026-11-27 07:46:28'),(8,3,'Camila Vargas','camila.vargas@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000008',NULL,1,1,NULL,NULL,'2026-11-08 15:00:00','2026-11-27 07:46:28'),(9,3,'Emiliano Castro','emiliano.castro@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000009',NULL,1,1,NULL,NULL,'2026-11-09 15:00:00','2026-11-27 07:46:28'),(10,3,'Regina Flores','regina.flores@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000010',NULL,1,1,NULL,NULL,'2026-11-10 15:00:00','2026-11-27 07:46:28'),(11,3,'Santiago Ortiz','santiago.ortiz@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000011',NULL,1,1,NULL,NULL,'2026-11-11 15:00:00','2026-11-27 07:46:28'),(12,3,'Ximena Rojas','ximena.rojas@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000012',NULL,1,1,NULL,NULL,'2026-11-12 15:00:00','2026-11-27 07:46:28'),(13,3,'Leonardo Mendoza','leonardo.mendoza@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2',NULL,NULL,1,1,NULL,NULL,'2026-11-13 15:00:00','2026-11-27 07:46:28'),(14,3,'Renata Silva','renata.silva@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000014',NULL,1,0,NULL,NULL,'2026-11-14 15:00:00','2026-11-27 07:46:28'),(15,3,'Daniel Navarro','daniel.navarro@example.com','$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2','5520000015',NULL,0,1,NULL,NULL,'2026-11-15 15:00:00','2026-11-27 07:46:28');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

