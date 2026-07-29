import pool from '../config/database';
import { OrdenTrabajo, DetalleOT, TrazabilidadOT, CrearOTRequest, ApiResponse } from '../types';
import productoService from './productoService';

export class OrdenTrabajoService {
  async findAll(estado?: string): Promise<OrdenTrabajo[]> {
    let query = 'SELECT * FROM ordenes_trabajo WHERE activo = true';
    const params: any[] = [];

    if (estado) {
      query += ' AND estado = $1';
      params.push(estado);
    }

    query += ' ORDER BY fecha_ingreso DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<any | null> {
    const otResult = await pool.query(
      'SELECT * FROM ordenes_trabajo WHERE ot_id = $1 AND activo = true',
      [id]
    );

    if (otResult.rows.length === 0) return null;

    const ot = otResult.rows[0];

    const detallesResult = await pool.query(
      `SELECT d.*, 
              p.nombre as producto_nombre, p.codigo_barras,
              s.nombre as servicio_nombre, s.categoria as servicio_categoria
       FROM detalles_ot d
       LEFT JOIN productos p ON d.producto_id = p.producto_id
       LEFT JOIN servicios s ON d.servicio_id = s.servicio_id
       WHERE d.ot_id = $1`,
      [id]
    );

    const trazabilidadResult = await pool.query(
      'SELECT * FROM trazabilidad_ot WHERE ot_id = $1 ORDER BY fecha_hora DESC',
      [id]
    );

    return {
      ...ot,
      detalles: detallesResult.rows,
      trazabilidad: trazabilidadResult.rows
    };
  }

  async create(data: CrearOTRequest): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const vehiculo = await client.query(
        'SELECT * FROM vehiculos WHERE vehiculo_id = $1',
        [data.vehiculo_id]
      );

      if (vehiculo.rows.length === 0) {
        throw new Error('Vehículo no encontrado');
      }

      const otResult = await client.query(
        `INSERT INTO ordenes_trabajo (
          patente, cliente_id, vehiculo_id, fecha_estimada_entrega,
          observaciones_recepcion, kilomatraje_ingreso, usuario_recepcion_id, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'RECIBIDO') RETURNING *`,
        [
          data.patente,
          data.cliente_id,
          data.vehiculo_id,
          data.fecha_estimada_entrega,
          data.observaciones_recepcion,
          data.kilomatraje_ingreso,
          data.usuario_recepcion_id
        ]
      );

      const ot = otResult.rows[0];

