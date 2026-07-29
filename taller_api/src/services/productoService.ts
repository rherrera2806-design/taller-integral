import pool from '../config/database';
import { Producto, ApiResponse } from '../types';

export class ProductoService {
  async findAll(): Promise<Producto[]> {
    const result = await pool.query(
      'SELECT * FROM productos WHERE activo = true ORDER BY nombre'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Producto | null> {
    const result = await pool.query(
      'SELECT * FROM productos WHERE producto_id = $1 AND activo = true',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByCodigoBarras(codigoBarras: string): Promise<Producto | null> {
    const result = await pool.query(
      'SELECT * FROM productos WHERE codigo_barras = $1 AND activo = true',
      [codigoBarras]
    );
    return result.rows[0] || null;
  }

  async create(producto: Producto): Promise<Producto> {
    const result = await pool.query(
      `INSERT INTO productos (codigo_barras, nombre, descripcion, categoria, 
       stock_actual, stock_minimo, precio_costo, precio_venta, unidad_medida, proveedor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        producto.codigo_barras,
        producto.nombre,
        producto.descripcion,
        producto.categoria,
        producto.stock_actual,
        producto.stock_minimo,
        producto.precio_costo,
        producto.precio_venta,
        producto.unidad_medida,
        producto.proveedor
      ]
    );
    return result.rows[0];
  }

  async update(id: number, producto: Partial<Producto>): Promise<Producto | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.keys(producto).forEach((key) => {
      if (key !== 'producto_id' && key !== 'fecha_registro') {
        fields.push(`${key} = $${paramIndex}`);
        values.push(producto[key as keyof Producto]);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE productos SET ${fields.join(', ')} 
       WHERE producto_id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      'UPDATE productos SET activo = false WHERE producto_id = $1',
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  async descontarStock(productoId: number, cantidad: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const producto = await client.query(
        'SELECT stock_actual FROM productos WHERE producto_id = $1 FOR UPDATE',
        [productoId]
      );

      if (producto.rows.length === 0) {
        throw new Error('Producto no encontrado');
      }

      const stockActual = producto.rows[0].stock_actual;
      if (stockActual < cantidad) {
        throw new Error(`Stock insuficiente. Stock actual: ${stockActual}, solicitado: ${cantidad}`);
      }

      await client.query(
        'UPDATE productos SET stock_actual = stock_actual - $1 WHERE producto_id = $2',
        [cantidad, productoId]
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

  async getAlertasStockBajo(): Promise<Producto[]> {
    const result = await pool.query(
      `SELECT *, (stock_minimo - stock_actual) as unidades_faltantes
       FROM productos 
       WHERE stock_actual <= stock_minimo AND activo = true
       ORDER BY unidades_faltantes DESC`
    );
    return result.rows;
  }

  async incrementarStock(productoId: number, cantidad: number): Promise<boolean> {
    const result = await pool.query(
      'UPDATE productos SET stock_actual = stock_actual + $1 WHERE producto_id = $2',
      [cantidad, productoId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}

export default new ProductoService();
