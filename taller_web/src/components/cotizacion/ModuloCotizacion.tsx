import React, { useState } from 'react';
import { useCotizaciones } from '../../hooks/useCotizaciones';
import { FormularioCotizacion } from './FormularioCotizacion';
import { ListaCotizaciones } from './ListaCotizaciones';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export function ModuloCotizacion() {
  const [vistaActual, setVistaActual] = useState<'lista' | 'nueva'>('lista');
  const { cotizaciones, loading, error, refetch } = useCotizaciones();

  const handleCotizacionCreada = () => {
    setVistaActual('lista');
    refetch();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            Cotizaciones
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
            Gestiona presupuestos y conviértelos en OT
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={refetch}
            style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={18} color="#64748b" />
          </button>
          <button
            onClick={() => setVistaActual(vistaActual === 'lista' ? 'nueva' : 'lista')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
          >
            {vistaActual === 'lista' ? (
              <>
                <Plus size={18} />
                Nueva Cotización
              </>
            ) : (
              <>
                <FileText size={18} />
                Ver Lista
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Content */}
      {vistaActual === 'lista' ? (
        <ListaCotizaciones 
          cotizaciones={cotizaciones} 
          loading={loading}
          onRefetch={refetch}
        />
      ) : (
        <FormularioCotizacion 
          onCreada={handleCotizacionCreada}
          onCancelar={() => setVistaActual('lista')}
        />
      )}
    </div>
  );
}
