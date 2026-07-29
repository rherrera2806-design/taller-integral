import React from 'react';
import { KanbanCard } from './KanbanCard';
import { OrdenTrabajo, EstadoOT } from '../../types';
import { theme } from '../../utils/theme';

interface KanbanColumnProps {
  estado: EstadoOT;
  titulo: string;
  descripcion: string;
  icon: React.ReactNode;
  ordenes: OrdenTrabajo[];
  color: string;
  bgColor: string;
  textColor: string;
  onMoverOT: (otId: number, nuevoEstado: string) => void;
  siguienteEstado?: string;
}

export function KanbanColumn({ 
  estado, 
  titulo,
  descripcion,
  icon,
  ordenes, 
  color,
  bgColor,
  textColor,
  onMoverOT,
  siguienteEstado
}: KanbanColumnProps) {
  return (
    <div style={{
      backgroundColor: theme.colors.gray[50],
      borderRadius: theme.borderRadius['2xl'],
      padding: theme.spacing[4],
      display: 'flex',
      flexDirection: 'column',
      minHeight: '400px',
      border: `1px solid ${theme.colors.gray[100]}`
    }}>
      {/* Column Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing[4],
        marginBottom: theme.spacing[3],
        borderTop: `4px solid ${color}`,
        boxShadow: theme.shadows.sm
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: bgColor,
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color
            }}>
              {icon}
            </div>
            <div>
              <h3 style={{ 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[900], 
                fontSize: theme.typography.fontSize.md,
                margin: 0
              }}>
                {titulo}
              </h3>
              <p style={{ 
                fontSize: '11px', 
                color: theme.colors.gray[400],
                margin: '2px 0 0 0'
              }}>
                {descripcion}
              </p>
            </div>
          </div>
          
          <div style={{
            minWidth: '28px',
            height: '28px',
            borderRadius: theme.borderRadius.full,
            backgroundColor: bgColor,
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: theme.typography.fontSize.sm,
            padding: `0 ${theme.spacing[2]}`
          }}>
            {ordenes.length}
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[2],
        paddingRight: theme.spacing[1]
      }}
      className="scrollbar-thin"
      >
        {ordenes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: `${theme.spacing[8]} ${theme.spacing[4]}`,
            color: theme.colors.gray[400]
          }}>
            <p style={{ fontSize: theme.typography.fontSize.sm, margin: 0 }}>Sin órdenes</p>
          </div>
        ) : (
          ordenes.map((orden) => (
            <KanbanCard
              key={orden.ot_id}
              orden={orden}
              onMover={() => siguienteEstado && onMoverOT(orden.ot_id, siguienteEstado)}
              puedeMover={!!siguienteEstado}
              accentColor={color}
            />
          ))
        )}
      </div>
    </div>
  );
}
