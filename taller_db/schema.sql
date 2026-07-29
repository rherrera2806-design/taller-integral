-- ============================================================
-- SISTEMA INTEGRAL DE TALLER
-- Base de Datos: PostgreSQL
-- Incluye: Lubricentro, Mecánica Rápida y Lavado
-- ============================================================

-- Eliminar tablas si existen (orden por dependencias)
DROP TABLE IF EXISTS detalles_cotizacion CASCADE;
DROP TABLE IF EXISTS cotizaciones CASCADE;
DROP TABLE IF EXISTS trazabilidad_ot CASCADE;
DROP TABLE IF EXISTS detalles_ot CASCADE;
DROP TABLE IF EXISTS ordenes_trabajo CASCADE;
DROP TABLE IF EXISTS servicios CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS vehiculos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- ============================================================
-- TABLA: clientes
-- Almacena información de contacto y documentos de clientes
-- ============================================================
CREATE TABLE clientes (
    cliente_id SERIAL PRIMARY KEY,
    rut_dni VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255),
    comuna VARCHAR(100),
    ciudad VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clientes
CREATE INDEX idx_clientes_rut_dni ON clientes(rut_dni);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_telefono ON clientes(telefono);

-- ============================================================
-- TABLA: vehiculos
-- Información de vehículos, patente como identificador único
-- ============================================================
CREATE TABLE vehiculos (
    vehiculo_id SERIAL PRIMARY KEY,
    patente VARCHAR(10) NOT NULL UNIQUE,
    cliente_id INTEGER NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio >= 1900 AND anio <= 2100),
    kilometraje_actual INTEGER DEFAULT 0 CHECK (kilometraje_actual >= 0),
    color VARCHAR(30),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehiculo_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes(cliente_id) ON DELETE RESTRICT
);

-- Índices para vehículos (patente es clave de búsqueda principal)
CREATE INDEX idx_vehiculos_patente ON vehiculos(patente);
CREATE INDEX idx_vehiculos_cliente_id ON vehiculos(cliente_id);
CREATE INDEX idx_vehiculos_marca_modelo ON vehiculos(marca, modelo);
CREATE INDEX idx_vehiculos_anio ON vehiculos(anio);

-- ============================================================
-- TABLA: productos
-- Inventario de productos: aceites, filtros, repuestos, insumos
-- ============================================================
CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(30) NOT NULL CHECK (categoria IN ('ACEITES', 'FILTROS', 'REPUESTOS', 'INSUMOS')),
    stock_actual INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    stock_minimo INTEGER NOT NULL DEFAULT 5 CHECK (stock_minimo >= 0),
    precio_costo DECIMAL(12, 2) NOT NULL CHECK (precio_costo >= 0),
    precio_venta DECIMAL(12, 2) NOT NULL CHECK (precio_venta >= 0),
    unidad_medida VARCHAR(20) DEFAULT 'UNIDAD',
    proveedor VARCHAR(150),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_precio_venta_mayor_costo CHECK (precio_venta >= precio_costo)
);

-- Índices para productos (código de barras es clave de búsqueda)
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_stock_actual ON productos(stock_actual);
CREATE INDEX idx_productos_proveedor ON productos(proveedor);

-- ============================================================
-- TABLA: servicios
-- Catálogo de servicios del taller por categoría
-- ============================================================
CREATE TABLE servicios (
    servicio_id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(12, 2) NOT NULL CHECK (precio_base >= 0),
    categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('LUBRICENTRO', 'MECANICA', 'LAVADO')),
    duracion_estimada_minutos INTEGER CHECK (duracion_estimada_minutos > 0),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para servicios
CREATE INDEX idx_servicios_nombre ON servicios(nombre);
CREATE INDEX idx_servicios_categoria ON servicios(categoria);
CREATE INDEX idx_servicios_precio ON servicios(precio_base);

