-- ============================================================
--  Taza Ideal - V2: datos de prueba
--  Contrasenas de prueba (guardadas con hash BCrypt):
--    Administrador: Admin#2026   Baristas: Barista#2026   Clientes: Cliente#2026
--  Los correos @example.com son ficticios.
-- ============================================================

-- Roles
INSERT INTO roles (id, nombre, descripcion) VALUES
(1, 'ADMIN', 'Acceso total: usuarios, productos, categorias y pedidos'),
(2, 'BARISTA', 'Prepara los pedidos y cambia su estado'),
(3, 'CLIENTE', 'Contesta la encuesta, hace y sigue sus pedidos');

-- Usuarios: 1 administrador, 2 baristas y 12 clientes
INSERT INTO usuarios (id, rol_id, nombre, correo, contrasena, telefono, activo, correo_verificado, creado_en) VALUES
(1, 1, 'Administrador Taza Ideal', 'admin@tazaideal.com', '$2a$10$LHHUvZGKyLh9Q39tOK/iZuiPjKkxIgX2mXnLk/aSGljMpvc9iKleq', '5510000001', TRUE, TRUE, '2026-11-01 15:00:00'),
(2, 2, 'Andres Rios', 'andres@tazaideal.com', '$2a$10$f9tGSM/46E07gbHJhwG.vO4icfktba582FI77zAqK0IRVGi3M7/7G', '5510000002', TRUE, TRUE, '2026-11-02 15:00:00'),
(3, 2, 'Valentina Cruz', 'valentina@tazaideal.com', '$2a$10$f9tGSM/46E07gbHJhwG.vO4icfktba582FI77zAqK0IRVGi3M7/7G', '5510000003', TRUE, TRUE, '2026-11-03 15:00:00'),
(4, 3, 'Lucia Hernandez', 'lucia.hernandez@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000004', TRUE, TRUE, '2026-11-04 15:00:00'),
(5, 3, 'Mateo Ramirez', 'mateo.ramirez@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000005', TRUE, TRUE, '2026-11-05 15:00:00'),
(6, 3, 'Sofia Torres', 'sofia.torres@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000006', TRUE, TRUE, '2026-11-06 15:00:00'),
(7, 3, 'Diego Morales', 'diego.morales@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000007', TRUE, TRUE, '2026-11-07 15:00:00'),
(8, 3, 'Camila Vargas', 'camila.vargas@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000008', TRUE, TRUE, '2026-11-08 15:00:00'),
(9, 3, 'Emiliano Castro', 'emiliano.castro@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000009', TRUE, TRUE, '2026-11-09 15:00:00'),
(10, 3, 'Regina Flores', 'regina.flores@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000010', TRUE, TRUE, '2026-11-10 15:00:00'),
(11, 3, 'Santiago Ortiz', 'santiago.ortiz@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000011', TRUE, TRUE, '2026-11-11 15:00:00'),
(12, 3, 'Ximena Rojas', 'ximena.rojas@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000012', TRUE, TRUE, '2026-11-12 15:00:00'),
(13, 3, 'Leonardo Mendoza', 'leonardo.mendoza@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', NULL, TRUE, TRUE, '2026-11-13 15:00:00'),
(14, 3, 'Renata Silva', 'renata.silva@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000014', TRUE, FALSE, '2026-11-14 15:00:00'),
(15, 3, 'Daniel Navarro', 'daniel.navarro@example.com', '$2a$10$LcvFzkfEU8KJD125wqyZkuN9MdUuxt.jSbw5N14VLvfL/6CtLENJ2', '5520000015', FALSE, TRUE, '2026-11-15 15:00:00');

-- Categorias
INSERT INTO categorias (id, nombre, descripcion) VALUES
(1, 'Espresso', 'Bebidas a base de espresso, intensas y cortas'),
(2, 'Con leche', 'Bebidas calientes con leche espumada'),
(3, 'Frios', 'Bebidas frias y frappes'),
(4, 'Filtrados', 'Cafe de metodo: goteo, prensa y pour over'),
(5, 'Panaderia', 'Pan dulce y snacks para acompanar'),
(6, 'Granos', 'Cafe en grano para llevar a casa');

