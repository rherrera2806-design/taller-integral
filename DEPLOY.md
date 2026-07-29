# Guía de Deploy: Render + Supabase

## Stack Tecnológico

| Componente | Servicio | Costo |
|------------|----------|-------|
| Frontend | Render (Static Site) | Gratis |
| Backend API | Render (Web Service) | Gratis |
| Base de Datos | Supabase (PostgreSQL) | Gratis |

**Costo total: $0/mes** (para empezar)

---

## Paso 1: Crear cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click **Start your project** 
3. Regístrate con GitHub (recomendado)
4. Verifica tu email

---

## Paso 2: Crear proyecto en Supabase

1. En Supabase Dashboard, click **New Project**
2. Configura:
   - **Organization:** Selecciona o crea una
   - **Project name:** `taller-integral`
   - **Database Password:** Crea una contraseña fuerte (guárdala)
   - **Region:** `South America (São Paulo)` o la más cercana
3. Click **Create new project**
4. **Espera** a que se cree (~2 minutos)

---

## Paso 3: Obtener credenciales de Supabase

1. Ve a **Settings** → **Database**
2. En **Connection string** → **URI**
3. Copia la URL que se ve algo así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. **Guarda esta URL** (la necesitarás después)

---

## Paso 4: Ejecutar el schema en Supabase

1. En Supabase, ve a **SQL Editor**
2. Click **New query**
3. Pega TODO el contenido de `taller_db/schema.sql`
4. Click **Run** (o Ctrl+Enter)
5. Verifica que no haya errores

---

## Paso 5: Crear cuenta en Render

1. Ve a [render.com](https://render.com)
2. Click **Get Started**
3. Regístrate con GitHub
4. Autoriza el acceso a tus repositorios

---

## Paso 6: Crear Backend API en Render

1. En Render Dashboard, click **New** → **Web Service**
2. Selecciona **Build and deploy from a Git repository**
3. Click **Next**
4. Conecta tu repositorio GitHub `taller-integral`
5. Configura:
   - **Name:** `taller-api`
   - **Runtime:** `Node`
   - **Build Command:** `cd taller_api && npm install && npm run build`
   - **Start Command:** `cd taller_api && node dist/index.js`
   - **Plan:** Free
6. Click **Advanced** → **Add Environment Variable**
7. Agrega:
   ```
   KEY: DATABASE_URL
   VALUE: [tu URL de Supabase del Paso 3]
   ```
   ```
   KEY: NODE_ENV
   VALUE: production
   ```
   ```
   KEY: DB_SSL
   VALUE: true
   ```
8. Click **Create Web Service**
9. **Espera** a que se deploye (~5 minutos)

---

## Paso 7: Verificar el Backend

1. Una vez deployado, Render te da una URL como:
   ```
   https://taller-api-xxxx.onrender.com
   ```
2. Abre en el navegador:
   ```
   https://taller-api-xxxx.onrender.com/api/health
   ```
3. Deberías ver: `{"status":"OK","message":"API Taller funcionando correctamente"}`

---

## Paso 8: Crear Frontend en Render

1. En Render Dashboard, click **New** → **Static Site**
2. Conecta el mismo repositorio `taller-integral`
3. Configura:
   - **Name:** `taller-web`
   - **Build Command:** `cd taller_web && npm install && npm run build`
   - **Publish Directory:** `taller_web/dist`
   - **Plan:** Free
4. Click **Advanced** → **Add Environment Variable**
5. Agrega:
   ```
   KEY: VITE_API_URL
   VALUE: https://taller-api-xxxx.onrender.com/api
   ```
   (Reemplaza `xxxx` con el ID real de tu backend)
6. Click **Create Static Site**
7. **Espera** a que se deploye (~3 minutos)

---

## Paso 9: Verificar el Frontend

1. Render te da una URL como:
   ```
   https://taller-web-xxxx.onrender.com
   ```
2. Abre esa URL en tu navegador
3. Deberías ver el sistema del taller funcionando

---

## URLs Finales

| Servicio | URL |
|----------|-----|
| **Frontend** | `https://taller-web-xxxx.onrender.com` |
| **Backend API** | `https://taller-api-xxxx.onrender.com/api` |
| **Supabase Dashboard** | `https://supabase.com/dashboard` |

---

## Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola del navegador:
1. Ve a `taller_api/src/index.ts`
2. Verifica que tenga:
   ```typescript
   app.use(cors());
   ```

### Error de conexión a BD
Si el backend no conecta a Supabase:
1. Verifica que `DATABASE_URL` esté correcta en Render
2. Asegúrate de que `DB_SSL` sea `true`
3. Revisa los logs en Render

### Frontend no carga datos
1. Verifica que `VITE_API_URL` apunte al backend correcto
2. Abre la consola del navegador (F12) y busca errores

---

## Actualizaciones

Para actualizar el código:
1. Haz push a GitHub: `git push`
2. Render automáticamente redespliega ambos servicios

---

## Siguiente Paso

¿Ya tienes cuenta en Supabase? ¿Necesitas ayuda con algún paso específico?
