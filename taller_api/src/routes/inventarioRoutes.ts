import { Router, Request, Response } from 'express';
import productoController from '../controllers/productoController';
import productoService from '../services/productoService';

const router = Router();

router.get('/alertas', productoController.getAlertasStockBajo);

router.post('/descontar-stock', async (req: Request, res: Response) => {
  try {
    const { producto_id, cantidad } = req.body;

    if (!producto_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'producto_id y cantidad (mayor a 0) son requeridos'
      });
    }

    const descontado = await productoService.descontarStock(producto_id, cantidad);
    
    res.json({
      success: true,
      message: `Stock descontado correctamente: ${cantidad} unidades del producto ${producto_id}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al descontar stock',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

router.post('/incrementar-stock', async (req: Request, res: Response) => {
  try {
    const { producto_id, cantidad } = req.body;

    if (!producto_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: 'producto_id y cantidad (mayor a 0) son requeridos'
      });
    }

    const incrementado = await productoService.incrementarStock(producto_id, cantidad);
    
    res.json({
      success: true,
      message: `Stock incrementado correctamente: ${cantidad} unidades al producto ${producto_id}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al incrementar stock',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
