import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Mock Data
const clientes = [
  { cliente_id: 1, rut_dni: '12345678-9', nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '+56912345678', direccion: 'Av. Principal 123' },
  { cliente_id: 2, rut_dni: '87654321-0', nombre: 'María González', email: 'maria@email.com', telefono: '+56987654321', direccion: 'Calle Los Olivos 456' },
  { cliente_id: 3, rut_dni: '11223344-5', nombre: 'Carlos Rodríguez', email: 'carlos@email.com', telefono: '+56911223344', direccion: 'Pasaje El Roble 789' }
];

const vehiculos = [
  { vehiculo_id: 1, patente: 'ABC-1234', cliente_id: 1, marca: 'Toyota', modelo: 'Corolla', anio: 2020, kilometraje_actual: 45000, color: 'Blanco', cliente: clientes[0] },
  { vehiculo_id: 2, patente: 'XYZ-5678', cliente_id: 2, marca: 'Honda', modelo: 'Civic', anio: 2019, kilometraje_actual: 62000, color: 'Negro', cliente: clientes[1] },
  { vehiculo_id: 3, patente: 'DEF-9012', cliente_id: 3, marca: 'Nissan', modelo: 'Versa', anio: 2021, kilometraje_actual: 28000, color: 'Plata', cliente: clientes[2] }
];

const productos = [
  { producto_id: 1, codigo_barras: '7801234567890', nombre: 'Aceite Motor 5W-30 4L', categoria: 'ACEITES', stock_actual: 50, stock_minimo: 10, precio_costo: 15000, precio_venta: 22000 },
  { producto_id: 2, codigo_barras: '7801234567891', nombre: 'Filtro de Aceite Universal', categoria: 'FILTROS', stock_actual: 100, stock_minimo: 20, precio_costo: 3000, precio_venta: 5500 },
  { producto_id: 3, codigo_barras: '7801234567892', nombre: 'Filtro de Aire Honda Civic', categoria: 'FILTROS', stock_actual: 30, stock_minimo: 5, precio_costo: 8000, precio_venta: 12000 },
  { producto_id: 4, codigo_barras: '7801234567893', nombre: 'Juego de Pastillas de Freno', categoria: 'REPUESTOS', stock_actual: 25, stock_minimo: 5, precio_costo: 18000, precio_venta: 28000 },
  { producto_id: 5, codigo_barras: '7801234567894', nombre: 'Shampoo Automotriz 5L', categoria: 'INSUMOS', stock_actual: 40, stock_minimo: 10, precio_costo: 6000, precio_venta: 9500 }
];

const servicios = [
  { servicio_id: 1, nombre: 'Cambio de Aceite Simple', descripcion: 'Cambio de aceite motor con filtro', precio_base: 25000, categoria: 'LUBRICENTRO', duracion_estimada_minutos: 30 },
  { servicio_id: 2, nombre: 'Cambio de Aceite Full Synthetic', descripcion: 'Cambio de aceite sintético premium', precio_base: 45000, categoria: 'LUBRICENTRO', duracion_estimada_minutos: 45 },
  { servicio_id: 3, nombre: 'Alineación y Balanceo', descripcion: 'Alineación 4 ruedas y balanceo', precio_base: 35000, categoria: 'MECANICA', duracion_estimada_minutos: 90 },
  { servicio_id: 4, nombre: 'Cambio de Pastillas de Freno', descripcion: 'Cambio de pastillas delanteras', precio_base: 30000, categoria: 'MECANICA', duracion_estimada_minutos: 60 },
  { servicio_id: 5, nombre: 'Lavado Exterior Básico', descripcion: 'Lavado exterior con shampoo', precio_base: 8000, categoria: 'LAVADO', duracion_estimada_minutos: 20 },
  { servicio_id: 6, nombre: 'Lavado Completo Premium', descripcion: 'Lavado exterior e interior', precio_base: 18000, categoria: 'LAVADO', duracion_estimada_minutos: 45 },
  { servicio_id: 7, nombre: 'Service Preventivo 40.000km', descripcion: 'Revisión completa', precio_base: 120000, categoria: 'MECANICA', duracion_estimada_minutos: 180 }
];