-- Productos (precios en MXN). Sin imagen_url el frontend muestra la foto por defecto.
INSERT INTO productos (id, categoria_id, nombre, descripcion, precio, imagen_url, disponible) VALUES
(1, 1, 'Espresso doble', 'Doble carga de espresso, cuerpo intenso y crema espesa.', 45.00, '/img/espresso-doble.png', TRUE),
(2, 1, 'Americano', 'Espresso con agua caliente, suave y aromatico.', 42.00, '/img/americano.png', TRUE),
(3, 1, 'Cortado', 'Espresso con un toque de leche texturizada.', 48.00, NULL, TRUE),
(4, 2, 'Capuchino', 'Espresso, leche y abundante espuma con canela.', 58.00, '/img/capuchino.png', TRUE),
(5, 2, 'Latte caramelo', 'Espresso con leche y jarabe de caramelo.', 65.00, '/img/latte-caramelo.png', TRUE),
(6, 2, 'Mocha', 'Espresso con chocolate y leche, coronado con cacao.', 68.00, '/img/mocha.png', TRUE),
(7, 2, 'Chai latte', 'Te chai especiado con leche espumada.', 60.00, NULL, TRUE),
(8, 3, 'Frappe moka', 'Cafe, chocolate y hielo licuados con crema batida.', 75.00, '/img/frappe-moka.png', TRUE),
(9, 3, 'Cold brew', 'Cafe extraido en frio por 18 horas, sin amargor.', 62.00, NULL, TRUE),
(10, 3, 'Latte helado de vainilla', 'Espresso, leche fria y vainilla sobre hielo.', 66.00, NULL, TRUE),
(11, 4, 'Cafe de olla', 'Cafe con piloncillo y canela, receta tradicional.', 40.00, NULL, TRUE),
(12, 4, 'Pour over Chiapas', 'Metodo V60 con grano de Chiapas, notas citricas.', 70.00, NULL, TRUE),
(13, 5, 'Croissant de mantequilla', 'Hojaldre horneado cada manana.', 38.00, NULL, TRUE),
(14, 5, 'Concha de vainilla', 'Pan dulce tradicional.', 25.00, NULL, TRUE),
(15, 6, 'Grano Veracruz 250 g', 'Tueste medio, notas a chocolate y nuez.', 180.00, NULL, FALSE);

-- Etiquetas de sabor (las usa la encuesta para recomendar)
INSERT INTO etiquetas (id, nombre) VALUES
(1, 'caliente'),
(2, 'fria'),
(3, 'dulce'),
(4, 'intenso'),
(5, 'suave'),
(6, 'con leche'),
(7, 'sin leche'),
(8, 'chocolate'),
(9, 'especiado'),
(10, 'para comer');

-- Relacion N:M productos <-> etiquetas
INSERT INTO producto_etiquetas (producto_id, etiqueta_id) VALUES
(1, 1),
(1, 4),
(1, 7),
(2, 1),
(2, 5),
(2, 7),
(3, 1),
(3, 4),
(3, 6),
(4, 1),
(4, 5),
(4, 6),
(5, 1),
(5, 3),
(5, 6),
(6, 1),
(6, 3),
(6, 6),
(6, 8),
(7, 1),
(7, 9),
(7, 6),
(8, 2),
(8, 3),
(8, 8),
(8, 6),
(9, 2),
(9, 4),
(9, 7),
(10, 2),
(10, 3),
(10, 6),
(11, 1),
(11, 9),
(11, 7),
(12, 1),
(12, 5),
(12, 7),
(13, 10),
(14, 10),
(14, 3),
(15, 4);

