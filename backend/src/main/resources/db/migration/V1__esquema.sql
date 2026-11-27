-- ============================================================
--  Taza Ideal - V1: esquema de la base de datos (11 tablas)
--  Lo ejecuta Flyway automaticamente al arrancar el backend.
--  Fechas en UTC. Precios en MXN con DECIMAL(10,2).
-- ============================================================

-- 1. Roles del sistema: ADMIN, BARISTA, CLIENTE
CREATE TABLE roles (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(20)  NOT NULL,
    descripcion VARCHAR(150) NULL,
    CONSTRAINT pk_roles PRIMARY KEY (id),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
) ENGINE = InnoDB;

-- 2. Usuarios (cada uno con un rol)
CREATE TABLE usuarios (
    id                     BIGINT       NOT NULL AUTO_INCREMENT,
    rol_id                 BIGINT       NOT NULL,
    nombre                 VARCHAR(100) NOT NULL,
    correo                 VARCHAR(150) NOT NULL,
    contrasena             VARCHAR(100) NOT NULL,          -- hash BCrypt
    telefono               VARCHAR(20)  NULL,
    avatar_url             VARCHAR(255) NULL,
    activo                 BOOLEAN      NOT NULL DEFAULT TRUE,
    correo_verificado      BOOLEAN      NOT NULL DEFAULT FALSE,
    codigo_verificacion    VARCHAR(100) NULL,              -- hash BCrypt del codigo de 6 digitos
    codigo_vence_en        DATETIME     NULL,
    creado_en              DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_correo UNIQUE (correo),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles (id)
) ENGINE = InnoDB;

CREATE INDEX ix_usuarios_rol ON usuarios (rol_id);
CREATE INDEX ix_usuarios_activo ON usuarios (activo);

-- 3. Categorias del menu
CREATE TABLE categorias (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(60)  NOT NULL,
    descripcion VARCHAR(255) NULL,
    activo      BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_categorias PRIMARY KEY (id),
    CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
) ENGINE = InnoDB;

