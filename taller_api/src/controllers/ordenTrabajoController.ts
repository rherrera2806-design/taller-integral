import { Request, Response } from 'express';
import ordenTrabajoService from '../services/ordenTrabajoService';
import { OrdenTrabajo, CrearOTRequest, CambiarEstadoRequest, ApiResponse } from '../types';

export class OrdenTrabajoController {
  async getAll(req: Request, res: Response) {
    try {
      const { estado } = req.query;
      const ordenes = await ordenTrabajoService.findAll(estado as string);
      const response: ApiResponse<OrdenTrabajo[]> = {
        success: true,
        message: 'Órdenes de trabajo obtenidas correctamente',
        data: ordenes
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener órdenes de trabajo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const orden = await ordenTrabajoService.findById(parseInt(id));
      
      if (!orden) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Orden de trabajo no encontrada'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Orden de trabajo obtenida correctamente',
        data: orden
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener orden de trabajo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CrearOTRequest = req.body;

      if (!data.patente || !data.cliente_id || !data.vehiculo_id || !data.items?.length) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Faltan campos obligatorios: patente, cliente_id, vehiculo_id, items'
        };
        return res.status(400).json(response);
      }

      const patenteRegex = /^[A-Z]{2}-[0-9]{4}$|^[A-Z]{4}-[0-9]{2}$/i;
      if (!patenteRegex.test(data.patente)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Formato de patente no válido. Use: ABC-1234 o ABCD-12'
        };
        return res.status(400).json(response);
      }

      for (const item of data.items) {
        if (item.tipo_item === 'PRODUCTO' && item.producto_id) {
          const producto = await require('../services/productoService').default.findById(item.producto_id);
          if (!producto) {
            const response: ApiResponse<null> = {
              success: false,
              message: `Producto con ID ${item.producto_id} no encontrado`
            };
            return res.status(400).json(response);
          }
          if (producto.stock_actual < item.cantidad) {
            const response: ApiResponse<null> = {
              success: false,
              message: `Stock insuficiente para ${producto.nombre}. Stock actual: ${producto.stock_actual}, solicitado: ${item.cantidad}`
            };
            return res.status(400).json(response);
          }
        }
      }

      const nuevaOT = await ordenTrabajoService.create(data);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Orden de trabajo creada correctamente',
        data: nuevaOT
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al crear orden de trabajo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async cambiarEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: CambiarEstadoRequest = req.body;

      if (!data.estado_nuevo) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'El campo estado_nuevo es requerido'
        };
        return res.status(400).json(response);
      }

      const estadosPermitidos = ['EN_PROCESO', 'CONTROL_CALIDAD', 'LISTO', 'ENTREGADO', 'CANCELADO'];
      if (!estadosPermitidos.includes(data.estado_nuevo)) {
        const response: ApiResponse<null> = {
          success: false,
          message: `Estado no válido. Estados permitidos: ${estadosPermitidos.join(', ')}`
        };
        return res.status(400).json(response);
      }

      const ordenActualizada = await ordenTrabajoService.cambiarEstado(parseInt(id), {
        ot_id: parseInt(id),
        estado_nuevo: data.estado_nuevo,
        usuario_id: data.usuario_id,
        usuario_nombre: data.usuario_nombre,
        comentario: data.comentario
      });

      const response: ApiResponse<any> = {
        success: true,
        message: `Estado cambiado correctamente a ${data.estado_nuevo}`,
        data: ordenActualizada
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al cambiar estado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async cerrarOT(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cerrada = await ordenTrabajoService.cerrarOT(parseInt(id));

      const response: ApiResponse<null> = {
        success: true,
        message: 'OT cerrada correctamente. Stock descontado automáticamente.'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al cerrar OT',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async getHistorialVehiculo(req: Request, res: Response) {
    try {
      const { patente } = req.params;

      const patenteRegex = /^[A-Z]{2}-[0-9]{4}$|^[A-Z]{4}-[0-9]{2}$/i;
      if (!patenteRegex.test(patente)) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Formato de patente no válido'
        };
        return res.status(400).json(response);
      }

      const historial = await ordenTrabajoService.getHistorialVehiculo(patente.toUpperCase());
      const response: ApiResponse<any[]> = {
        success: true,
        message: `Historial del vehículo ${patente} obtenido correctamente`,
        data: historial
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener historial del vehículo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async calcularTotal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const total = await ordenTrabajoService.calcularTotal(parseInt(id));
      const response: ApiResponse<{ total: number }> = {
        success: true,
        message: 'Total calculado correctamente',
        data: { total }
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al calcular total',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }
}

export default new OrdenTrabajoController();
