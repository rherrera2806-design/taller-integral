import React, { useState } from 'react';
import { theme, componentStyles } from '../../utils/theme';
import { Search, Car, Check, ChevronDown, X } from 'lucide-react';

interface Vehiculo {
  vehiculo_id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  cliente_id: number;
}

interface SelectorVehiculosProps {
  vehiculoSeleccionado: Vehiculo | null;
  clienteId?: number;
  onSelect: (vehiculo: Vehiculo) => void;
  onLimpiar: () => void;
}

// Datos de ejemplo - en producción vendrían de la API
const vehiculosEjemplo: Vehiculo[] = [
  { vehiculo_id: 1, patente: 'ABC-1234', marca: 'Toyota', modelo: 'Corolla', anio: 2020, color: 'Blanco', cliente_id: 1 },
  { vehiculo_id: 2, patente: 'XYZ-5678', marca: 'Honda', modelo: 'Civic', anio: 2019, color: 'Negro', cliente_id: 2 },
  { vehiculo_id: 3, patente: 'DEF-9012', marca: 'Nissan', modelo: 'Versa', anio: 2021, color: 'Plata', cliente_id: 3 },
  { vehiculo_id: 4, patente: 'GHI-3456', marca: 'Chevrolet', modelo: 'Spark', anio: 2022, color: 'Rojo', cliente_id: 1 },
  { vehiculo_id: 5, patente: 'JKL-7890', marca: 'Suzuki', modelo: 'Swift', anio: 2020, color: 'Azul', cliente_id: 4 }
];

export function SelectorVehiculos({ vehiculoSeleccionado, clienteId, onSelect, onLimpiar }: SelectorVehiculosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar por cliente si se proporciona clienteId
  const vehiculosFiltrados = vehiculosEjemplo.filter(v => {
    const matchesCliente = clienteId ? v.cliente_id === clienteId : true;
    const matchesBusqueda = busqueda === '' || 
      v.patente.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busqueda.toLowerCase());
    return matchesCliente && matchesBusqueda;
  });

  const handleSelect = (vehiculo: Vehiculo) => {
    onSelect(vehiculo);
    setBusqueda('');
    setIsOpen(false);
  };

  const formatPatente = (patente: string) => {
    return patente.replace(/-/, ' • ');
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={componentStyles.label}>
        Vehículo *
      </label>
      
      {/* Selected Vehicle or Search Input */}
      {vehiculoSeleccionado ? (
        <div style={{
          ...componentStyles.input.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.success.bg,
          borderColor: theme.colors.success.main
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: theme.colors.success.main,
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Car size={14} color="white" />
            </div>
            <div>
              <div style={{ 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.gray[800],
                fontSize: theme.typography.fontSize.md,
                fontFamily: theme.typography.fontFamily.mono,
                letterSpacing: '0.5px'
              }}>
                {formatPatente(vehiculoSeleccionado.patente)}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[500]
              }}>
                {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} • {vehiculoSeleccionado.anio}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLimpiar}
            style={{
              padding: '4px',
              borderRadius: theme.borderRadius.sm,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: theme.colors.gray[400]
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Search 
            size={16} 
            color={theme.colors.gray[400]}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar por patente, marca o modelo..."
            style={{
              ...componentStyles.input.base,
              paddingLeft: '36px',
              paddingRight: '36px',
              fontFamily: theme.typography.fontFamily.mono
            }}
          />
          <ChevronDown 
            size={16} 
            color={theme.colors.gray[400]}
            style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !vehiculoSeleccionado && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: `1px solid ${theme.colors.gray[200]}`,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.lg,
          zIndex: 50,
          marginTop: '4px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {vehiculosFiltrados.length === 0 ? (
            <div style={{
              padding: theme.spacing[4],
              textAlign: 'center',
              color: theme.colors.gray[400],
              fontSize: theme.typography.fontSize.sm
            }}>
              No se encontraron vehículos
              {clienteId && (
                <div style={{ fontSize: '11px', marginTop: '4px' }}>
                  para este cliente
                </div>
              )}
            </div>
          ) : (
            vehiculosFiltrados.map(vehiculo => (
              <div
                key={vehiculo.vehiculo_id}
                onClick={() => handleSelect(vehiculo)}
                style={{
                  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[3],
                  borderBottom: `1px solid ${theme.colors.gray[100]}`,
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: theme.colors.gray[100],
                  borderRadius: theme.borderRadius.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Car size={18} color={theme.colors.gray[600]} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: theme.typography.fontWeight.bold,
                    color: theme.colors.gray[800],
                    fontSize: theme.typography.fontSize.lg,
                    fontFamily: theme.typography.fontFamily.mono,
                    letterSpacing: '0.5px'
                  }}>
                    {formatPatente(vehiculo.patente)}
                  </div>
                  <div style={{ 
                    fontSize: theme.typography.fontSize.sm, 
                    color: theme.colors.gray[500],
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2]
                  }}>
                    <span>{vehiculo.marca} {vehiculo.modelo}</span>
                    <span style={{ color: theme.colors.gray[300] }}>•</span>
                    <span>{vehiculo.anio}</span>
                    {vehiculo.color && (
                      <>
                        <span style={{ color: theme.colors.gray[300] }}>•</span>
                        <span>{vehiculo.color}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
