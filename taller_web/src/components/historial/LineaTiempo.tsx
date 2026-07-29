import React from 'react';
import { HistorialVehiculo } from '../../types';
import { theme, getEstadoColor, getCategoriaColor } from '../../utils/theme';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Wrench, Package } from 'lucide-react';

interface LineaTiempoProps {
  historial: HistorialVehiculo[];
}

export function LineaTiempo({ historial }: LineaTiempoProps) {
  return (
    <div style={{ position: 'relative' }}>
      {historial.map((visita, index) => {
        const estadoColor = getEstadoColor(visita.estado);
        const fechaIngreso = parseISO(visita.fecha_ingreso);
        const isLast = index === historial.length - 1;
        
        return (
          <div 
            key={visita.ot_id} 
            style={{
              position: 'relative',
              paddingLeft: theme.spacing[8],
              paddingBottom: isLast ? '0' : theme.spacing[6],
              borderLeft: isLast ? '2px solid transparent' : `2px solid ${theme.colors.gray[200]}`
            }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute',
              left: '-9px',
              top: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: estadoColor.dot,
              border: '3px solid white',
              boxShadow: `0 0 0 2px ${theme.colors.gray[200]}`
            }} />
            
            {/* Content */}
            <div style={{
              backgroundColor: estadoColor.bg,
              borderRadius: theme.borderRadius.xl,
              padding: theme.spacing[4]
            }}>
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: theme.spacing[3]
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                    <span style={{ 
                      fontFamily: theme.typography.fontFamily.mono, 
                      fontWeight: theme.typography.fontWeight.bold, 
                      fontSize: theme.typography.fontSize.md,
                      color: theme.colors.gray[900]
                    }}>
                      {visita.numero_ot}
                    </span>
                    <span style={{
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      borderRadius: theme.borderRadius.full,
                      fontSize: '11px',
                      fontWeight: theme.typography.fontWeight.semibold,
                      backgroundColor: estadoColor.dot + '25',
                      color: estadoColor.text
                    }}>
                      {visita.estado}
                    </span>
                  </div>
                  <p style={{ 
                    fontSize: theme.typography.fontSize.sm, 
                    color: theme.colors.gray[500],
                    marginTop: '4px',
                    margin: '4px 0 0 0'
                  }}>
                    {format(fechaIngreso, "dd 'de' MMMM, HH:mm", { locale: es })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    fontWeight: theme.typography.fontWeight.bold, 
                    fontSize: theme.typography.fontSize.lg,
                    color: theme.colors.gray[900],
                    margin: 0
                  }}>
                    ${visita.total?.toLocaleString('es-CL') || '0'}
                  </p>
                </div>
              </div>

              {/* Servicios */}
              {visita.servicios_aplicados && visita.servicios_aplicados.length > 0 && (
                <div style={{ marginBottom: theme.spacing[3] }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: theme.spacing[1],
                    marginBottom: theme.spacing[2] 
                  }}>
                    <Wrench size={12} color={theme.colors.gray[400]} />
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: theme.typography.fontWeight.semibold, 
                      color: theme.colors.gray[500],
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Servicios
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[1] }}>
                    {visita.servicios_aplicados.map((servicio, idx) => {
                      const catColor = getCategoriaColor(servicio.servicio_nombre || '');
                      return (
                        <span 
                          key={idx}
                          style={{
                            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                            borderRadius: theme.borderRadius.sm,
                            fontSize: '11px',
                            fontWeight: theme.typography.fontWeight.medium,
                            backgroundColor: 'white',
                            border: `1px solid ${catColor.border}`,
                            color: catColor.text
                          }}
                        >
                          {servicio.servicio_nombre}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Productos */}
              {visita.productos_aplicados && visita.productos_aplicados.length > 0 && (
                <div style={{ marginBottom: theme.spacing[3] }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: theme.spacing[1],
                    marginBottom: theme.spacing[2] 
                  }}>
                    <Package size={12} color={theme.colors.gray[400]} />
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: theme.typography.fontWeight.semibold, 
                      color: theme.colors.gray[500],
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Productos
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[1] }}>
                    {visita.productos_aplicados.map((producto, idx) => (
                      <span 
                        key={idx}
                        style={{
                          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                          borderRadius: theme.borderRadius.sm,
                          fontSize: '11px',
                          fontWeight: theme.typography.fontWeight.medium,
                          backgroundColor: 'white',
                          border: `1px solid ${theme.colors.gray[200]}`,
                          color: theme.colors.gray[600]
                        }}
                      >
                        {producto.producto_nombre} x{producto.cantidad}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Duración */}
              {visita.fecha_entrega_real && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: theme.spacing[1], 
                  fontSize: '11px', 
                  color: theme.colors.gray[400],
                  marginTop: theme.spacing[2]
                }}>
                  <Clock size={12} />
                  <span>
                    Duración: {Math.round(
                      (new Date(visita.fecha_entrega_real).getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60)
                    )}h
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
