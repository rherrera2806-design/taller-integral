import { Router } from 'express';
import cotizacionController from '../controllers/cotizacionController';

const router = Router();

router.get('/', cotizacionController.getAll);
router.get('/:id', cotizacionController.getById);
router.post('/', cotizacionController.create);
router.patch('/:id/estado', cotizacionController.updateEstado);
router.patch('/:id/convertir-ot', cotizacionController.convertirEnOT);
router.get('/:id/validar-stock', cotizacionController.validarStock);
router.get('/:id/calcular-total', cotizacionController.calcularTotal);

export default router;
