import { Router } from 'express';
import ordenTrabajoService from '../services/ordenTrabajoService';

const router = Router();

router.get('/:patente/historial', async (req, res) => {
  try {
    const { patente } = req.params;
    
    const patenteRegex = /^[A-Z]{2}-[0-9]{4}$|^[A-Z]{4}-[0-9]{2}$/i;
    if (!patenteRegex.test(patente)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de patente no válido'
      });
    }

    const historial = await ordenTrabajoService.getHistorialVehiculo(patente.toUpperCase());
    res.json({
      success: true,
      message: `Historial del vehículo ${patente} obtenido correctamente`,
      data: historial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al obtener historial del vehículo',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
