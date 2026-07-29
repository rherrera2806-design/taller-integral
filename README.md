# Sistema Integral de Taller

Sistema completo para la gestión de talleres automotrices que integra:
- **Lubricentro** - Cambio de aceite y mantenimiento preventivo
- **Mecánica Rápida** - Reparaciones y servicios mecánicos
- **Servicio de Lavado** - Lavado exterior e interior

## Componentes

### Backend API (`taller_api/`)
- Node.js + Express + TypeScript
- PostgreSQL como base de datos
- API RESTful completa
- Endpoints: clientes, vehículos, productos, servicios, órdenes de trabajo, cotizaciones

### Frontend Web (`taller_web/`)
- React + TypeScript + Vite
- Tailwind CSS para estilos
- Diseño responsive y moderno
- Módulos: Kanban, Clientes, Inventario, Cotizaciones, Historial

### Base de Datos (`taller_db/`)
- PostgreSQL con esquema completo
- Triggers para automatización
- Vistas para consultas comunes
- Datos de ejemplo incluidos

## Deploy en Render

Ver la guía completa en `taller_api/DEPLOY.md`

### URLs de Producción
- **Frontend**: https://taller-web.onrender.com
- **Backend API**: https://taller-api.onrender.com/api

## Desarrollo Local

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Instalación

```bash
# Instalar dependencias del Backend
cd taller_api
npm install

# Instalar dependencias del Frontend
cd ../taller_web
npm install
```

### Ejecutar

```bash
# Backend (desde taller_api)
npm run mock    # Datos en memoria (desarrollo rápido)
npm run dev     # Con PostgreSQL real

# Frontend (desde taller_web)
npm run dev
```

### Base de Datos Local

```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE taller_db;"

# Ejecutar schema
psql -U postgres -d taller_db -f taller_db/schema.sql
```

## Estructura del Proyecto

```
taller-integral/
├── taller_api/          # Backend API
│   ├── src/
│   │   ├── config/      # Configuración de BD
│   │   ├── routes/      # Rutas de la API
│   │   ├── services/    # Lógica de negocio
│   │   ├── mockServer.ts
│   │   └── index.ts
│   ├── package.json
│   └── render.yaml
├── taller_web/          # Frontend Web
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── services/    # Servicios API
│   │   ├── utils/       # Utilidades y temas
│   │   └── App.tsx
│   ├── package.json
│   └── render.yaml
└── taller_db/           # Base de Datos
    └── schema.sql
```

## Funcionalidades

- ✅ Gestión de clientes y vehículos
- ✅ Inventario de productos y servicios
- ✅ Órdenes de trabajo con Kanban
- ✅ Cotizaciones y presupuestos
- ✅ Historial de vehículos
- ✅ Dashboard en tiempo real
- ✅ Diseño responsive
- ✅ API RESTful completa
- ✅ Base de datos relacional

## Licencia

MIT