-- Pedidos (15). El total es la suma de cantidad x precio_unitario de su detalle.
INSERT INTO pedidos (id, codigo, usuario_id, estado, hora_recogida, notas, total, creado_en, actualizado_en) VALUES
(1, 'TI-1001', 4, 'ENTREGADO', DATE_ADD('2026-11-18 14:10:00', INTERVAL 15 MINUTE), NULL, 103.00, '2026-11-18 14:10:00', '2026-11-18 14:10:00'),
(2, 'TI-1002', 5, 'ENTREGADO', DATE_ADD('2026-11-19 15:25:00', INTERVAL 15 MINUTE), 'Sin azucar', 84.00, '2026-11-19 15:25:00', '2026-11-19 15:25:00'),
(3, 'TI-1003', 6, 'ENTREGADO', DATE_ADD('2026-11-20 16:40:00', INTERVAL 15 MINUTE), NULL, 125.00, '2026-11-20 16:40:00', '2026-11-20 16:40:00'),
(4, 'TI-1004', 7, 'CANCELADO', DATE_ADD('2026-11-21 13:05:00', INTERVAL 15 MINUTE), NULL, 68.00, '2026-11-21 13:05:00', '2026-11-21 13:05:00'),
(5, 'TI-1005', 8, 'ENTREGADO', DATE_ADD('2026-11-22 17:30:00', INTERVAL 15 MINUTE), NULL, 116.00, '2026-11-22 17:30:00', '2026-11-22 17:30:00'),
(6, 'TI-1006', 9, 'ENTREGADO', DATE_ADD('2026-11-23 14:50:00', INTERVAL 15 MINUTE), NULL, 100.00, '2026-11-23 14:50:00', '2026-11-23 14:50:00'),
(7, 'TI-1007', 10, 'ENTREGADO', DATE_ADD('2026-11-24 15:15:00', INTERVAL 15 MINUTE), 'Para llevar', 105.00, '2026-11-24 15:15:00', '2026-11-24 15:15:00'),
(8, 'TI-1008', 4, 'ENTREGADO', DATE_ADD('2026-11-25 16:00:00', INTERVAL 15 MINUTE), NULL, 45.00, '2026-11-25 16:00:00', '2026-11-25 16:00:00'),
(9, 'TI-1009', 11, 'ENTREGADO', DATE_ADD('2026-11-25 18:20:00', INTERVAL 15 MINUTE), NULL, 136.00, '2026-11-25 18:20:00', '2026-11-25 18:20:00'),
(10, 'TI-1010', 12, 'LISTO', DATE_ADD('2026-11-26 14:35:00', INTERVAL 15 MINUTE), NULL, 65.00, '2026-11-26 14:35:00', '2026-11-26 14:35:00'),
(11, 'TI-1011', 5, 'LISTO', DATE_ADD('2026-11-26 15:10:00', INTERVAL 15 MINUTE), NULL, 60.00, '2026-11-26 15:10:00', '2026-11-26 15:10:00'),
(12, 'TI-1012', 6, 'EN_PREPARACION', DATE_ADD('2026-11-26 15:45:00', INTERVAL 15 MINUTE), 'Extra caliente', 96.00, '2026-11-26 15:45:00', '2026-11-26 15:45:00'),
(13, 'TI-1013', 13, 'EN_PREPARACION', DATE_ADD('2026-11-26 16:05:00', INTERVAL 15 MINUTE), NULL, 150.00, '2026-11-26 16:05:00', '2026-11-26 16:05:00'),
(14, 'TI-1014', 7, 'PENDIENTE', DATE_ADD('2026-11-26 16:30:00', INTERVAL 15 MINUTE), NULL, 48.00, '2026-11-26 16:30:00', '2026-11-26 16:30:00'),
(15, 'TI-1015', 8, 'PENDIENTE', DATE_ADD('2026-11-26 16:40:00', INTERVAL 15 MINUTE), 'Recojo en 20 min', 93.00, '2026-11-26 16:40:00', '2026-11-26 16:40:00');