-- 4. Productos (cada uno en una categoria)
CREATE TABLE productos (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    categoria_id   BIGINT        NOT NULL,
    nombre         VARCHAR(100)  NOT NULL,
    descripcion    VARCHAR(500)  NULL,
    precio         DECIMAL(10,2) NOT NULL,
    imagen_url     VARCHAR(255)  NULL,                     -- sin foto: el frontend muestra una por defecto
    disponible     BOOLEAN       NOT NULL DEFAULT TRUE,
    creado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_productos PRIMARY KEY (id),
    CONSTRAINT uq_productos_nombre UNIQUE (nombre),
    CONSTRAINT ck_productos_precio CHECK (precio >= 0),
    CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE = InnoDB;

CREATE INDEX ix_productos_categoria ON productos (categoria_id);
CREATE INDEX ix_productos_disponible ON productos (disponible);

-- 5. Etiquetas de sabor que usa la encuesta (caliente, fria, dulce, intenso...)
CREATE TABLE etiquetas (
    id     BIGINT      NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(40) NOT NULL,
    CONSTRAINT pk_etiquetas PRIMARY KEY (id),
    CONSTRAINT uq_etiquetas_nombre UNIQUE (nombre)
) ENGINE = InnoDB;

-- 6. Tabla puente N:M entre productos y etiquetas
CREATE TABLE producto_etiquetas (
    producto_id BIGINT NOT NULL,
    etiqueta_id BIGINT NOT NULL,
    CONSTRAINT pk_producto_etiquetas PRIMARY KEY (producto_id, etiqueta_id),
    CONSTRAINT fk_pe_producto FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    CONSTRAINT fk_pe_etiqueta FOREIGN KEY (etiqueta_id) REFERENCES etiquetas (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE INDEX ix_pe_etiqueta ON producto_etiquetas (etiqueta_id);

-- 7. Pedidos de los clientes
CREATE TABLE pedidos (
    id             BIGINT        NOT NULL AUTO_INCREMENT,
    codigo         VARCHAR(20)   NOT NULL,                 -- ejemplo: TI-1001
    usuario_id     BIGINT        NOT NULL,
    estado         VARCHAR(20)   NOT NULL DEFAULT 'PENDIENTE',
    hora_recogida  DATETIME      NULL,
    notas          VARCHAR(255)  NULL,
    total          DECIMAL(10,2) NOT NULL DEFAULT 0,
    creado_en      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_pedidos PRIMARY KEY (id),
    CONSTRAINT uq_pedidos_codigo UNIQUE (codigo),
    CONSTRAINT ck_pedidos_estado CHECK (estado IN ('PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO')),
    CONSTRAINT ck_pedidos_total CHECK (total >= 0),
    CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE = InnoDB;

CREATE INDEX ix_pedidos_usuario ON pedidos (usuario_id);
CREATE INDEX ix_pedidos_estado_fecha ON pedidos (estado, creado_en);

-- 8. Detalle de cada pedido (una fila por producto)
CREATE TABLE detalle_pedido (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    pedido_id       BIGINT        NOT NULL,
    producto_id     BIGINT        NOT NULL,
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,                -- precio al momento de la compra
    tamano          VARCHAR(20)   NULL,                    -- Chico, Mediano, Grande
    leche           VARCHAR(30)   NULL,                    -- Entera, Deslactosada, Avena...
    CONSTRAINT pk_detalle_pedido PRIMARY KEY (id),
    CONSTRAINT ck_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos (id)
) ENGINE = InnoDB;

CREATE INDEX ix_detalle_pedido ON detalle_pedido (pedido_id);
CREATE INDEX ix_detalle_producto ON detalle_pedido (producto_id);

-- 9. Resultados de la encuesta (bebida recomendada y % de coincidencia)
CREATE TABLE resultados_encuesta (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    usuario_id     BIGINT       NOT NULL,
    producto_id    BIGINT       NOT NULL,
    respuestas     VARCHAR(500) NOT NULL,                  -- respuestas de las 6 preguntas (JSON)
    coincidencia   INT          NOT NULL,                  -- porcentaje 0-100
    creado_en      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_resultados_encuesta PRIMARY KEY (id),
    CONSTRAINT ck_resultados_coincidencia CHECK (coincidencia BETWEEN 0 AND 100),
    CONSTRAINT fk_resultados_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_resultados_producto FOREIGN KEY (producto_id) REFERENCES productos (id)
) ENGINE = InnoDB;

CREATE INDEX ix_resultados_usuario ON resultados_encuesta (usuario_id);
CREATE INDEX ix_resultados_producto ON resultados_encuesta (producto_id);

-- 10. Tokens JWT invalidados al cerrar sesion (logout)
CREATE TABLE tokens_revocados (
    id        BIGINT      NOT NULL AUTO_INCREMENT,
    jti       VARCHAR(64) NOT NULL,                        -- identificador unico del token
    expira_en DATETIME    NOT NULL,
    CONSTRAINT pk_tokens_revocados PRIMARY KEY (id),
    CONSTRAINT uq_tokens_revocados_jti UNIQUE (jti)
) ENGINE = InnoDB;

CREATE INDEX ix_tokens_revocados_expira ON tokens_revocados (expira_en);

-- 11. Tokens para restablecer la contrasena (vencen en 30 minutos)
CREATE TABLE tokens_recuperacion (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    usuario_id BIGINT      NOT NULL,
    token      VARCHAR(100) NOT NULL,
    expira_en  DATETIME    NOT NULL,
    usado      BOOLEAN     NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_tokens_recuperacion PRIMARY KEY (id),
    CONSTRAINT uq_tokens_recuperacion_token UNIQUE (token),
    CONSTRAINT fk_tokens_recuperacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE INDEX ix_tokens_recuperacion_usuario ON tokens_recuperacion (usuario_id);