let ordenesTrabajo = [
  {
    ot_id: 1, numero_ot: 'OT-20260729-00001', patente: 'ABC-1234', cliente_id: 1, vehiculo_id: 1,
    fecha_ingreso: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    estado: 'RECIBIDO', total: 55000, observaciones_recepcion: 'Cliente reporta ruido al frenar',
    kilometraje_ingreso: 45000, vehiculo: vehiculos[0], cliente: clientes[0],
    detalles: [
      { detalle_ot_id: 1, ot_id: 1, tipo_item: 'SERVICIO', servicio_id: 4, cantidad: 1, precio_unitario: 30000, subtotal: 30000, servicio_nombre: 'Cambio de Pastillas de Freno' },
      { detalle_ot_id: 2, ot_id: 1, tipo_item: 'PRODUCTO', producto_id: 4, cantidad: 1, precio_unitario: 25000, subtotal: 25000, producto_nombre: 'Juego de Pastillas de Freno' }
    ],
    trazabilidad: [
      { trazabilidad_id: 1, ot_id: 1, estado_nuevo: 'RECIBIDO', fecha_hora: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), usuario_nombre: 'Recepción', comentario: 'OT creada' }
    ]
  },
  {
    ot_id: 2, numero_ot: 'OT-20260729-00002', patente: 'XYZ-5678', cliente_id: 2, vehiculo_id: 2,
    fecha_ingreso: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    estado: 'EN_PROCESO', total: 25000, observaciones_recepcion: 'Cambio de aceite programado',
    kilometraje_ingreso: 62000, vehiculo: vehiculos[1], cliente: clientes[1],
    detalles: [
      { detalle_ot_id: 3, ot_id: 2, tipo_item: 'SERVICIO', servicio_id: 1, cantidad: 1, precio_unitario: 25000, subtotal: 25000, servicio_nombre: 'Cambio de Aceite Simple' }
    ],
    trazabilidad: [
      { trazabilidad_id: 2, ot_id: 2, estado_nuevo: 'RECIBIDO', fecha_hora: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), usuario_nombre: 'Recepción', comentario: 'OT creada' },
      { trazabilidad_id: 3, ot_id: 2, estado_anterior: 'RECIBIDO', estado_nuevo: 'EN_PROCESO', fecha_hora: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), usuario_nombre: 'Mecánico Juan', comentario: 'Iniciando trabajo' }
    ]
  },
  {
    ot_id: 3, numero_ot: 'OT-20260729-00003', patente: 'DEF-9012', cliente_id: 3, vehiculo_id: 3,
    fecha_ingreso: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    estado: 'CONTROL_CALIDAD', total: 18000, observaciones_recepcion: 'Lavado completo',
    kilometraje_ingreso: 28000, vehiculo: vehiculos[2], cliente: clientes[2],
    detalles: [
      { detalle_ot_id: 4, ot_id: 3, tipo_item: 'SERVICIO', servicio_id: 6, cantidad: 1, precio_unitario: 18000, subtotal: 18000, servicio_nombre: 'Lavado Completo Premium' }
    ],
    trazabilidad: [
      { trazabilidad_id: 4, ot_id: 3, estado_nuevo: 'RECIBIDO', fecha_hora: new Date(Date.now() - 45 * 60 * 1000).toISOString(), usuario_nombre: 'Recepción', comentario: 'OT creada' },
      { trazabilidad_id: 5, ot_id: 3, estado_anterior: 'RECIBIDO', estado_nuevo: 'EN_PROCESO', fecha_hora: new Date(Date.now() - 40 * 60 * 1000).toISOString(), usuario_nombre: 'Operario Pedro' },
      { trazabilidad_id: 6, ot_id: 3, estado_anterior: 'EN_PROCESO', estado_nuevo: 'CONTROL_CALIDAD', fecha_hora: new Date(Date.now() - 10 * 60 * 1000).toISOString(), usuario_nombre: 'Operario Pedro', comentario: 'Lavado finalizado' }
    ]
  },
  {
    ot_id: 4, numero_ot: 'OT-20260729-00004', patente: 'ABC-1234', cliente_id: 1, vehiculo_id: 1,
    fecha_ingreso: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    estado: 'LISTO', total: 120000, observaciones_recepcion: 'Service preventivo 40.000km',
    kilometraje_ingreso: 44500, vehiculo: vehiculos[0], cliente: clientes[0],
    detalles: [
      { detalle_ot_id: 5, ot_id: 4, tipo_item: 'SERVICIO', servicio_id: 7, cantidad: 1, precio_unitario: 120000, subtotal: 120000, servicio_nombre: 'Service Preventivo 40.000km' }
    ],
    trazabilidad: [
      { trazabilidad_id: 7, ot_id: 4, estado_nuevo: 'RECIBIDO', fecha_hora: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
      { trazabilidad_id: 8, ot_id: 4, estado_anterior: 'RECIBIDO', estado_nuevo: 'EN_PROCESO', fecha_hora: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { trazabilidad_id: 9, ot_id: 4, estado_anterior: 'EN_PROCESO', estado_nuevo: 'CONTROL_CALIDAD', fecha_hora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { trazabilidad_id: 10, ot_id: 4, estado_anterior: 'CONTROL_CALIDAD', estado_nuevo: 'LISTO', fecha_hora: new Date(Date.now() - 30 * 60 * 1000).toISOString(), comentario: 'Service completado' }
    ]
  }
];

let cotizaciones = [
  {
    cotizacion_id: 1, numero_cotizacion: 'COT-20260729-00001', patente: 'XYZ-5678', cliente_id: 2, vehiculo_id: 2,
    fecha_creacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fecha_validez: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'PENDIENTE', total: 63500, observaciones: 'Presupuesto para service preventivo',
    detalles: [
      { detalle_cotizacion_id: 1, cotizacion_id: 1, tipo_item: 'SERVICIO', servicio_id: 3, cantidad: 1, precio_unitario: 35000, subtotal: 35000, servicio_nombre: 'Alineación y Balanceo' },
      { detalle_cotizacion_id: 2, cotizacion_id: 1, tipo_item: 'PRODUCTO', producto_id: 1, cantidad: 1, precio_unitario: 22000, subtotal: 22000, producto_nombre: 'Aceite Motor 5W-30 4L' },
      { detalle_cotizacion_id: 3, cotizacion_id: 1, tipo_item: 'PRODUCTO', producto_id: 2, cantidad: 1, precio_unitario: 6500, subtotal: 6500, producto_nombre: 'Filtro de Aceite Universal' }
    ]
  },
  {
    cotizacion_id: 2, numero_cotizacion: 'COT-20260729-00002', patente: 'DEF-9012', cliente_id: 3, vehiculo_id: 3,
    fecha_creacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fecha_validez: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'VENCIDA', total: 28000, observaciones: 'Cambio de pastillas',
    detalles: [
      { detalle_cotizacion_id: 4, cotizacion_id: 2, tipo_item: 'SERVICIO', servicio_id: 4, cantidad: 1, precio_unitario: 30000, subtotal: 30000, servicio_nombre: 'Cambio de Pastillas de Freno' }
    ]
  }
];

let nextOTId = 5;
let nextCotId = 3;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Mock funcionando' });
});

