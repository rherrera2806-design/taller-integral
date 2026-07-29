# Guía de Deploy a Render

## Paso 1: Crear Base de Datos PostgreSQL

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configura:
   - **Name**: `taller-db`
   - **Database**: `taller_db`
   - **Plan**: Free
4. Click **Create Database**
5. **Guarda la URL de conexión** (la necesitarás después)

## Paso 2: Crear Backend API

1. En Render Dashboard, click **New** → **Web Service**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `taller-api`
   - **Runtime**: Node
   - **Build Command**: `cd taller_api && npm install && npm run build`
   - **Start Command**: `cd taller_api && node dist/index.js`
   - **Plan**: Free
4. Agrega estas **Environment Variables**:
   ```
   NODE_ENV = production
   DATABASE_URL = [tu URL de PostgreSQL de Render]
   DB_SSL = true
   ```
5. Click **Create Web Service**

## Paso 3: Migrar Schema a la Base de Datos

1. Ve a tu base de datos en Render
2. Click **Connect** → **External Client**
3. Copia la **External Database URL**
4. Conéctate con psql o pgAdmin:
   ```bash
   psql "tu_url_de_conexion"
   ```
5. Ejecuta el schema:
   ```bash
   \i C:/taller_db/schema.sql
   ```

## Paso 4: Crear Frontend Web

1. En Render Dashboard, click **New** → **Static Site**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name**: `taller-web`
   - **Build Command**: `cd taller_web && npm install && npm run build`
   - **Publish Directory**: `taller_web/dist`
   - **Plan**: Free
4. Agrega esta **Environment Variable**:
   ```
   VITE_API_URL = https://taller-api.onrender.com/api
   ```
5. Click **Create Static Site**

## Paso 5: Verificar

1. Abre tu frontend: `https://taller-web.onrender.com`
2. Abre la consola del navegador (F12)
3. Verifica que no haya errores de CORS o conexión
4. Prueba crear un cliente y verificar que aparecen 4

## URLs Finales

- **Frontend**: `https://taller-web.onrender.com`
- **Backend API**: `https://taller-api.onrender.com/api`

## Notas Importantes

- El plan gratuito de Render duerme después de 15 minutos de inactividad
- La primera carga puede tardar 30-60 segundos
- Los datos del mock server NO se mantienen (usa la base de datos real)
- Si hay errores de CORS, verifica que el backend tenga el middleware CORS habilitado
