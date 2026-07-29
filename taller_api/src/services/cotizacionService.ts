import pool from '../config/database';
import { Cotizacion, DetalleCotizacion, CrearOTRequest, ApiResponse } from '../types';

export class CotizacionService {
  async findAll(estado?: string): Promise<Cotizacion[]> {
    let query = 'SELECT * FROM cotizaciones WHERE activo = true';
    const params: any[] = [];

    if (estado) {
      query += ' AND estado = $1';
      params.push(estado);
    }

    query += ' ORDER BY fecha_creacion DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<any | null> {
    const cotResult = await pool.query(
      'SELECT * FROM cotizaciones WHERE cotizacion_id = $1 AND activo = true',
      [id]
    );

    if (cotResult.rows.length === 0) return null;

    const cotizacion = cotResult.rows[0];

    const detallesResult = await pool.query(
      `SELECT d.*, 
              p.nombre as producto_nombre, p.codigo_barras,
              s.nombre as servicio_nombre, s.categoria as servicio_categoria
       FROM detalles_cotizacion d
       LEFT JOIN productos p ON d.producto_id = p.producto_id
       LEFT JOIN servicios s ON d.servicio_id = s.servicio_id
       WHERE d.cotizacion_id = $1`,
      [id]
    );

    return {
      ...cotizacion,
      detalles: detallesResult.rows
    };
  }

  async create(cotizacion: any): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const vehiculo = await client.query(
        'SELECT * FROM vehiculos WHERE vehiculo_id = $1',
        [cotizacion.vehiculo_id]
      );

      if (vehiculo.rows.length === 0) {
        throw new Error('Vehículo no encontrado');
      }