      for (const item of data.items) {
        await client.query(
          `INSERT INTO detalles_ot (
            ot_id, tipo_item, producto_id, servicio_id, cantidad,
            precio_unitario, descuento_porcentaje, observaciones
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            ot.ot_id,
            item.tipo_item,
            item.producto_id,
            item.servicio_id,
            item.cantidad,
            item.precio_unitario,
            item.descuento_porcentaje || 0,
            item.observaciones
          ]
        );
      }

      await client.query(
        `INSERT INTO trazabilidad_ot (ot_id, estado_nuevo, usuario_id, comentario)
         VALUES ($1, 'RECIBIDO', $2, 'OT creada')`,
        [ot.ot_id, data.usuario_recepcion_id]
      );

      await client.query('COMMIT');

      return this.findById(ot.ot_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cambiarEstado(otId: number, data: TrazabilidadOT): Promise<OrdenTrabajo | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const otResult = await client.query(
        'SELECT * FROM ordenes_trabajo WHERE ot_id = $1 AND activo = true FOR UPDATE',
        [otId]
      );

      if (otResult.rows.length === 0) {
        throw new Error('Orden de trabajo no encontrada');
      }

      const otActual = otResult.rows[0];
      const estadoAnterior = otActual.estado;
      const estadoNuevo = data.estado_nuevo;

      const estadosValidos: Record<string, string[]> = {
        'RECIBIDO': ['EN_PROCESO', 'CANCELADO'],
        'EN_PROCESO': ['CONTROL_CALIDAD', 'LISTO', 'CANCELADO'],
        'CONTROL_CALIDAD': ['EN_PROCESO', 'LISTO', 'CANCELADO'],
        'LISTO': ['ENTREGADO', 'CANCELADO'],
        'ENTREGADO': [],
        'CANCELADO': []
      };

      if (!estadosValidos[estadoAnterior]?.includes(estadoNuevo)) {
        throw new Error(`Transición de estado no válida: ${estadoAnterior} → ${estadoNuevo}`);
      }

      await client.query(
        'UPDATE ordenes_trabajo SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE ot_id = $2',
        [estadoNuevo, otId]
      );

      await client.query(
        `INSERT INTO trazabilidad_ot (ot_id, estado_anterior, estado_nuevo, usuario_id, usuario_nombre, comentario)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [otId, estadoAnterior, estadoNuevo, data.usuario_id, data.usuario_nombre, data.comentario]
      );

      if (estadoNuevo === 'ENTREGADO') {
        await client.query(
          'UPDATE ordenes_trabajo SET fecha_entrega_real = CURRENT_TIMESTAMP WHERE ot_id = $1',
          [otId]
        );
      }

      await client.query('COMMIT');

      return this.findById(otId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async cerrarOT(otId: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const ot = await client.query(
        'SELECT * FROM ordenes_trabajo WHERE ot_id = $1 AND activo = true',
        [otId]
      );

      if (ot.rows.length === 0) {
        throw new Error('Orden de trabajo no encontrada');
      }

      if (ot.rows[0].estado !== 'LISTO') {
        throw new Error('La OT debe estar en estado LISTO para cerrar');
      }

      const detalles = await client.query(
        'SELECT * FROM detalles_ot WHERE ot_id = $1 AND tipo_item = $2',
        [otId, 'PRODUCTO']
      );

      for (const detalle of detalles.rows) {
        await productoService.descontarStock(detalle.producto_id, detalle.cantidad);
      }

      await client.query(
        `UPDATE ordenes_trabajo 
         SET estado = 'ENTREGADO', fecha_entrega_real = CURRENT_TIMESTAMP 
         WHERE ot_id = $1`,
        [otId]
      );

      await client.query(
        `INSERT INTO trazabilidad_ot (ot_id, estado_anterior, estado_nuevo, comentario)
         VALUES ($1, 'LISTO', 'ENTREGADO', 'OT cerrada - stock descontado automáticamente')`,
        [otId]
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getHistorialVehiculo(patente: string): Promise<any[]> {
    const vehiculo = await pool.query(
      'SELECT * FROM vehiculos WHERE patente = $1',
      [patente]
    );

    if (vehiculo.rows.length === 0) {
      throw new Error('Vehículo no encontrado');
    }

    const ordenes = await pool.query(
      `SELECT ot.*, c.nombre as cliente_nombre
       FROM ordenes_trabajo ot
       JOIN clientes c ON ot.cliente_id = c.cliente_id
       WHERE ot.patente = $1 AND ot.activo = true
       ORDER BY ot.fecha_ingreso DESC`,
      [patente]
    );

    const historial = [];

    for (const ot of ordenes.rows) {
      const detalles = await pool.query(
        `SELECT d.*, 
                p.nombre as producto_nombre,
                s.nombre as servicio_nombre
         FROM detalles_ot d
         LEFT JOIN productos p ON d.producto_id = p.producto_id
         LEFT JOIN servicios s ON d.servicio_id = s.servicio_id
         WHERE d.ot_id = $1`,
        [ot.ot_id]
      );

      historial.push({
        ...ot,
        productos_aplicados: detalles.rows.filter(d => d.tipo_item === 'PRODUCTO'),
        servicios_aplicados: detalles.rows.filter(d => d.tipo_item === 'SERVICIO')
      });
    }

    return historial;
  }

  async calcularTotal(otId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(subtotal - (subtotal * descuento_porcentaje / 100)), 0) as total
       FROM detalles_ot WHERE ot_id = $1`,
      [otId]
    );

    const total = result.rows[0].total;

    await pool.query(
      'UPDATE ordenes_trabajo SET total = $1 WHERE ot_id = $2',
      [total, otId]
    );

    return total;
  }
}

export default new OrdenTrabajoService();
