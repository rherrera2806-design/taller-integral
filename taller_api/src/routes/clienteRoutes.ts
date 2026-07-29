import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'vehiculo_id', v.vehiculo_id,
              'patente', v.patente,
              'marca', v.marca,
              'modelo', v.modelo,
              'anio', v.anio,
              'color', v.color
            )
          ) FILTER (WHERE v.vehiculo_id IS NOT NULL), 
          '[]'
        ) as vehiculos
      FROM clientes c
      LEFT JOIN vehiculos v ON c.cliente_id = v.cliente_id
      WHERE c.activo = true
      GROUP BY c.cliente_id
      ORDER BY c.nombre
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ success: false, message: 'Error al obtener clientes' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'vehiculo_id', v.vehiculo_id,
              'patente', v.patente,
              'marca', v.marca,
              'modelo', v.modelo,
              'anio', v.anio,
              'color', v.color
            )
          ) FILTER (WHERE v.vehiculo_id IS NOT NULL), 
          '[]'
        ) as vehiculos
      FROM clientes c
      LEFT JOIN vehiculos v ON c.cliente_id = v.cliente_id
      WHERE c.cliente_id = $1
      GROUP BY c.cliente_id
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ success: false, message: 'Error al obtener cliente' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { rut_dni, nombre, email, telefono, direccion, comuna, ciudad } = req.body;
    
    if (!rut_dni || !nombre || !telefono) {
      return res.status(400).json({ success: false, message: 'RUT/DNI, nombre y teléfono son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (rut_dni, nombre, email, telefono, direccion, comuna, ciudad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [rut_dni, nombre, email || '', telefono, direccion || '', comuna || '', ciudad || '']
    );
    
    res.status(201).json({ success: true, data: result.rows[0], message: 'Cliente creado correctamente' });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Ya existe un cliente con ese RUT/DNI' });
    }
    console.error('Error al crear cliente:', error);
    res.status(500).json({ success: false, message: 'Error al crear cliente' });
  }
});

router.post('/con-vehiculo', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { cliente, vehiculo } = req.body;
    
    if (!cliente || !vehiculo) {
      return res.status(400).json({ success: false, message: 'Datos de cliente y vehículo son requeridos' });
    }

    const clienteResult = await client.query(
      'INSERT INTO clientes (rut_dni, nombre, email, telefono, direccion, comuna, ciudad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [cliente.rut_dni, cliente.nombre, cliente.email || '', cliente.telefono, cliente.direccion || '', cliente.comuna || '', cliente.ciudad || '']
    );
    
    const nuevoCliente = clienteResult.rows[0];

    const vehiculoResult = await client.query(
      'INSERT INTO vehiculos (patente, cliente_id, marca, modelo, anio, kilometraje_actual, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [vehiculo.patente.toUpperCase(), nuevoCliente.cliente_id, vehiculo.marca, vehiculo.modelo, vehiculo.anio || new Date().getFullYear(), vehiculo.kilometraje_actual || 0, vehiculo.color || 'Sin especificar']
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      success: true, 
      data: { cliente: nuevoCliente, vehiculo: vehiculoResult.rows[0] },
      message: 'Cliente y vehículo creados correctamente' 
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Ya existe un cliente con ese RUT/DNI o un vehículo con esa patente' });
    }
    console.error('Error al crear cliente y vehículo:', error);
    res.status(500).json({ success: false, message: 'Error al crear cliente y vehículo' });
  } finally {
    client.release();
  }
});

export default router;
