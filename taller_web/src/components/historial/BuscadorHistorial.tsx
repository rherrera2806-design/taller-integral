import React, { useState } from 'react';
import { useHistorialVehiculo } from '../../hooks/useHistorialVehiculo';
import { FichaVehiculo } from './FichaVehiculo';
import { LineaTiempo } from './LineaTiempo';
import { theme, componentStyles } from '../../utils/theme';
import { Search, X, Loader2, AlertCircle, Car } from 'lucide-react';

export function BuscadorHistorial() {
  const [patenteInput, setPatenteInput] = useState('');
  const { 
    historial, 
    vehiculo, 
    loading, 
    error, 
    buscarPorPatente,
    limpiarBusqueda 
  } = useHistorialVehiculo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buscarPorPatente(patenteInput);
  };

  const handleFormatPatente = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 2) {
      setPatenteInput(cleaned);
    } else if (cleaned.length <= 4) {
      setPatenteInput(`${cleaned.slice(0, 2)}-${cleaned.slice(2)}`);
    } else {
      setPatenteInput(`${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Search Header */}
      <div style={{ marginBottom: theme.spacing[8] }}>
        <h2 style={{ 
          fontSize: theme.typography.fontSize['3xl'], 
          fontWeight: theme.typography.fontWeight.extrabold, 
          color: theme.colors.gray[900],
          margin: '0 0 4px 0',
          letterSpacing: '-0.025em'
        }}>
          Historial de Vehículos
        </h2>
        <p style={{ 
          color: theme.colors.gray[500], 
          fontSize: theme.typography.fontSize.md, 
          margin: 0 
        }}>
          Busca por patente para ver el historial completo de visitas y servicios
        </p>
      </div>

      {/* Search Form */}
      <div style={{
        ...componentStyles.card.base,
        marginBottom: theme.spacing[6]
      }}>
        <div style={componentStyles.card.header}>
          <div style={componentStyles.iconContainer}>
            <Search size={16} color={theme.colors.primary[600]} />
          </div>
          <span style={{ 
            fontSize: theme.typography.fontSize.md, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[800] 
          }}>
            Buscar Vehículo
          </span>
        </div>
        
        <div style={componentStyles.card.body}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: theme.spacing[3], alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={componentStyles.label}>Patente del Vehículo</label>
              <div style={{ position: 'relative' }}>
                <Search 
                  size={18} 
                  color={theme.colors.gray[400]}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  value={patenteInput}
                  onChange={(e) => handleFormatPatente(e.target.value)}
                  placeholder="Ej: ABC-1234"
                  style={{
                    ...componentStyles.input.base,
                    paddingLeft: '44px',
                    paddingRight: patenteInput ? '44px' : '14px',
                    fontFamily: theme.typography.fontFamily.mono,
                    fontWeight: theme.typography.fontWeight.semibold,
                    fontSize: theme.typography.fontSize.lg,
                    letterSpacing: '1px'
                  }}
                  maxLength={8}
                />
                {patenteInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setPatenteInput('');
                      limpiarBusqueda();
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '4px',
                      borderRadius: theme.borderRadius.sm,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: theme.colors.gray[400]
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || !patenteInput.trim()}
              style={{
                ...componentStyles.button.primary,
                padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                opacity: loading || !patenteInput.trim() ? 0.5 : 1,
                cursor: loading || !patenteInput.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Buscar
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginBottom: theme.spacing[6],
          padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
          backgroundColor: theme.colors.danger.bg,
          border: `1px solid ${theme.colors.gray[200]}`,
          borderRadius: theme.borderRadius.xl,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[3]
        }}>
          <AlertCircle size={20} color={theme.colors.danger.main} />
          <span style={{ color: theme.colors.danger.text, fontSize: theme.typography.fontSize.md }}>
            {error}
          </span>
        </div>
      )}

      {/* Results */}
      {vehiculo && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '380px 1fr', 
          gap: theme.spacing[6] 
        }}>
          <FichaVehiculo vehiculo={vehiculo} totalVisitas={historial.length} />
          
          <div style={componentStyles.card.base}>
            <div style={componentStyles.card.header}>
              <div style={componentStyles.iconContainer}>
                <Car size={16} color={theme.colors.primary[600]} />
              </div>
              <span style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800] 
              }}>
                Línea de Tiempo
              </span>
              <span style={{
                marginLeft: 'auto',
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: theme.colors.gray[100],
                borderRadius: theme.borderRadius.full,
                fontSize: '11px',
                color: theme.colors.gray[500]
              }}>
                {historial.length} visitas
              </span>
            </div>
            
            <div style={componentStyles.card.body}>
              {historial.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: theme.spacing[10], 
                  color: theme.colors.gray[400] 
                }}>
                  <p style={{ margin: 0 }}>No hay visitas registradas</p>
                </div>
              ) : (
                <LineaTiempo historial={historial} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!vehiculo && !loading && !error && (
        <div style={{
          textAlign: 'center',
          padding: `${theme.spacing[16]} ${theme.spacing[10]}`,
          backgroundColor: 'white',
          borderRadius: theme.borderRadius['2xl'],
          border: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: theme.colors.gray[100],
            borderRadius: theme.borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${theme.spacing[5]}`
          }}>
            <Car size={40} color={theme.colors.gray[400]} />
          </div>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.xl, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[600],
            margin: '0 0 8px 0'
          }}>
            Ingresa una patente para comenzar
          </h3>
          <p style={{ 
            color: theme.colors.gray[400], 
            fontSize: theme.typography.fontSize.md,
            margin: 0,
            maxWidth: '400px',
            marginInline: 'auto'
          }}>
            Podrás ver el historial completo del vehículo, incluyendo todas las órdenes de trabajo
          </p>
        </div>
      )}
    </div>
  );
}
