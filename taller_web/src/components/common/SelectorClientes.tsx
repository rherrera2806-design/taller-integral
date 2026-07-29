import React, { useState, useEffect } from 'react';
import { theme, componentStyles } from '../../utils/theme';
import { Search, User, Check, ChevronDown, X } from 'lucide-react';

interface Cliente {
  cliente_id: number;
  rut_dni: string;
  nombre: string;
  telefono?: string;
  email?: string;
}

interface SelectorClientesProps {
  clienteSeleccionado: Cliente | null;
  onSelect: (cliente: Cliente) => void;
  onLimpiar: () => void;
}

// Datos de ejemplo - en producción vendrían de la API
const clientesEjemplo: Cliente[] = [
  { cliente_id: 1, rut_dni: '12345678-9', nombre: 'Juan Pérez', telefono: '+56912345678', email: 'juan@email.com' },
  { cliente_id: 2, rut_dni: '87654321-0', nombre: 'María González', telefono: '+56987654321', email: 'maria@email.com' },
  { cliente_id: 3, rut_dni: '11223344-5', nombre: 'Carlos Rodríguez', telefono: '+56911223344', email: 'carlos@email.com' },
  { cliente_id: 4, rut_dni: '55667788-9', nombre: 'Ana Martínez', telefono: '+56955667788' },
  { cliente_id: 5, rut_dni: '99887766-5', nombre: 'Pedro Soto', telefono: '+56999887766' }
];

export function SelectorClientes({ clienteSeleccionado, onSelect, onLimpiar }: SelectorClientesProps) {
  const [busqueda, setBusqueda] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>(clientesEjemplo);

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.rut_dni.includes(busqueda)
  );

  const handleSelect = (cliente: Cliente) => {
    onSelect(cliente);
    setBusqueda('');
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={componentStyles.label}>
        Cliente *
      </label>
      
      {/* Selected Client or Search Input */}
      {clienteSeleccionado ? (
        <div style={{
          ...componentStyles.input.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.primary[50],
          borderColor: theme.colors.primary[300]
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: theme.colors.primary[100],
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={14} color={theme.colors.primary[600]} />
            </div>
            <div>
              <div style={{ 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.gray[800],
                fontSize: theme.typography.fontSize.md
              }}>
                {clienteSeleccionado.nombre}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[400],
                fontFamily: theme.typography.fontFamily.mono
              }}>
                {clienteSeleccionado.rut_dni}
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
            placeholder="Buscar por nombre o RUT..."
            style={{
              ...componentStyles.input.base,
              paddingLeft: '36px',
              paddingRight: '36px'
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
      {isOpen && !clienteSeleccionado && (
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
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          {clientesFiltrados.length === 0 ? (
            <div style={{
              padding: theme.spacing[4],
              textAlign: 'center',
              color: theme.colors.gray[400],
              fontSize: theme.typography.fontSize.sm
            }}>
              No se encontraron clientes
            </div>
          ) : (
            clientesFiltrados.map(cliente => (
              <div
                key={cliente.cliente_id}
                onClick={() => handleSelect(cliente)}
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
                  width: '32px',
                  height: '32px',
                  backgroundColor: theme.colors.gray[100],
                  borderRadius: theme.borderRadius.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} color={theme.colors.gray[600]} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray[800],
                    fontSize: theme.typography.fontSize.md
                  }}>
                    {cliente.nombre}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.gray[400],
                    fontFamily: theme.typography.fontFamily.mono
                  }}>
                    {cliente.rut_dni}
                  </div>
                </div>
                {cliente.telefono && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: theme.colors.gray[400] 
                  }}>
                    {cliente.telefono}
                  </div>
                )}
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
