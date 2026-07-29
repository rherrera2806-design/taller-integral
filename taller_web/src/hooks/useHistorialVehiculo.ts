import { useState } from 'react';
import { HistorialVehiculo, Vehiculo } from '../types';
import { vehiculoService } from '../services/api';
import api from '../services/api';

export function useHistorialVehiculo() {
  const [historial, setHistorial] = useState<HistorialVehiculo[]>([]);
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patenteBusqueda, setPatenteBusqueda] = useState('');

  const buscarPorPatente = async (patente: string) => {
    if (!patente.trim()) {
      setError('Ingrese una patente para buscar');
      return;
    }

    const patenteLimpia = patente.toUpperCase().replace(/\s/g, '');
    const patenteRegex = /^[A-Z]{2}-[0-9]{4}$|^[A-Z]{4}-[0-9]{2}$/;
    
    if (!patenteRegex.test(patenteLimpia)) {
      setError('Formato de patente no válido. Use: ABC-1234 o ABCD-12');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPatenteBusqueda(patenteLimpia);

      const data = await vehiculoService.getHistorial(patenteLimpia);
      setHistorial(data);

      if (data.length > 0 && data[0].vehiculo) {
        setVehiculo(data[0].vehiculo as Vehiculo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vehículo no encontrado');
      setHistorial([]);
      setVehiculo(null);
    } finally {
      setLoading(false);
    }
  };

  const limpiarBusqueda = () => {
    setHistorial([]);
    setVehiculo(null);
    setError(null);
    setPatenteBusqueda('');
  };

  return {
    historial,
    vehiculo,
    loading,
    error,
    patenteBusqueda,
    buscarPorPatente,
    limpiarBusqueda
  };
}