// Productos
app.get('/api/productos', (req, res) => {
  res.json({ success: true, data: productos, message: 'OK' });
});

app.get('/api/productos/alertas-stock', (req, res) => {
  const alertas = productos.filter(p => p.stock_actual <= p.stock_minimo);
  res.json({ success: true, data: alertas, message: 'OK' });
});

app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.producto_id === parseInt(req.params.id));
  if (producto) res.json({ success: true, data: producto });
  else res.status(404).json({ success: false, message: 'No encontrado' });
});

// Servicios
app.get('/api/servicios', (req, res) => {
  const { categoria } = req.query;
  let result = servicios;
  if (categoria) result = servicios.filter(s => s.categoria === categoria);
  res.json({ success: true, data: result });
});

// Órdenes de Trabajo
app.get('/api/ot', (req, res) => {
  const { estado } = req.query;
  let result = ordenesTrabajo;
  if (estado) result = ordenesTrabajo.filter(o => o.estado === estado);
  res.json({ success: true, data: result });
});

app.get('/api/ot/:id', (req, res) => {
  const ot = ordenesTrabajo.find(o => o.ot_id === parseInt(req.params.id));
  if (ot) res.json({ success: true, data: ot });
  else res.status(404).json({ success: false, message: 'OT no encontrada' });
});

