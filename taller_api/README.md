# API Backend - Sistema Integral de Taller

## Configuración

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Endpoints

### Productos (Inventario)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Obtener producto por ID |
| GET | `/api/productos/codigo-barras/:codigo` | Buscar por código de barras |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto (soft delete) |
| PATCH | `/api/productos/:id/descontar-stock` | Descontar stock |
| GET | `/api/productos/alertas-stock` | Productos con stock bajo |

### Servicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/servicios` | Listar servicios (filtro: ?categoria=LUBRICENTRO) |
| GET | `/api/servicios/:id` | Obtener servicio por ID |
| POST | `/api/servicios` | Crear servicio |
| PUT | `/api/servicios/:id` | Actualizar servicio |
| DELETE | `/api/servicios/:id` | Eliminar servicio |

### Órdenes de Trabajo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ot` | Listar OTs (filtro: ?estado=RECIBIDO) |
| GET | `/api/ot/:id` | Obtener OT con detalles y trazabilidad |
| POST | `/api/ot` | Crear nueva OT |
| PATCH | `/api/ot/:id/estado` | Cambiar estado de la OT |
| PATCH | `/api/ot/:id/cerrar` | Cerrar OT y descontar stock |
| GET | `/api/ot/:id/calcular-total` | Recalcular total de la OT |

### Cotizaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cotizaciones` | Listar cotizaciones |
| GET | `/api/cotizaciones/:id` | Obtener cotización con detalles |
| POST | `/api/cotizaciones` | Crear cotización |
| PATCH | `/api/cotizaciones/:id/estado` | Aprobar/rechazar cotización |
| PATCH | `/api/cotizaciones/:id/convertir-ot` | Convertir cotización en OT |
| GET | `/api/cotizaciones/:id/validar-stock` | Validar stock disponible |
| GET | `/api/cotizaciones/:id/calcular-total` | Recalcular total |

### Vehículos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vehiculos/:patente/historial` | Historial completo del vehículo |

### Inventario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inventario/alertas` | Productos con stock bajo |
| POST | `/api/inventario/descontar-stock` | Descontar stock (body: producto_id, cantidad) |
| POST | `/api/inventario/incrementar-stock` | Incrementar stock |

## Ejemplos de Uso

### Crear Orden de Trabajo

```json
POST /api/ot
{
  "patente": "ABC-1234",
  "cliente_id": 1,
  "vehiculo_id": 1,
  "fecha_estimada_entrega": "2026-08-01T18:00:00",
  "observaciones_recepcion": "Cliente reporta ruido al frenar",
  "kilomatraje_ingreso": 45000,
  "items": [
    {
      "tipo_item": "SERVICIO",
      "servicio_id": 4,
      "cantidad": 1,
      "precio_unitario": 30000
    },
    {
      "tipo_item": "PRODUCTO",
      "producto_id": 4,
      "cantidad": 1,
      "precio_unitario": 28000
    }
  ]
}
```

### Cambiar Estado de OT

```json
PATCH /api/ot/1/estado
{
  "estado_nuevo": "EN_PROCESO",
  "usuario_id": 1,
  "usuario_nombre": "Mecánico Juan",
  "comentario": "Iniciando trabajo en frenos"
}
```

### Convertir Cotización en OT

```json
PATCH /api/cotizaciones/1/convertir-ot
{
  "fecha_estimada_entrega": "2026-08-02T17:00:00",
  "observaciones_recepcion": "Trabajo aprobado por el cliente",
  "usuario_recepcion_id": 1
}
```

### Crear Cotización

```json
POST /api/cotizaciones
{
  "patente": "XYZ-5678",
  "cliente_id": 2,
  "vehiculo_id": 2,
  "observaciones": "Presupuesto para service preventivo",
  "items": [
    {
      "tipo_item": "SERVICIO",
      "servicio_id": 7,
      "cantidad": 1,
      "precio_unitario": 120000
    },
    {
      "tipo_item": "PRODUCTO",
      "producto_id": 1,
      "cantidad": 1,
      "precio_unitario": 22000
    },
    {
      "tipo_item": "PRODUCTO",
      "producto_id": 2,
      "cantidad": 2,
      "precio_unitario": 5500
    }
  ]
}
```

## Estados de la OT

```
RECIBIDO → EN_PROCESO → CONTROL_CALIDAD → LISTO → ENTREGADO
    ↓           ↓              ↓             ↓
CANCELADO   CANCELADO      CANCELADO     CANCELADO
```

## Funcionalidades Clave

1. **Descuento automático de stock**: Al cerrar una OT (PATCH /api/ot/:id/cerrar), se descuenta automáticamente el stock de todos los productos utilizados.

2. **Trazabilidad completa**: Cada cambio de estado registra automáticamente quién, cuándo y qué cambió en la tabla `trazabilidad_ot`.

3. **Conversión Cotización → OT**: Un solo endpoint convierte una cotización aprobada en una OT completa con todos sus detalles.

4. **Validación de stock**: Se verifica stock suficiente al crear OT y al crear cotizaciones.

5. **Historial por vehículo**: Consulta completa de todas las visitas de un vehículo con productos y servicios aplicados.
