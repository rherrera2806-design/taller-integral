import pool from '../config/database';
import { Servicio } from '../types';

export class ServicioService {
  async findAll(categoria?: string): Promise<Servicio[]> {
    let query = 'SELECT * FROM servicios WHERE activo = true';
    const params: any[] = [];

    if (categoria) {
      query += ' AND categoria = $1';
      params.push(categoria);
    }

    query += ' ORDER BY categoria, nombre';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number): Promise<Servicio | null> {
    const result = await pool.query(
      'SELECT * FROM servicios WHERE servicio_id = $1 AND activo = true',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(servicio: Servicio): Promise<Servicio> {
    const result = await pool.query(
      `INSERT INTO servicios (nombre, descripcion, precio_base, categoria, duracion_estimada_minutos)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        servicio.nombre,
        servicio.descripcion,
        servicio.precio_base,
        servicio.categoria,
        servicio.duracion_estimada_minutos
      ]
    );
    return result.rows[0];
  }

  async update(id: number, servicio: Partial<Servicio>): Promise<Servicio | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(servicio).forEach((key) => {
      if (key !== 'servicio_id' && key !== 'fecha_registro') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(servicio[key as keyof Servicio]);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE servicios SET ${fields.join(', ')} 
       WHERE servicio_id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'UPDATE servicios SET activo = false WHERE servicio_id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export default new ServicioService();