-- ============================================================
-- TABLA: ordenes_trabajo
-- Gestión central de órdenes de trabajo
-- ============================================================
CREATE TABLE ordenes_trabajo (
    ot_id SERIAL PRIMARY KEY,
    numero_ot VARCHAR(20) NOT NULL UNIQUE,
    patente VARCHAR(10) NOT NULL,
    cliente_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_entrega TIMESTAMP,
    fecha_entrega_real TIMESTAMP,
    estado VARCHAR(25) NOT NULL DEFAULT 'RECIBIDO' CHECK (estado IN (
        'RECIBIDO', 
        'EN_PROCESO', 
        'CONTROL_CALIDAD', 
        'LISTO', 
        'ENTREGADO',
        'CANCELADO'
    )),
    total DECIMAL(12, 2) DEFAULT 0.00 CHECK (total >= 0),
    observaciones_recepcion TEXT,
    observaciones_internas TEXT,
    kilomatraje_ingreso INTEGER CHECK (kilomatraje_ingreso >= 0),
    usuario_recepcion_id INTEGER,
    usuario_asignado_id INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ot_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes(cliente_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ot_vehiculo FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos(vehiculo_id) ON DELETE RESTRICT
);

-- Índices para órdenes de trabajo
CREATE INDEX idx_ot_numero ON ordenes_trabajo(numero_ot);
CREATE INDEX idx_ot_patente ON ordenes_trabajo(patente);
CREATE INDEX idx_ot_cliente_id ON ordenes_trabajo(cliente_id);
CREATE INDEX idx_ot_vehiculo_id ON ordenes_trabajo(vehiculo_id);
CREATE INDEX idx_ot_estado ON ordenes_trabajo(estado);
CREATE INDEX idx_ot_fecha_ingreso ON ordenes_trabajo(fecha_ingreso);
CREATE INDEX idx_ot_fecha_estimada ON ordenes_trabajo(fecha_estimada_entrega);
CREATE INDEX idx_ot_estado_fecha ON ordenes_trabajo(estado, fecha_ingreso);

-- ============================================================
-- TABLA: detalles_ot
-- Detalle de productos y servicios asociados a cada OT
-- ============================================================
CREATE TABLE detalles_ot (
    detalle_ot_id SERIAL PRIMARY KEY,
    ot_id INTEGER NOT NULL,
    tipo_item VARCHAR(20) NOT NULL CHECK (tipo_item IN ('PRODUCTO', 'SERVICIO')),
    producto_id INTEGER,
    servicio_id INTEGER,
    cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0 CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_ot FOREIGN KEY (ot_id)
        REFERENCES ordenes_trabajo(ot_id) ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id)
        REFERENCES productos(producto_id) ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_servicio FOREIGN KEY (servicio_id)
        REFERENCES servicios(servicio_id) ON DELETE RESTRICT,
    CONSTRAINT chk_detalle_item CHECK (
        (tipo_item = 'PRODUCTO' AND producto_id IS NOT NULL AND servicio_id IS NULL) OR
        (tipo_item = 'SERVICIO' AND servicio_id IS NOT NULL AND producto_id IS NULL)
    )
);

-- Índices para detalles OT
CREATE INDEX idx_detalle_ot_id ON detalles_ot(ot_id);
CREATE INDEX idx_detalle_producto_id ON detalles_ot(producto_id);
CREATE INDEX idx_detalle_servicio_id ON detalles_ot(servicio_id);
CREATE INDEX idx_detalle_tipo ON detalles_ot(tipo_item);

-- ============================================================
-- TABLA: trazabilidad_ot
-- Historial completo de cambios de estado de las OT
-- ============================================================
CREATE TABLE trazabilidad_ot (
    trazabilidad_id SERIAL PRIMARY KEY,
    ot_id INTEGER NOT NULL,
    estado_anterior VARCHAR(25),
    estado_nuevo VARCHAR(25) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER,
    usuario_nombre VARCHAR(100),
    comentario TEXT,
    CONSTRAINT fk_trazabilidad_ot FOREIGN KEY (ot_id)
        REFERENCES ordenes_trabajo(ot_id) ON DELETE RESTRICT
);

-- Índices para trazabilidad
CREATE INDEX idx_trazabilidad_ot_id ON trazabilidad_ot(ot_id);
CREATE INDEX idx_trazabilidad_fecha ON trazabilidad_ot(fecha_hora);
CREATE INDEX idx_trazabilidad_estado ON trazabilidad_ot(estado_nuevo);
CREATE INDEX idx_trazabilidad_usuario ON trazabilidad_ot(usuario_id);