app.post('/api/ot', (req, res) => {
  const { patente, cliente_id, vehiculo_id, items, observaciones_recepcion, kilomatraje_ingreso } = req.body;
  
  const vehiculo = vehiculos.find(v => v.patente === patente) || vehiculos[0];
  const cliente = clientes.find(c => c.cliente_id === cliente_id) || clientes[0];
  
  const newOT = {
    ot_id: nextOTId++,
    numero_ot: `OT-20260729-${String(nextOTId - 1).padStart(5, '0')}`,
    patente,
    cliente_id: cliente_id || 1,
    vehiculo_id: vehiculo.vehiculo_id,
    fecha_ingreso: new Date().toISOString(),
    estado: 'RECIBIDO',
    total: items?.reduce((sum: number, item: any) => sum + (item.precio_unitario * item.cantidad), 0) || 0,
    observaciones_recepcion: observaciones_recepcion || '',
    kilometraje_ingreso: kilomatraje_ingreso || 0,
    vehiculo,
    cliente,
    detalles: items?.map((item: any, idx: number) => ({
      detalle_ot_id: idx + 1,
      ot_id: nextOTId - 1,
      tipo_item: item.tipo_item,
      producto_id: item.producto_id,
      servicio_id: item.servicio_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario,
      producto_nombre: item.tipo_item === 'PRODUCTO' ? 'Producto' : undefined,
      servicio_nombre: item.tipo_item === 'SERVICIO' ? servicios.find(s => s.servicio_id === item.servicio_id)?.nombre : undefined
    })) || [],
    trazabilidad: [{
      trazabilidad_id: Date.now(),
      ot_id: nextOTId - 1,
      estado_nuevo: 'RECIBIDO',
      fecha_hora: new Date().toISOString(),
      usuario_nombre: 'Sistema',
      comentario: 'OT creada'
    }]
  };
  
  ordenesTrabajo.push(newOT);
  res.status(201).json({ success: true, data: newOT, message: 'OT creada' });
});

app.patch('/api/ot/:id/estado', (req, res) => {
  const ot = ordenesTrabajo.find(o => o.ot_id === parseInt(req.params.id));
  if (!ot) return res.status(404).json({ success: false, message: 'OT no encontrada' });
  
  const { estado_nuevo, usuario_nombre, comentario } = req.body;
  const estado_anterior = ot.estado;
  
  ot.estado = estado_nuevo;
  ot.trazabilidad?.push({
    trazabilidad_id: Date.now(),
    ot_id: ot.ot_id,
    estado_anterior,
    estado_nuevo,
    fecha_hora: new Date().toISOString(),
    usuario_nombre: usuario_nombre || 'Operario',
    comentario: comentario || ''
  });
  
  res.json({ success: true, data: ot, message: `Estado cambiado a ${estado_nuevo}` });
});

// Cotizaciones
app.get('/api/cotizaciones', (req, res) => {
  res.json({ success: true, data: cotizaciones });
});

app.get('/api/cotizaciones/:id', (req, res) => {
  const cot = cotizaciones.find(c => c.cotizacion_id === parseInt(req.params.id));
  if (cot) res.json({ success: true, data: cot });
  else res.status(404).json({ success: false, message: 'Cotización no encontrada' });
});

