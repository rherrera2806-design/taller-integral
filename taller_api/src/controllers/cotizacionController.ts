import { Request, Response } from 'express';
import cotizacionService from '../services/cotizacionService';
import { Cotizacion, ApiResponse } from '../types';

export class CotizacionController {
  async getAll(req: Request, res: Response) {
    try {
      const { estado } = req.query;
      const cotizaciones = await cotizacionService.findAll(estado as string);
      const response: ApiResponse<Cotizacion[]> = {
        success: true,
        message: 'Cotizaciones obtenidas correctamente',
        data: cotizaciones
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener cotizaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cotizacion = await cotizacionService.findById(parseInt(id));
      
      if (!cotizacion) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Cotización no encontrada'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<any> = {
        success: true,
        message: 'Cotización obtenida correctamente',
        data: cotizacion
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data.patente || !data.cliente_id || !data.vehiculo_id) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Faltan campos obligatorios: patente, cliente_id, vehiculo_id'
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

      if (!data.items || data.items.length === 0) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'La cotización debe tener al menos un item'
        };
        return res.status(400).json(response);
      }

      for (const item of data.items) {
        if (!['PRODUCTO', 'SERVICIO'].includes(item.tipo_item)) {
          const response: ApiResponse<null> = {
            success: false,
            message: 'tipo_item debe ser PRODUCTO o SERVICIO'
          };
          return res.status(400).json(response);
        }
      }

      const nuevaCotizacion = await cotizacionService.create(data);
      
      const response: ApiResponse<any> = {
        success: true,
        message: 'Cotización creada correctamente',
        data: nuevaCotizacion
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al crear cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async updateEstado(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado, motivo_rechazo } = req.body;

      if (!estado) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'El campo estado es requerido'
        };
        return res.status(400).json(response);
      }

      const estadosPermitidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA'];
      if (!estadosPermitidos.includes(estado)) {
        const response: ApiResponse<null> = {
          success: false,
          message: `Estado no válido. Estados permitidos: ${estadosPermitidos.join(', ')}`
        };
        return res.status(400).json(response);
      }

      if (estado === 'RECHAZADA' && !motivo_rechazo) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'El motivo de rechazo es requerido al rechazar una cotización'
        };
        return res.status(400).json(response);
      }

      const cotizacionActualizada = await cotizacionService.updateEstado(
        parseInt(id), 
        estado, 
        motivo_rechazo
      );

      const response: ApiResponse<any> = {
        success: true,
        message: `Estado de cotización actualizado a ${estado}`,
        data: cotizacionActualizada
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al actualizar estado de cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async convertirEnOT(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fecha_estimada_entrega, observaciones_recepcion, usuario_recepcion_id } = req.body;

      const resultado = await cotizacionService.convertirEnOT(parseInt(id), {
        fecha_estimada_entrega,
        observaciones_recepcion,
        usuario_recepcion_id
      });

      const response: ApiResponse<any> = {
        success: true,
        message: resultado.mensaje,
        data: {
          cotizacion: resultado.cotizacion,
          orden_trabajo: resultado.orden_trabajo
        }
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al convertir cotización en OT',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(400).json(response);
    }
  }

  async validarStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validacion = await cotizacionService.validarStock(parseInt(id));
      
      const response: ApiResponse<any> = {
        success: true,
        message: validacion.valido ? 'Stock suficiente para todos los productos' : 'Hay productos con stock insuficiente',
        data: validacion
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al validar stock',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async calcularTotal(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const total = await cotizacionService.calcularTotal(parseInt(id));
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

export default new CotizacionController();
