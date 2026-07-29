import React from 'react';
import { OrdenTrabajo } from '../../types';
import { theme, getCategoriaColor } from '../../utils/theme';
import { Clock, ChevronRight, Car, Wrench } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface KanbanCardProps {
  orden: OrdenTrabajo;
  onMover: () => void;
  puedeMover: boolean;
  accentColor: string;
}

export function KanbanCard({ orden, onMover, puedeMover, accentColor }: KanbanCardProps) {
  const tiempoTranscurrido = formatDistanceToNow(
    parseISO(orden.fecha_ingreso),
    { addSuffix: true, locale: es }
  );

  const tipoServicio = orden.detalles?.find(d => d.tipo_item === 'SERVICIO');
  const categoriaServicio = tipoServicio?.servicio_nombre || 'Servicio general';
  const catColor = getCategoriaColor(categoriaServicio);

  const formatPatente = (patente: string) => {
    return patente.replace(/-/, ' • ');
  };

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.gray[200]}`,
        padding: theme.spacing[4],
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: theme.shadows.sm
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.lg;
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.sm;
        e.currentTarget.style.borderColor = theme.colors.gray[200];
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        marginBottom: theme.spacing[3]
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: theme.colors.gray[100],
            borderRadius: theme.borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car size={18} color={theme.colors.gray[600]} />
          </div>
          <div>
            <p style={{ 
              fontFamily: theme.typography.fontFamily.mono, 
              fontWeight: theme.typography.fontWeight.bold, 
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.gray[900],
              letterSpacing: '0.5px',
              margin: 0
            }}>
              {formatPatente(orden.patente)}
            </p>
            <p style={{ 
              fontSize: '11px', 
              color: theme.colors.gray[400],
              fontFamily: theme.typography.fontFamily.mono,
              margin: '2px 0 0 0'
            }}>
              {orden.numero_ot}
            </p>
          </div>
        </div>
        
        {puedeMover && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMover();
            }}
            style={{
              padding: '6px',
              borderRadius: theme.borderRadius.md,
              border: 'none',
              backgroundColor: accentColor + '15',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="Avanzar estado"
          >
            <ChevronRight size={16} color={accentColor} />
          </button>
        )}
      </div>

      {/* Vehicle Info */}
      <div style={{ marginBottom: theme.spacing[2] }}>
        <p style={{ 
          fontSize: theme.typography.fontSize.md, 
          color: theme.colors.gray[700],
          fontWeight: theme.typography.fontWeight.medium,
          margin: 0
        }}>
          {orden.vehiculo?.marca} {orden.vehiculo?.modelo}
        </p>
        <p style={{ 
          fontSize: '11px', 
          color: theme.colors.gray[400],
          margin: '2px 0 0 0'
        }}>
          {orden.vehiculo?.anio} • {orden.vehiculo?.color || 'N/A'}
        </p>
      </div>

      {/* Service Badge */}
      <div style={{ marginBottom: theme.spacing[2] }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
          borderRadius: theme.borderRadius.sm,
          fontSize: '11px',
          fontWeight: theme.typography.fontWeight.semibold,
          backgroundColor: catColor.bg,
          color: catColor.text,
          border: `1px solid ${catColor.border}`
        }}>
          <Wrench size={12} />
          {categoriaServicio}
        </span>
      </div>

      {/* Time Elapsed */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: theme.spacing[1], 
        fontSize: '12px', 
        color: theme.colors.gray[400],
        marginBottom: theme.spacing[2]
      }}>
        <Clock size={14} />
        <span>{tiempoTranscurrido}</span>
      </div>

      {/* Observations Preview */}
      {orden.observaciones_recepcion && (
        <div style={{
          padding: theme.spacing[2],
          backgroundColor: theme.colors.gray[50],
          borderRadius: theme.borderRadius.md,
          fontSize: '11px',
          color: theme.colors.gray[500],
          marginBottom: theme.spacing[2],
          lineHeight: '1.4'
        }}>
          {orden.observaciones_recepcion.length > 60 
            ? `${orden.observaciones_recepcion.substring(0, 60)}...`
            : orden.observaciones_recepcion
          }
        </div>
      )}

      {/* Total */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: theme.spacing[2],
        borderTop: `1px solid ${theme.colors.gray[100]}`
      }}>
        <span style={{ fontSize: '11px', color: theme.colors.gray[400] }}>Total</span>
        <span style={{ 
          fontWeight: theme.typography.fontWeight.bold, 
          fontSize: theme.typography.fontSize.md,
          color: theme.colors.gray[900]
        }}>
          ${orden.total?.toLocaleString('es-CL') || '0'}
        </span>
      </div>
    </div>
  );
}
