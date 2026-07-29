import { useState, useEffect, useCallback } from 'react';
import { Cotizacion } from '../types';
import { cotizacionService } from '../services/api';

export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCotizaciones = useCallback(async (estado?: string) => {
    try {
      setLoading(true);
      const data = await cotizacionService.getAll(estado);
      setCotizaciones(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cotizaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCotizaciones();
  }, [fetchCotizaciones]);

  const crearCotizacion = async (data: any): Promise<Cotizacion | null> => {
    try {
      const nueva = await cotizacionService.create(data);
      await fetchCotizaciones();
      return nueva;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cotización');
      return null;
    }
  };

  const aprobar = async (id: number): Promise<boolean> => {
    try {
      await cotizacionService.updateEstado(id, 'APROBADA');
      await fetchCotizaciones();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar cotización');
      return false;
    }
  };

  const rechazar = async (id: number, motivo: string): Promise<boolean> => {
    try {
      await cotizacionService.updateEstado(id, 'RECHAZADA', motivo);
      await fetchCotizaciones();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar cotización');
      return false;
    }
  };

  const convertirEnOT = async (id: number, data?: any): Promise<boolean> => {
    try {
      await cotizacionService.convertirEnOT(id, data);
      await fetchCotizaciones();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al convertir cotización');
      return false;
    }
  };

  const refetch = () => fetchCotizaciones();

  return {
    cotizaciones,
    loading,
    error,
    crearCotizacion,
    aprobar,
    rechazar,
    convertirEnOT,
    refetch
  };
}
