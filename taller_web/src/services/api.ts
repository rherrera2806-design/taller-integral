import axios from 'axios';
import {
  OrdenTrabajo,
  Cotizacion,
  Producto,
  Servicio,
  HistorialVehiculo,
  Cliente,
  Vehiculo
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://taller-integral.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión con el servidor';
    return Promise.reject(new Error(message));
  }
);

export const ordenTrabajoService = {
  getAll: async (estado?: string): Promise<OrdenTrabajo[]> => {
    const params = estado ? { estado } : {};
    const response = await api.get('/ot', { params });
    return response.data;
  },

  getById: async (id: number): Promise<OrdenTrabajo> => {
    const response = await api.get(`/ot/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<OrdenTrabajo> => {
    const response = await api.post('/ot', data);
    return response.data;
  },

  cambiarEstado: async (id: number, data: {
    estado_nuevo: string;
    usuario_id?: number;
    usuario_nombre?: string;
    comentario?: string;
  }): Promise<OrdenTrabajo> => {
    const response = await api.patch(`/ot/${id}/estado`, data);
    return response.data;
  },

  cerrar: async (id: number): Promise<void> => {
    await api.patch(`/ot/${id}/cerrar`);
  }
};

export const cotizacionService = {
  getAll: async (estado?: string): Promise<Cotizacion[]> => {
    const params = estado ? { estado } : {};
    const response = await api.get('/cotizaciones', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Cotizacion> => {
    const response = await api.get(`/cotizaciones/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Cotizacion> => {
    const response = await api.post('/cotizaciones', data);
    return response.data;
  },

  updateEstado: async (id: number, estado: string, motivo?: string): Promise<Cotizacion> => {
    const response = await api.patch(`/cotizaciones/${id}/estado`, { estado, motivo_rechazo: motivo });
    return response.data;
  },

  convertirEnOT: async (id: number, data?: any): Promise<any> => {
    const response = await api.patch(`/cotizaciones/${id}/convertir-ot`, data);
    return response.data;
  },

  validarStock: async (id: number): Promise<any> => {
    const response = await api.get(`/cotizaciones/${id}/validar-stock`);
    return response.data;
  }
};

export const productoService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get('/productos');
    return response.data;
  },

  getByCodigoBarras: async (codigo: string): Promise<Producto> => {
    const response = await api.get(`/productos/codigo-barras/${codigo}`);
    return response.data;
  },

  getAlertasStock: async (): Promise<Producto[]> => {
    const response = await api.get('/productos/alertas-stock');
    return response.data;
  }
};

export const servicioService = {
  getAll: async (categoria?: string): Promise<Servicio[]> => {
    const params = categoria ? { categoria } : {};
    const response = await api.get('/servicios', { params });
    return response.data;
  }
};

export const vehiculoService = {
  getHistorial: async (patente: string): Promise<HistorialVehiculo[]> => {
    const response = await api.get(`/vehiculos/${patente}/historial`);
    return response.data;
  }
};

export const clienteService = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/clientes');
    console.log('[API Clientes] response:', response);
    console.log('[API Clientes] response.data:', (response as any).data);
    return (response as any).data;
  },

  getById: async (id: number): Promise<any> => {
    const response = await api.get(`/clientes/${id}`);
    return (response as any).data;
  },

  create: async (data: any): Promise<any> => {
    const response = await api.post('/clientes', data);
    return (response as any).data;
  },

  createConVehiculo: async (cliente: any, vehiculo: any): Promise<any> => {
    const response = await api.post('/clientes-con-vehiculo', { cliente, vehiculo });
    return (response as any).data;
  }
};

export default api;