      const fechaValidez = cotizacion.fecha_validez || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const cotResult = await client.query(
        `INSERT INTO cotizaciones (
          patente, cliente_id, vehiculo_id, fecha_validez,
          observaciones, usuario_creador_id, usuario_creador_nombre
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          cotizacion.patente,
          cotizacion.cliente_id,
          cotizacion.vehiculo_id,
          fechaValidez,
          cotizacion.observaciones,
          cotizacion.usuario_creador_id,
          cotizacion.usuario_creador_nombre
        ]
      );

      const nuevaCotizacion = cotResult.rows[0];

      for (const item of cotizacion.items || []) {
        await client.query(
          `INSERT INTO detalles_cotizacion (
            cotizacion_id, tipo_item, producto_id, servicio_id, cantidad,
            precio_unitario, descuento_porcentaje, observaciones
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            nuevaCotizacion.cotizacion_id,
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

      await client.query('COMMIT');

      return this.findById(nuevaCotizacion.cotizacion_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateEstado(id: number, estado: string, motivoRechazo?: string): Promise<Cotizacion | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const cotResult = await client.query(
        'SELECT * FROM cotizaciones WHERE cotizacion_id = $1 AND activo = true FOR UPDATE',
        [id]
      );

      if (cotResult.rows.length === 0) {
        throw new Error('Cotización no encontrada');
      }

      const cotActual = cotResult.rows[0];

      if (cotActual.estado === 'CONVERTIDA_OT') {
        throw new Error('No se puede modificar una cotización ya convertida en OT');
      }

      if (cotActual.estado === 'VENCIDA') {
        throw new Error('No se puede modificar una cotización vencida');
      }

      let query = 'UPDATE cotizaciones SET estado = $1';
      let params: any[] = [estado];

      if (estado === 'RECHAZADA' && motivoRechazo) {
        query += ', motivo_rechazo = $2';
        params.push(motivoRechazo);
      }

      query += ' WHERE cotizacion_id = $' + (params.length + 1);
      params.push(id);

      await client.query(query, params);

      await client.query('COMMIT');

      return this.findById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async convertirEnOT(cotizacionId: number, data: {
    fecha_estimada_entrega?: Date;
    observaciones_recepcion?: string;
    usuario_recepcion_id?: number;
  }): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const cotResult = await client.query(
        'SELECT * FROM cotizaciones WHERE cotizacion_id = $1 AND activo = true FOR UPDATE',
        [cotizacionId]
      );

      if (cotResult.rows.length === 0) {
        throw new Error('Cotización no encontrada');
      }

      const cotizacion = cotResult.rows[0];

      if (cotizacion.estado !== 'PENDIENTE' && cotizacion.estado !== 'APROBADA') {
        throw new Error('Solo se pueden convertir cotizaciones en estado PENDIENTE o APROBADA');
      }

      const detallesResult = await client.query(
        'SELECT * FROM detalles_cotizacion WHERE cotizacion_id = $1',
        [cotizacionId]
      );

      const vehiculo = await client.query(
        'SELECT * FROM vehiculos WHERE vehiculo_id = $1',
        [cotizacion.vehiculo_id]
      );

      if (vehiculo.rows.length === 0) {
        throw new Error('Vehículo asociado a la cotización no encontrado');
      }

      const otResult = await client.query(
        `INSERT INTO ordenes_trabajo (
          patente, cliente_id, vehiculo_id, fecha_estimada_entrega,
          observaciones_recepcion, usuario_recepcion_id, estado
        ) VALUES ($1, $2, $3, $4, $5, $6, 'RECIBIDO') RETURNING *`,
        [
          cotizacion.patente,
          cotizacion.cliente_id,
          cotizacion.vehiculo_id,
          data.fecha_estimada_entrega,
          data.observaciones_recepcion || `Convertida desde cotización ${cotizacion.numero_cotizacion}`,
          data.usuario_recepcion_id
        ]
      );

      const nuevaOT = otResult.rows[0];

      for (const detalle of detallesResult.rows) {
        await client.query(
          `INSERT INTO detalles_ot (
            ot_id, tipo_item, producto_id, servicio_id, cantidad,
            precio_unitario, descuento_porcentaje, observaciones
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            nuevaOT.ot_id,
            detalle.tipo_item,
            detalle.producto_id,
            detalle.servicio_id,
            detalle.cantidad,
            detalle.precio_unitario,
            detalle.descuento_porcentaje,
            detalle.observaciones
          ]
        );
      }

      await client.query(
        `INSERT INTO trazabilidad_ot (ot_id, estado_nuevo, usuario_id, comentario)
         VALUES ($1, 'RECIBIDO', $2, $3)`,
        [
          nuevaOT.ot_id,
          data.usuario_recepcion_id,
          `OT creada desde cotización ${cotizacion.numero_cotizacion}`
        ]
      );

      await client.query(
        'UPDATE cotizaciones SET estado = $1, ot_id_generada = $2 WHERE cotizacion_id = $3',
        ['CONVERTIDA_OT', nuevaOT.ot_id, cotizacionId]
      );

      await client.query('COMMIT');

      return {
        cotizacion: cotizacion,
        orden_trabajo: nuevaOT,
        mensaje: `Cotización ${cotizacion.numero_cotizacion} convertida exitosamente en OT ${nuevaOT.numero_ot}`
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async calcularTotal(cotizacionId: number): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(subtotal - (subtotal * descuento_porcentaje / 100)), 0) as total
       FROM detalles_cotizacion WHERE cotizacion_id = $1`,
      [cotizacionId]
    );

    const total = result.rows[0].total;

    await pool.query(
      'UPDATE cotizaciones SET total = $1 WHERE cotizacion_id = $2',
      [total, cotizacionId]
    );

    return total;
  }

  async validarStock(cotizacionId: number): Promise<{ valido: boolean; detalles: any[] }> {
    const detalles = await pool.query(
      `SELECT d.*, p.stock_actual, p.nombre as producto_nombre
       FROM detalles_cotizacion d
       JOIN productos p ON d.producto_id = p.producto_id
       WHERE d.cotizacion_id = $1 AND d.tipo_item = 'PRODUCTO'`,
      [cotizacionId]
    );

    const problemas = detalles.rows.filter(d => d.stock_actual < d.cantidad);

    return {
      valido: problemas.length === 0,
      detalles: detalles.rows.map(d => ({
        producto_id: d.producto_id,
        nombre: d.producto_nombre,
        solicitado: d.cantidad,
        disponible: d.stock_actual,
        suficiente: d.stock_actual >= d.cantidad
      }))
    };
  }
}

export default new CotizacionService();