-- ============================================================
-- TABLA: cotizaciones
-- Presupuestos previos a la generación de OT
-- ============================================================
CREATE TABLE cotizaciones (
    cotizacion_id SERIAL PRIMARY KEY,
    numero_cotizacion VARCHAR(20) NOT NULL UNIQUE,
    patente VARCHAR(10) NOT NULL,
    cliente_id INTEGER NOT NULL,
    vehiculo_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_validez DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN (
        'PENDIENTE',
        'APROBADA',
        'RECHAZADA',
        'VENCIDA',
        'CONVERTIDA_OT'
    )),
    total DECIMAL(12, 2) DEFAULT 0.00 CHECK (total >= 0),
    observaciones TEXT,
    motivo_rechazo TEXT,
    ot_id_generada INTEGER,
    usuario_creador_id INTEGER,
    usuario_creador_nombre VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cotizacion_cliente FOREIGN KEY (cliente_id)
        REFERENCES clientes(cliente_id) ON DELETE RESTRICT,
    CONSTRAINT fk_cotizacion_vehiculo FOREIGN KEY (vehiculo_id)
        REFERENCES vehiculos(vehiculo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_cotizacion_ot FOREIGN KEY (ot_id_generada)
        REFERENCES ordenes_trabajo(ot_id) ON DELETE SET NULL
);

-- Índices para cotizaciones
CREATE INDEX idx_cotizacion_numero ON cotizaciones(numero_cotizacion);
CREATE INDEX idx_cotizacion_patente ON cotizaciones(patente);
CREATE INDEX idx_cotizacion_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX idx_cotizacion_estado ON cotizaciones(estado);
CREATE INDEX idx_cotizacion_fecha ON cotizaciones(fecha_creacion);

