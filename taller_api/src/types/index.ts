export interface Cliente {
  cliente_id?: number;
  rut_dni: string;
  nombre: string;
  email?: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  activo?: boolean;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface Vehiculo {
  vehiculo_id?: number;
  patente: string;
  cliente_id: number;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje_actual?: number;
  color?: string;
  observaciones?: string;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface Producto {
  producto_id?: number;
  codigo_barras: string;
  nombre: string;
  descripcion?: string;
  categoria: 'ACEITES' | 'FILTROS' | 'REPUESTOS' | 'INSUMOS';
  stock_actual: number;
  stock_minimo: number;
  precio_costo: number;
  precio_venta: number;
  unidad_medida?: string;
  proveedor?: string;
  activo?: boolean;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface Servicio {
  servicio_id?: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  categoria: 'LUBRICENTRO' | 'MECANICA' | 'LAVADO';
  duracion_estimada_minutos?: number;
  activo?: boolean;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface OrdenTrabajo {
  ot_id?: number;
  numero_ot?: string;
  patente: string;
  cliente_id: number;
  vehiculo_id: number;
  fecha_ingreso?: Date;
  fecha_estimada_entrega?: Date;
  fecha_entrega_real?: Date;
  estado: 'RECIBIDO' | 'EN_PROCESO' | 'CONTROL_CALIDAD' | 'LISTO' | 'ENTREGADO' | 'CANCELADO';
  total?: number;
  observaciones_recepcion?: string;
  observaciones_internas?: string;
  kilomatraje_ingreso?: number;
  usuario_recepcion_id?: number;
  usuario_asignado_id?: number;
  activo?: boolean;
  fecha_registro?: Date;
  fecha_actualizacion?: Date;
}

export interface DetalleOT {
  detalle_ot_id?: number;
  ot_id: number;
  tipo_item: 'PRODUCTO' | 'SERVICIO';
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  descuento_porcentaje?: number;
  observaciones?: string;
}

export interface TrazabilidadOT {
  trazabilidad_id?: number;
  ot_id: number;
  estado_anterior?: string;
  estado_nuevo: string;
  fecha_hora?: Date;
  usuario_id?: number;
  usuario_nombre?: string;
  comentario?: string;
}

export interface Cotizacion {
  cotizacion_id?: number;
  numero_cotizacion?: string;
  patente: string;
  cliente_id: number;
  vehiculo_id: number;
  fecha_creacion?: Date;
  fecha_validez?: Date;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'VENCIDA' | 'CONVERTIDA_OT';
  total?: number;
  observaciones?: string;
  motivo_rechazo?: string;
  ot_id_generada?: number;
  usuario_creador_id?: number;
  usuario_creador_nombre?: string;
  activo?: boolean;
}

export interface DetalleCotizacion {
  detalle_cotizacion_id?: number;
  cotizacion_id: number;
  tipo_item: 'PRODUCTO' | 'SERVICIO';
  producto_id?: number;
  servicio_id?: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
  descuento_porcentaje?: number;
  observaciones?: string;
}

export interface CrearOTRequest {
  patente: string;
  cliente_id: number;
  vehiculo_id: number;
  fecha_estimada_entrega?: Date;
  observaciones_recepcion?: string;
  kilomatraje_ingreso?: number;
  usuario_recepcion_id?: number;
  items: DetalleOT[];
  cotizacion_id?: number;
}

export interface CambiarEstadoRequest {
  estado_nuevo: string;
  usuario_id?: number;
  usuario_nombre?: string;
  comentario?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
