import { Request, Response } from 'express';
import servicioService from '../services/servicioService';
import { Servicio, ApiResponse } from '../types';

export class ServicioController {
  async getAll(req: Request, res: Response) {
    try {
      const { categoria } = req.query;
      const servicios = await servicioService.findAll(categoria as string);
      const response: ApiResponse<Servicio[]> = {
        success: true,
        message: 'Servicios obtenidos correctamente',
        data: servicios
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener servicios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const servicio = await servicioService.findById(parseInt(id));
      
      if (!servicio) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Servicio no encontrado'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<Servicio> = {
        success: true,
        message: 'Servicio obtenido correctamente',
        data: servicio
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al obtener servicio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const servicioData: Servicio = req.body;

      if (!servicioData.nombre || !servicioData.precio_base || !servicioData.categoria) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Faltan campos obligatorios: nombre, precio_base, categoria'
        };
        return res.status(400).json(response);
      }

      const nuevoServicio = await servicioService.create(servicioData);
      const response: ApiResponse<Servicio> = {
        success: true,
        message: 'Servicio creado correctamente',
        data: nuevoServicio
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al crear servicio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const servicioData = req.body;

      const servicio = await servicioService.findById(parseInt(id));
      if (!servicio) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Servicio no encontrado'
        };
        return res.status(404).json(response);
      }

      const servicioActualizado = await servicioService.update(parseInt(id), servicioData);
      const response: ApiResponse<Servicio> = {
        success: true,
        message: 'Servicio actualizado correctamente',
        data: servicioActualizado!
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al actualizar servicio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const eliminado = await servicioService.delete(parseInt(id));
      
      if (!eliminado) {
        const response: ApiResponse<null> = {
          success: false,
          message: 'Servicio no encontrado'
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Servicio eliminado correctamente'
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Error al eliminar servicio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  }
}

export default new ServicioController();