-- Detalle de cada pedido (precio_unitario = precio del producto al comprar)
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, tamano, leche) VALUES
(1, 5, 1, 65.00, 'Grande', 'Entera'),
(1, 13, 1, 38.00, NULL, NULL),
(2, 2, 2, 42.00, 'Mediano', NULL),
(3, 8, 1, 75.00, 'Grande', 'Entera'),
(3, 14, 2, 25.00, NULL, NULL),
(4, 6, 1, 68.00, 'Mediano', 'Avena'),
(5, 4, 2, 58.00, 'Mediano', 'Deslactosada'),
(6, 9, 1, 62.00, 'Grande', NULL),
(6, 13, 1, 38.00, NULL, NULL),
(7, 11, 2, 40.00, 'Mediano', NULL),
(7, 14, 1, 25.00, NULL, NULL),
(8, 1, 1, 45.00, 'Chico', NULL),
(9, 10, 1, 66.00, 'Grande', 'Entera'),
(9, 12, 1, 70.00, 'Mediano', NULL),
(10, 5, 1, 65.00, 'Mediano', 'Avena'),
(11, 7, 1, 60.00, 'Grande', 'Entera'),
(12, 4, 1, 58.00, 'Grande', 'Entera'),
(12, 13, 1, 38.00, NULL, NULL),
(13, 8, 2, 75.00, 'Mediano', 'Entera'),
(14, 3, 1, 48.00, 'Chico', 'Entera'),
(15, 6, 1, 68.00, 'Grande', 'Entera'),
(15, 14, 1, 25.00, NULL, NULL);

-- Resultados de la encuesta (10)
INSERT INTO resultados_encuesta (usuario_id, producto_id, respuestas, coincidencia, creado_en) VALUES
(4, 5, '{"temperatura": "caliente", "sabor": "dulce", "leche": "si", "intensidad": "suave", "chocolate": "no", "momento": "tarde"}', 92, '2026-11-10 12:00:00'),
(5, 2, '{"temperatura": "caliente", "sabor": "amargo", "leche": "no", "intensidad": "suave", "chocolate": "no", "momento": "manana"}', 88, '2026-11-11 12:00:00'),
(6, 8, '{"temperatura": "fria", "sabor": "dulce", "leche": "si", "intensidad": "suave", "chocolate": "si", "momento": "tarde"}', 95, '2026-11-12 12:00:00'),
(7, 6, '{"temperatura": "caliente", "sabor": "dulce", "leche": "si", "intensidad": "media", "chocolate": "si", "momento": "noche"}', 90, '2026-11-13 12:00:00'),
(8, 4, '{"temperatura": "caliente", "sabor": "equilibrado", "leche": "si", "intensidad": "suave", "chocolate": "no", "momento": "manana"}', 85, '2026-11-14 12:00:00'),
(9, 9, '{"temperatura": "fria", "sabor": "amargo", "leche": "no", "intensidad": "fuerte", "chocolate": "no", "momento": "manana"}', 93, '2026-11-15 12:00:00'),
(10, 11, '{"temperatura": "caliente", "sabor": "especiado", "leche": "no", "intensidad": "media", "chocolate": "no", "momento": "tarde"}', 87, '2026-11-16 12:00:00'),
(11, 10, '{"temperatura": "fria", "sabor": "dulce", "leche": "si", "intensidad": "suave", "chocolate": "no", "momento": "tarde"}', 89, '2026-11-17 12:00:00'),
(12, 7, '{"temperatura": "caliente", "sabor": "especiado", "leche": "si", "intensidad": "suave", "chocolate": "no", "momento": "noche"}', 84, '2026-11-18 12:00:00'),
(13, 1, '{"temperatura": "caliente", "sabor": "amargo", "leche": "no", "intensidad": "fuerte", "chocolate": "no", "momento": "manana"}', 96, '2026-11-19 12:00:00');
