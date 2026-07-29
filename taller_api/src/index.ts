import dns from 'dns';
import net from 'net';

const originalConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function(this: any, ...args: any[]) {
  if (typeof args[0] === 'object' && args[0]) {
    args[0].family = 4;
  }
  return originalConnect.apply(this, args);
};

dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productoRoutes from './routes/productoRoutes';
import servicioRoutes from './routes/servicioRoutes';
import ordenTrabajoRoutes from './routes/ordenTrabajoRoutes';
import cotizacionRoutes from './routes/cotizacionRoutes';
import vehiculoRoutes from './routes/vehiculoRoutes';
import inventarioRoutes from './routes/inventarioRoutes';
import clienteRoutes from './routes/clienteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', productoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/ot', ordenTrabajoRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/clientes', clienteRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Taller funcionando correctamente' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
