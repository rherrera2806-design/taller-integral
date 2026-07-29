import { Router } from 'express';
import ordenTrabajoController from '../controllers/ordenTrabajoController';

const router = Router();

router.get('/', ordenTrabajoController.getAll);
router.get('/:id', ordenTrabajoController.getById);
router.post('/', ordenTrabajoController.create);
router.patch('/:id/estado', ordenTrabajoController.cambiarEstado);
router.patch('/:id/cerrar', ordenTrabajoController.cerrarOT);
router.get('/:id/calcular-total', ordenTrabajoController.calcularTotal);

export default router;
