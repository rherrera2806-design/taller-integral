export interface Cliente {
  cliente_id: number;
  rut_dni: string;
  nombre: string;
  email?: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
}

export interface Vehiculo {
  vehiculo_id: number;
  patente: string;
  cliente_id: number;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje_actual: number;
  color?: string;
  cliente?: Cliente;
}

export interface Producto {
  producto_id: number;
  codigo_barras: string;
  nombre: string;
  descripcion?: string;
  categoria: 'ACEITES' | 'FILTROS' | 'REPUESTOS' | 'INSUMOS';
  stock_actual: number;
  stock_minimo: number;
  precio_costo: number;
  precio_venta: number;
  unidad_medida?: string;
}

export interface Servicio {
  servicio_id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  categoria: 'LUBRICENTRO' | 'MECANICA' | 'LAVADO';
  duracion_estimada_minutos?: number;
}

export interface OrdenTrabajo {
  ot_id: number;
  numero_ot: string;
  patente: string;
  cliente_id: number;
  vehiculo_id: number;
  fecha_ingreso: string;
  fecha_estimada_entrega?: string;
  fecha_entrega_real?: string;
  estado: 'RECIBIDO' | 'EN_PROCESO' | 'CONTROL_CALIDAD' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  total: number;
  observaciones_recepcion?: string;
  kilometraje_actual?: number;
  cliente?: Cliente;
  vehiculo?: Vehiculo;
  detalles?: DetalleOT[];
  trazabilidad?: TrazabilidadOT[];
}

export interface DetalleOT {
  detalle_ot_id: number;
  ot_id: number;
  tipo_item: 'PRODUCTO' | 'SERVICIO';
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  descuento_porcentaje: number;
  producto_nombre?: string;
  servicio_nombre?: string;
}

export interface TrazabilidadOT {
  trazabilidad_id: number;
  ot_id: number;
  estado_anterior?: string;
  estado_nuevo: string;
  fecha_hora: string;
  usuario_nombre?: string;
  comentario?: string;
}

export interface Cotizacion {
  cotizacion_id: number;
  numero_cotizacion: string;
  patente: string;
  cliente_id: number;
  vehiculo_id: number;
  fecha_creacion: string;
  fecha_validez?: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'VENCIDA' | 'CONVERTIDA_OT';
  total: number;
  observaciones?: string;
  detalles?: DetalleCotizacion[];
}

export interface DetalleCotizacion {
  detalle_cotizacion_id: number;
  cotizacion_id: number;
  tipo_item: 'PRODUCTO' | 'SERVICIO';
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  descuento_porcentaje: number;
  producto_nombre?: string;
  servicio_nombre?: string;
}

export interface HistorialVehiculo {
  ot_id: number;
  numero_ot: string;
  fecha_ingreso: string;
  fecha_entrega_real?: string;
  estado: string;
  total: number;
  productos_aplicados: DetalleOT[];
  servicios_aplicados: DetalleOT[];
}

export type EstadoOT = 'RECIBIDO' | 'EN_PROCESO' | 'CONTROL_CALIDAD' | 'LISTO' | 'ENTREGADO';

export const ESTADOS_OT: EstadoOT[] = ['RECIBIDO', 'EN_PROCESO', 'CONTROL_CALIDAD', 'LISTO'];

export const ESTADO_COLORS: Record<EstadoOT, string> = {
  RECIBIDO: 'bg-blue-100 text-blue-800 border-blue-200',
  EN_PROCESO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  CONTROL_CALIDAD: 'bg-purple-100 text-purple-800 border-purple-200',
  LISTO: 'bg-green-100 text-green-800 border-green-200',
};

export const CATEGORIA_SERVICIO_COLORS: Record<string, string> = {
  LUBRICENTRO: 'bg-orange-100 text-orange-800',
  MECANICA: 'bg-blue-100 text-blue-800',
  LAVADO: 'bg-cyan-100 text-cyan-800',
};