-- ============================================================
-- TABLA: detalles_cotizacion
-- Detalle de productos y servicios en cotizaciones
-- ============================================================
CREATE TABLE detalles_cotizacion (
    detalle_cotizacion_id SERIAL PRIMARY KEY,
    cotizacion_id INTEGER NOT NULL,
    tipo_item VARCHAR(20) NOT NULL CHECK (tipo_item IN ('PRODUCTO', 'SERVICIO')),
    producto_id INTEGER,
    servicio_id INTEGER,
    cantidad INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(12, 2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0 CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detalle_cotizacion FOREIGN KEY (cotizacion_id)
        REFERENCES cotizaciones(cotizacion_id) ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_cot_producto FOREIGN KEY (producto_id)
        REFERENCES productos(producto_id) ON DELETE RESTRICT,
    CONSTRAINT fk_detalle_cot_servicio FOREIGN KEY (servicio_id)
        REFERENCES servicios(servicio_id) ON DELETE RESTRICT,
    CONSTRAINT chk_detalle_cot_item CHECK (
        (tipo_item = 'PRODUCTO' AND producto_id IS NOT NULL AND servicio_id IS NULL) OR
        (tipo_item = 'SERVICIO' AND servicio_id IS NOT NULL AND producto_id IS NULL)
    )
);

-- Índices para detalles cotización
CREATE INDEX idx_detalle_cot_cotizacion ON detalles_cotizacion(cotizacion_id);
CREATE INDEX idx_detalle_cot_producto ON detalles_cotizacion(producto_id);
CREATE INDEX idx_detalle_cot_servicio ON detalles_cotizacion(servicio_id);

-- ============================================================
-- TRIGGERS Y FUNCIONES AUXILIARES
-- ============================================================

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar fecha_actualizacion en tablas principales
CREATE TRIGGER trg_clientes_fecha
    BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_vehiculos_fecha
    BEFORE UPDATE ON vehiculos
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_productos_fecha
    BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_servicios_fecha
    BEFORE UPDATE ON servicios
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_ot_fecha
    BEFORE UPDATE ON ordenes_trabajo
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trg_cotizaciones_fecha
    BEFORE UPDATE ON cotizaciones
    FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Función para generar número de OT secuencial
CREATE OR REPLACE FUNCTION generar_numero_ot()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_ot IS NULL OR NEW.numero_ot = '' THEN
        NEW.numero_ot := 'OT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                         LPAD(CAST(nextval('seq_numero_ot') AS TEXT), 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS seq_numero_ot START WITH 1 INCREMENT BY 1;

CREATE TRIGGER trg_generar_numero_ot
    BEFORE INSERT ON ordenes_trabajo
    FOR EACH ROW EXECUTE FUNCTION generar_numero_ot();

-- Función para generar número de cotización secuencial
CREATE OR REPLACE FUNCTION generar_numero_cotizacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_cotizacion IS NULL OR NEW.numero_cotizacion = '' THEN
        NEW.numero_cotizacion := 'COT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                                 LPAD(CAST(nextval('seq_numero_cotizacion') AS TEXT), 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS seq_numero_cotizacion START WITH 1 INCREMENT BY 1;

CREATE TRIGGER trg_generar_numero_cotizacion
    BEFORE INSERT ON cotizaciones
    FOR EACH ROW EXECUTE FUNCTION generar_numero_cotizacion();

-- ============================================================
-- COMENTARIOS EN TABLAS (Documentación)
-- ============================================================

COMMENT ON TABLE clientes IS 'Almacena información de contacto y documentos de clientes del taller';
COMMENT ON TABLE vehiculos IS 'Registro de vehículos asociados a clientes, patente como identificador único';
COMMENT ON TABLE productos IS 'Inventario de productos: aceites, filtros, repuestos e insumos';
COMMENT ON TABLE servicios IS 'Catálogo de servicios del taller: lubricentro, mecánica y lavado';
COMMENT ON TABLE ordenes_trabajo IS 'Gestión central de órdenes de trabajo del taller';
COMMENT ON TABLE detalles_ot IS 'Detalle de productos y servicios asociados a cada orden de trabajo';
COMMENT ON TABLE trazabilidad_ot IS 'Historial completo de cambios de estado de las órdenes de trabajo';
COMMENT ON TABLE cotizaciones IS 'Presupuestos previos antes de generar órdenes de trabajo';
COMMENT ON TABLE detalles_cotizacion IS 'Detalle de productos y servicios incluidos en cotizaciones';

COMMENT ON COLUMN clientes.rut_dni IS 'RUT (Chile) o DNI (Argentina) - documento de identidad único';
COMMENT ON COLUMN vehiculos.patente IS 'Patente del vehículo - identificador único del vehículo';
COMMENT ON COLUMN productos.codigo_barras IS 'Código de barras del producto para escaneo rápido';
COMMENT ON COLUMN ordenes_trabajo.estado IS 'Estado actual de la OT: RECIBIDO → EN_PROCESO → CONTROL_CALIDAD → LISTO → ENTREGADO';
COMMENT ON COLUMN detalles_ot.tipo_item IS 'Indica si el item es PRODUCTO o SERVICIO';

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista resumen de órdenes de trabajo
CREATE OR REPLACE VIEW v_resumen_ot AS
SELECT 
    ot.ot_id,
    ot.numero_ot,
    v.patente,
    v.marca || ' ' || v.modelo AS vehiculo,
    c.nombre AS cliente,
    c.telefono,
    ot.estado,
    ot.fecha_ingreso,
    ot.fecha_estimada_entrega,
    ot.total,
    CASE 
        WHEN ot.fecha_estimada_entrega < CURRENT_TIMESTAMP AND ot.estado NOT IN ('LISTO', 'ENTREGADO', 'CANCELADO') 
        THEN TRUE 
        ELSE FALSE 
    END AS atrasada
FROM ordenes_trabajo ot
JOIN vehiculos v ON ot.vehiculo_id = v.vehiculo_id
JOIN clientes c ON ot.cliente_id = c.cliente_id
WHERE ot.activo = TRUE;

-- Vista de productos con stock bajo
CREATE OR REPLACE VIEW v_stock_bajo AS
SELECT 
    producto_id,
    codigo_barras,
    nombre,
    categoria,
    stock_actual,
    stock_minimo,
    stock_minimo - stock_actual AS unidades_faltantes
FROM productos
WHERE stock_actual <= stock_minimo AND activo = TRUE
ORDER BY unidades_faltantes DESC;

-- Vista de cotizaciones pendientes
CREATE OR REPLACE VIEW v_cotizaciones_pendientes AS
SELECT 
    cot.cotizacion_id,
    cot.numero_cotizacion,
    v.patente,
    c.nombre AS cliente,
    cot.fecha_creacion,
    cot.fecha_validez,
    cot.total,
    CASE 
        WHEN cot.fecha_validez < CURRENT_DATE THEN 'VENCIDA'
        ELSE cot.estado
    END AS estado_real
FROM cotizaciones cot
JOIN vehiculos v ON cot.vehiculo_id = v.vehiculo_id
JOIN clientes c ON cot.cliente_id = c.cliente_id
WHERE cot.estado = 'PENDIENTE' AND cot.activo = TRUE;

-- ============================================================
-- DATOS DE EJEMPLO (Opcional - para pruebas)
-- ============================================================

-- Insertar clientes de ejemplo
INSERT INTO clientes (rut_dni, nombre, email, telefono, direccion, comuna, ciudad) VALUES
('12345678-9', 'Juan Pérez', 'juan.perez@email.com', '+56912345678', 'Av. Principal 123', 'Santiago', 'Santiago'),
('87654321-0', 'María González', 'maria.gonzalez@email.com', '+56987654321', 'Calle Los Olivos 456', 'Providencia', 'Santiago'),
('11223344-5', 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+56911223344', 'Pasaje El Roble 789', 'Las Condes', 'Santiago');

-- Insertar vehículos de ejemplo
INSERT INTO vehiculos (patente, cliente_id, marca, modelo, anio, kilometraje_actual, color) VALUES
('ABC-1234', 1, 'Toyota', 'Corolla', 2020, 45000, 'Blanco'),
('XYZ-5678', 2, 'Honda', 'Civic', 2019, 62000, 'Negro'),
('DEF-9012', 3, 'Nissan', 'Versa', 2021, 28000, 'Plata');

-- Insertar productos de ejemplo
INSERT INTO productos (codigo_barras, nombre, categoria, stock_actual, stock_minimo, precio_costo, precio_venta, unidad_medida) VALUES
('7801234567890', 'Aceite Motor 5W-30 4L', 'ACEITES', 50, 10, 15000.00, 22000.00, 'UNIDAD'),
('7801234567891', 'Filtro de Aceite Universal', 'FILTROS', 100, 20, 3000.00, 5500.00, 'UNIDAD'),
('7801234567892', 'Filtro de Aire Honda Civic', 'FILTROS', 30, 5, 8000.00, 12000.00, 'UNIDAD'),
('7801234567893', 'Juego de Pastillas de Freno', 'REPUESTOS', 25, 5, 18000.00, 28000.00, 'JUEGO'),
('7801234567894', 'Shampoo Automotriz 5L', 'INSUMOS', 40, 10, 6000.00, 9500.00, 'UNIDAD'),
('7801234567895', 'Desengrasante Industrial 1L', 'INSUMOS', 35, 8, 4500.00, 7500.00, 'UNIDAD');

-- Insertar servicios de ejemplo
INSERT INTO servicios (nombre, descripcion, precio_base, categoria, duracion_estimada_minutos) VALUES
('Cambio de Aceite Simple', 'Cambio de aceite motor con filtro', 25000.00, 'LUBRICENTRO', 30),
('Cambio de Aceite Full Synthetic', 'Cambio de aceite sintético premium con filtro', 45000.00, 'LUBRICENTRO', 45),
('Alineación y Balanceo', 'Alineación 4 ruedas y balanceo completo', 35000.00, 'MECANICA', 90),
('Cambio de Pastillas de Freno', 'Cambio de pastillas delanteras o traseras', 30000.00, 'MECANICA', 60),
('Lavado Exterior Básico', 'Lavado exterior con shampoo', 8000.00, 'LAVADO', 20),
('Lavado Completo Premium', 'Lavado exterior e interior con aspirado', 18000.00, 'LAVADO', 45),
('Service Preventivo 40.000km', 'Revisión completa con cambio de aceite y filtros', 120000.00, 'MECANICA', 180);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
