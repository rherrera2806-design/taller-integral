# TallerPro - Panel de Administración Web

## Configuración

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
taller_web/
├── src/
│   ├── components/
│   │   ├── kanban/           # Tablero Kanban de OT
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   └── KanbanCard.tsx
│   │   ├── historial/        # Búsqueda de historial por patente
│   │   │   ├── BuscadorHistorial.tsx
│   │   │   ├── FichaVehiculo.tsx
│   │   │   └── LineaTiempo.tsx
│   │   ├── cotizacion/       # Módulo de cotizaciones
│   │   │   ├── ModuloCotizacion.tsx
│   │   │   ├── ListaCotizaciones.tsx
│   │   │   └── FormularioCotizacion.tsx
│   │   └── layout/           # Layout principal
│   │       └── Layout.tsx
│   ├── hooks/                # Custom hooks React
│   ├── services/             # Conexión API
│   ├── types/                # Definiciones TypeScript
│   └── App.tsx               # Componente principal
```

## Funcionalidades

### 1. Tablero Kanban de Trazabilidad

Vista visual con columnas por estado de la OT:
- **RECIBIDO** → **EN PROCESO** → **CONTROL CALIDAD** → **LISTO**

Características:
- Tarjetas muestran: Patente, Modelo, Tipo de Servicio, Tiempo transcurrido
- Actualización automática cada 10 segundos
- Botón para avanzar estado con un clic
- Indicador de conexión en tiempo real

### 2. Buscador de Historial por Patente

- Campo de búsqueda con formato automático (ABC-1234)
- Ficha completa del vehículo con datos del propietario
- Línea de tiempo de todas las visitas
- Detalle de productos y servicios aplicados en cada visita
- Cálculo de duración de cada visita

### 3. Módulo de Cotización y Facturación

- Selector de productos y servicios del catálogo
- Cálculo automático de subtotales y total
- Opciones de descuento por item
- Estados: Pendiente → Aprobada → Convertida a OT
- Validación de stock antes de convertir a OT
- Conversión con un clic a Orden de Trabajo

## API Backend

El frontend se conecta a la API backend en `http://localhost:3000`.

Asegúrese de que el backend esté ejecutándose antes de iniciar el frontend.

## Puertos

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

El proxy está configurado automáticamente en el `vite.config.ts` para redirigir llamadas `/api` al backend.
