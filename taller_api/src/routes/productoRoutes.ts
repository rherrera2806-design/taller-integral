import { Router } from 'express';
import productoController from '../controllers/productoController';

const router = Router();

router.get('/', productoController.getAll);
router.get('/alertas-stock', productoController.getAlertasStockBajo);
router.get('/codigo-barras/:codigo', productoController.getByCodigoBarras);
router.get('/:id', productoController.getById);
router.post('/', productoController.create);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.delete);
router.patch('/:id/descontar-stock', productoController.descontarStock);

export default router;