app.post('/api/cotizaciones', (req, res) => {
  const { patente, cliente_id, vehiculo_id, items, observaciones } = req.body;
  
  const newCot = {
    cotizacion_id: nextCotId++,
    numero_cotizacion: `COT-20260729-${String(nextCotId - 1).padStart(5, '0')}`,
    patente,
    cliente_id,
    vehiculo_id,
    fecha_creacion: new Date().toISOString(),
    fecha_validez: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    estado: 'PENDIENTE',
    total: items?.reduce((sum: number, item: any) => sum + (item.precio_unitario * item.cantidad), 0) || 0,
    observaciones: observaciones || '',
    detalles: items?.map((item: any, idx: number) => ({
      detalle_cotizacion_id: idx + 1,
      cotizacion_id: nextCotId - 1,
      tipo_item: item.tipo_item,
      producto_id: item.producto_id,
      servicio_id: item.servicio_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      subtotal: item.cantidad * item.precio_unitario,
      producto_nombre: item.tipo_item === 'PRODUCTO' ? 'Producto' : undefined,
      servicio_nombre: item.tipo_item === 'SERVICIO' ? servicios.find(s => s.servicio_id === item.servicio_id)?.nombre : undefined
    })) || []
  };
  
  cotizaciones.push(newCot);
  res.status(201).json({ success: true, data: newCot, message: 'Cotización creada' });
});

app.patch('/api/cotizaciones/:id/estado', (req, res) => {
  const cot = cotizaciones.find(c => c.cotizacion_id === parseInt(req.params.id));
  if (!cot) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
  
  cot.estado = req.body.estado;
  res.json({ success: true, data: cot, message: 'Estado actualizado' });
});

app.patch('/api/cotizaciones/:id/convertir-ot', (req, res) => {
  const cot = cotizaciones.find(c => c.cotizacion_id === parseInt(req.params.id));
  if (!cot) return res.status(404).json({ success: false, message: 'Cotización no encontrada' });
  
  cot.estado = 'CONVERTIDA_OT';
  res.json({ success: true, data: { cotizacion: cot, mensaje: 'Convertida exitosamente' } });
});

// Vehículos
app.get('/api/vehiculos/:patente/historial', (req, res) => {
  const patente = req.params.patente.toUpperCase();
  const vehiculo = vehiculos.find(v => v.patente === patente);
  
  if (!vehiculo) {
    return res.status(404).json({ success: false, message: 'Vehículo no encontrado' });
  }
  
  const historial = ordenesTrabajo
    .filter(o => o.patente === patente)
    .sort((a, b) => new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime());
  
  res.json({ success: true, data: historial });
});

// Clientes
app.get('/api/clientes', (req, res) => {
  const clientesConVehiculos = clientes.map(c => ({
    ...c,
    vehiculos: vehiculos.filter(v => v.cliente_id === c.cliente_id).map(v => ({
      vehiculo_id: v.vehiculo_id,
      patente: v.patente,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      color: v.color
    }))
  }));
  res.json({ success: true, data: clientesConVehiculos });
});

app.get('/api/clientes/:id', (req, res) => {
  const cliente = clientes.find(c => c.cliente_id === parseInt(req.params.id));
  if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  
  const clienteConVehiculos = {
    ...cliente,
    vehiculos: vehiculos.filter(v => v.cliente_id === cliente.cliente_id)
  };
  res.json({ success: true, data: clienteConVehiculos });
});

app.post('/api/clientes', (req, res) => {
  const { rut_dni, nombre, email, telefono, direccion, comuna, ciudad } = req.body;
  
  if (!rut_dni || !nombre || !telefono) {
    return res.status(400).json({ success: false, message: 'RUT/DNI, nombre y teléfono son requeridos' });
  }
  
  const existe = clientes.find(c => c.rut_dni === rut_dni);
  if (existe) {
    return res.status(409).json({ success: false, message: 'Ya existe un cliente con ese RUT/DNI' });
  }
  
  const nuevoCliente = {
    cliente_id: clientes.length + 1,
    rut_dni,
    nombre,
    email: email || '',
    telefono,
    direccion: direccion || '',
    comuna: comuna || '',
    ciudad: ciudad || 'Santiago'
  };
  
  clientes.push(nuevoCliente);
  res.status(201).json({ success: true, data: nuevoCliente, message: 'Cliente creado correctamente' });
});

