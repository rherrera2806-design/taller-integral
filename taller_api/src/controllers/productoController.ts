import { Request, Response } from 'express';
import productoService from '../services/productoService';
import { Producto, ApiResponse } from '../types';

export class ProductoController {
  async getAll(req: Request, res: Response) {
    try {
      const productos = await productoService.findAll();
      const response: ApiResponse<Producto[]> = {
        success: true,
        message: 'Productos obtenidos correctamente',
        data: productos
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener productos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const producto = await productoService.findById(parseInt(id));
      
      if (!producto) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Producto no encontrado'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<Producto> = {
        success: true,
        message: 'Producto obtenido correctamente',
        data: producto
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener producto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async getByCodigoBarras(req: Request, res: Response) {
    try {
      const { codigo } = req.params;
      const producto = await productoService.findByCodigoBarras(codigo);
      
      if (!producto) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Producto no encontrado por código de barras'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<Producto> = {
        success: true,
        message: 'Producto obtenido correctamente',
        data: producto
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener producto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const productoData: Producto = req.body;

      if (!productoData.codigo_barras || !productoData.nombre || !productoData.categoria) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Faltan campos obligatorios: codigo_barras, nombre, categoria'
        };
        return res.status(400).json(response);
      }

      const existing = await productoService.findByCodigoBarras(productoData.codigo_barras);
      if (existing) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Ya existe un producto con ese código de barras'
        };
        return res.status(409).json(response);
      }

      const nuevoProducto = await productoService.create(productoData);
      const response: ApiResponse<Producto> = {
        success: true,
        message: 'Producto creado correctamente',
        data: nuevoProducto
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al crear producto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productoData = req.body;

      const producto = await productoService.findById(parseInt(id));
      if (!producto) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Producto no encontrado'
        };
        return res.status(404).json(response);
      }

      const productoActualizado = await productoService.update(parseInt(id), productoData);
      const response: ApiResponse<Producto> = {
        success: true,
        message: 'Producto actualizado correctamente',
        data: productoActualizado!
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al actualizar producto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eliminado = await productoService.delete(parseInt(id));
      
      if (!eliminado) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Producto no encontrado'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Producto eliminado correctamente'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al eliminar producto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async descontarStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      if (!cantidad || cantidad <= 0) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'La cantidad debe ser mayor a 0'
        };
        return res.status(400).json(response);
      }

      const descontado = await productoService.descontarStock(parseInt(id), cantidad);
      
      const response: ApiResponse<null> = {
        success: true,
        message: `Stock descontado correctamente: ${cantidad} unidades`
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al descontar stock',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async getAlertasStockBajo(req: Request, res: Response) {
    try {
      const alertas = await productoService.getAlertasStockBajo();
      const response: ApiResponse<Producto[]> = {
        success: true,
        message: `Se encontraron ${alertas.length} productos con stock bajo`,
        data: alertas
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener alertas de stock',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }
}

export default new ProductoController();
