import { useState, useEffect, useCallback } from 'react';
import { OrdenTrabajo, EstadoOT, ESTADOS_OT } from '../types';
import { ordenTrabajoService } from '../services/api';

export function useOrdenesTrabajo() {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrdenes = useCallback(async (estado?: string) => {
    try {
      setLoading(true);
      const data = await ordenTrabajoService.getAll(estado);
      setOrdenes(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdenes();
  }, [fetchOrdenes]);

  const ordenesPorEstado = ESTADOS_OT.reduce((acc, estado) => {
    acc[estado] = ordenes.filter(o => o.estado === estado);
    return acc;
  }, {} as Record<EstadoOT, OrdenTrabajo[]>);

  const cambiarEstado = async (otId: number, nuevoEstado: string, usuario?: { id: number; nombre: string }) => {
    try {
      await ordenTrabajoService.cambiarEstado(otId, {
        estado_nuevo: nuevoEstado,
        usuario_id: usuario?.id,
        usuario_nombre: usuario?.nombre,
        comentario: `Estado cambiado a ${nuevoEstado}`
      });
      await fetchOrdenes();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
      return false;
    }
  };

  const refetch = () => fetchOrdenes();

  return {
    ordenes,
    ordenesPorEstado,
    loading,
    error,
    cambiarEstado,
    refetch
  };
}