// Crear vehículo para un cliente
app.post('/api/vehiculos', (req, res) => {
  const { patente, cliente_id, marca, modelo, anio, kilometraje_actual, color, observaciones } = req.body;
  
  if (!patente || !cliente_id || !marca || !modelo) {
    return res.status(400).json({ success: false, message: 'Patente, cliente_id, marca y modelo son requeridos' });
  }
  
  const existePatente = vehiculos.find(v => v.patente === patente.toUpperCase());
  if (existePatente) {
    return res.status(409).json({ success: false, message: 'Ya existe un vehículo con esa patente' });
  }
  
  const cliente = clientes.find(c => c.cliente_id === cliente_id);
  if (!cliente) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }
  
  const nuevoVehiculo = {
    vehiculo_id: vehiculos.length + 1,
    patente: patente.toUpperCase(),
    cliente_id,
    marca,
    modelo,
    anio: anio || new Date().getFullYear(),
    kilometraje_actual: kilometraje_actual || 0,
    color: color || 'Sin especificar',
    observaciones: observaciones || '',
    cliente
  };
  
  vehiculos.push(nuevoVehiculo);
  res.status(201).json({ success: true, data: nuevoVehiculo, message: 'Vehículo creado correctamente' });
});

// Crear cliente + vehículo en un solo endpoint
app.post('/api/clientes-con-vehiculo', (req, res) => {
  const { cliente, vehiculo } = req.body;
  
  if (!cliente || !vehiculo) {
    return res.status(400).json({ success: false, message: 'Datos de cliente y vehículo son requeridos' });
  }
  
  if (!cliente.rut_dni || !cliente.nombre || !cliente.telefono) {
    return res.status(400).json({ success: false, message: 'RUT/DNI, nombre y teléfono del cliente son requeridos' });
  }
  
  if (!vehiculo.patente || !vehiculo.marca || !vehiculo.modelo) {
    return res.status(400).json({ success: false, message: 'Patente, marca y modelo del vehículo son requeridos' });
  }
  
  // Crear cliente
  const nuevoCliente = {
    cliente_id: clientes.length + 1,
    rut_dni: cliente.rut_dni,
    nombre: cliente.nombre,
    email: cliente.email || '',
    telefono: cliente.telefono,
    direccion: cliente.direccion || '',
    comuna: cliente.comuna || '',
    ciudad: cliente.ciudad || 'Santiago'
  };
  clientes.push(nuevoCliente);
  
  // Crear vehículo
  const nuevoVehiculo = {
    vehiculo_id: vehiculos.length + 1,
    patente: vehiculo.patente.toUpperCase(),
    cliente_id: nuevoCliente.cliente_id,
    marca: vehiculo.marca,
    modelo: vehiculo.modelo,
    anio: vehiculo.anio || new Date().getFullYear(),
    kilometraje_actual: vehiculo.kilometraje_actual || 0,
    color: vehiculo.color || 'Sin especificar',
    observaciones: vehiculo.observaciones || '',
    cliente: nuevoCliente
  };
  vehiculos.push(nuevoVehiculo);
  
  res.status(201).json({ 
    success: true, 
    data: { 
      cliente: nuevoCliente, 
      vehiculo: nuevoVehiculo 
    }, 
    message: 'Cliente y vehículo creados correctamente' 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Mock corriendo en http://localhost:${PORT}`);
  console.log(`\n📡 API Endpoints disponibles:`);
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/productos`);
  console.log(`   GET    /api/servicios`);
  console.log(`   GET    /api/ot`);
  console.log(`   POST   /api/ot`);
  console.log(`   PATCH  /api/ot/:id/estado`);
  console.log(`   GET    /api/cotizaciones`);
  console.log(`   POST   /api/cotizaciones`);
  console.log(`   GET    /api/vehiculos/:patente/historial`);
  console.log(`\n✅ Listo para recibir conexiones del Frontend\n`);
});
