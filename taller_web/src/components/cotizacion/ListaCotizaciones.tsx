import React, { useState } from 'react';
import { Cotizacion } from '../../types';
import { useCotizaciones } from '../../hooks/useCotizaciones';
import { theme, componentStyles, getEstadoColor } from '../../utils/theme';
import { format, parseISO, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye, Check, X, ArrowRight, Loader2, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ListaCotizacionesProps {
  cotizaciones: Cotizacion[];
  loading: boolean;
  onRefetch: () => void;
}

const estadoConfig: Record<string, { icon: React.ReactNode; label: string }> = {
  PENDIENTE: { icon: <Clock size={14} />, label: 'Pendiente' },
  APROBADA: { icon: <CheckCircle size={14} />, label: 'Aprobada' },
  RECHAZADA: { icon: <XCircle size={14} />, label: 'Rechazada' },
  VENCIDA: { icon: <Clock size={14} />, label: 'Vencida' },
  CONVERTIDA_OT: { icon: <ArrowRight size={14} />, label: 'Convertida' },
};

export function ListaCotizaciones({ cotizaciones, loading, onRefetch }: ListaCotizacionesProps) {
  const { aprobar, rechazar, convertirEnOT } = useCotizaciones();
  const [modalDetalle, setModalDetalle] = useState<Cotizacion | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);

  const handleAprobar = async (id: number) => {
    setProcesando(id);
    await aprobar(id);
    setProcesando(null);
    onRefetch();
  };

  const handleRechazar = async (id: number) => {
    const motivo = prompt('Motivo del rechazo:');
    if (motivo) {
      setProcesando(id);
      await rechazar(id, motivo);
      setProcesando(null);
      onRefetch();
    }
  };

  const handleConvertirOT = async (id: number) => {
    if (confirm('¿Convertir esta cotización en una Orden de Trabajo?')) {
      setProcesando(id);
      await convertirEnOT(id);
      setProcesando(null);
      onRefetch();
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '200px' 
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: `3px solid ${theme.colors.gray[200]}`,
          borderTopColor: theme.colors.primary[500],
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={componentStyles.card.base}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              backgroundColor: theme.colors.gray[50], 
              borderBottom: `1px solid ${theme.colors.gray[200]}` 
            }}>
              {['Número', 'Patente', 'Fecha', 'Validez', 'Total', 'Estado', 'Acciones'].map(header => (
                <th key={header} style={{
                  padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                  textAlign: 'left',
                  fontSize: '11px',
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.gray[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cotizaciones.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ 
                  padding: `${theme.spacing[12]} ${theme.spacing[4]}`, 
                  textAlign: 'center', 
                  color: theme.colors.gray[400] 
                }}>
                  <FileText size={40} color={theme.colors.gray[200]} style={{ margin: `0 auto ${theme.spacing[3]}` }} />
                  <p style={{ margin: 0 }}>No hay cotizaciones</p>
                </td>
              </tr>
            ) : (
              cotizaciones.map((cotizacion) => {
                const estadoColor = getEstadoColor(cotizacion.estado);
                const config = estadoConfig[cotizacion.estado] || estadoConfig.PENDIENTE;
                const vencida = cotizacion.fecha_validez && 
                  isAfter(new Date(), parseISO(cotizacion.fecha_validez));
                
                return (
                  <tr key={cotizacion.cotizacion_id} style={{ 
                    borderBottom: `1px solid ${theme.colors.gray[100]}`,
                    transition: 'background-color 0.15s'
                  }}>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                      <span style={{ 
                        fontFamily: theme.typography.fontFamily.mono, 
                        fontWeight: theme.typography.fontWeight.semibold, 
                        fontSize: theme.typography.fontSize.md,
                        color: theme.colors.gray[800]
                      }}>
                        {cotizacion.numero_cotizacion}
                      </span>
                    </td>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                      <span style={{ 
                        fontFamily: theme.typography.fontFamily.mono, 
                        fontSize: theme.typography.fontSize.md,
                        color: theme.colors.gray[600]
                      }}>
                        {cotizacion.patente}
                      </span>
                    </td>
                    <td style={{ 
                      padding: `${theme.spacing[3]} ${theme.spacing[4]}`, 
                      fontSize: theme.typography.fontSize.sm, 
                      color: theme.colors.gray[500] 
                    }}>
                      {format(parseISO(cotizacion.fecha_creacion), 'dd/MM/yyyy', { locale: es })}
                    </td>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}`, fontSize: theme.typography.fontSize.sm }}>
                      {cotizacion.fecha_validez ? (
                        <span style={{ color: vencida ? theme.colors.danger.main : theme.colors.gray[500] }}>
                          {format(parseISO(cotizacion.fecha_validez), 'dd/MM/yyyy')}
                          {vencida && <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Vencida)</span>}
                        </span>
                      ) : (
                        <span style={{ color: theme.colors.gray[400] }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                      <span style={{ 
                        fontWeight: theme.typography.fontWeight.bold, 
                        color: theme.colors.gray[900],
                        fontSize: theme.typography.fontSize.md
                      }}>
                        ${cotizacion.total?.toLocaleString('es-CL') || '0'}
                      </span>
                    </td>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                        borderRadius: theme.borderRadius.full,
                        fontSize: '11px',
                        fontWeight: theme.typography.fontWeight.semibold,
                        backgroundColor: estadoColor.bg,
                        color: estadoColor.text
                      }}>
                        {config.icon}
                        {config.label}
                      </span>
                    </td>
                    <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: theme.spacing[1], 
                        justifyContent: 'flex-end' 
                      }}>
                        <button
                          onClick={() => setModalDetalle(cotizacion)}
                          style={{
                            padding: '6px',
                            borderRadius: theme.borderRadius.md,
                            border: 'none',
                            backgroundColor: theme.colors.gray[100],
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Eye size={14} color={theme.colors.gray[600]} />
                        </button>
                        
                        {cotizacion.estado === 'PENDIENTE' && (
                          <>
                            <button
                              onClick={() => handleAprobar(cotizacion.cotizacion_id)}
                              disabled={procesando === cotizacion.cotizacion_id}
                              style={{
                                padding: '6px',
                                borderRadius: theme.borderRadius.md,
                                border: 'none',
                                backgroundColor: theme.colors.success.bg,
                                cursor: 'pointer',
                                opacity: procesando === cotizacion.cotizacion_id ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Check size={14} color={theme.colors.success.main} />
                            </button>
                            <button
                              onClick={() => handleRechazar(cotizacion.cotizacion_id)}
                              disabled={procesando === cotizacion.cotizacion_id}
                              style={{
                                padding: '6px',
                                borderRadius: theme.borderRadius.md,
                                border: 'none',
                                backgroundColor: theme.colors.danger.bg,
                                cursor: 'pointer',
                                opacity: procesando === cotizacion.cotizacion_id ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <X size={14} color={theme.colors.danger.main} />
                            </button>
                          </>
                        )}
                        
                        {(cotizacion.estado === 'PENDIENTE' || cotizacion.estado === 'APROBADA') && (
                          <button
                            onClick={() => handleConvertirOT(cotizacion.cotizacion_id)}
                            disabled={procesando === cotizacion.cotizacion_id}
                            style={{
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: 'none',
                              backgroundColor: theme.colors.primary[100],
                              cursor: 'pointer',
                              opacity: procesando === cotizacion.cotizacion_id ? 0.5 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ArrowRight size={14} color={theme.colors.primary[600]} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {modalDetalle && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: theme.spacing[4]
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: theme.borderRadius['2xl'],
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: theme.shadows.xl
          }}>
            <div style={{ 
              padding: `${theme.spacing[5]} ${theme.spacing[5]}`, 
              borderBottom: `1px solid ${theme.colors.gray[200]}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: theme.colors.gray[50]
            }}>
              <h3 style={{ 
                fontSize: theme.typography.fontSize.lg, 
                fontWeight: theme.typography.fontWeight.semibold, 
                margin: 0,
                color: theme.colors.gray[900]
              }}>
                Detalle de Cotización
              </h3>
              <button
                onClick={() => setModalDetalle(null)}
                style={{
                  padding: '6px',
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  backgroundColor: theme.colors.gray[200],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} color={theme.colors.gray[600]} />
              </button>
            </div>
            
            <div style={{ padding: theme.spacing[5], overflowY: 'auto', maxHeight: '60vh' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: theme.spacing[4], 
                marginBottom: theme.spacing[5] 
              }}>
                <div>
                  <p style={{ 
                    fontSize: '11px', 
                    color: theme.colors.gray[400], 
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Número
                  </p>
                  <p style={{ 
                    fontFamily: theme.typography.fontFamily.mono, 
                    fontWeight: theme.typography.fontWeight.semibold,
                    margin: 0,
                    color: theme.colors.gray[800]
                  }}>
                    {modalDetalle.numero_cotizacion}
                  </p>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '11px', 
                    color: theme.colors.gray[400], 
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Patente
                  </p>
                  <p style={{ 
                    fontFamily: theme.typography.fontFamily.mono, 
                    fontWeight: theme.typography.fontWeight.semibold,
                    margin: 0,
                    color: theme.colors.gray[800]
                  }}>
                    {modalDetalle.patente}
                  </p>
                </div>
                <div>
                  <p style={{ 
                    fontSize: '11px', 
                    color: theme.colors.gray[400], 
                    margin: '0 0 4px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Total
                  </p>
                  <p style={{ 
                    fontSize: theme.typography.fontSize['2xl'], 
                    fontWeight: theme.typography.fontWeight.extrabold, 
                    color: theme.colors.primary[600], 
                    margin: 0 
                  }}>
                    ${modalDetalle.total?.toLocaleString('es-CL')}
                  </p>
                </div>
              </div>

              {modalDetalle.detalles && modalDetalle.detalles.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: theme.typography.fontSize.sm, 
                    fontWeight: theme.typography.fontWeight.semibold, 
                    margin: `0 0 ${theme.spacing[3]} 0`,
                    color: theme.colors.gray[700]
                  }}>
                    Items
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                    {modalDetalle.detalles.map((detalle) => (
                      <div 
                        key={detalle.detalle_cotizacion_id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                          backgroundColor: theme.colors.gray[50],
                          borderRadius: theme.borderRadius.md
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                          <span style={{
                            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                            borderRadius: theme.borderRadius.sm,
                            fontSize: '10px',
                            fontWeight: theme.typography.fontWeight.semibold,
                            backgroundColor: detalle.tipo_item === 'PRODUCTO' ? theme.colors.primary[100] : theme.colors.success.bg,
                            color: detalle.tipo_item === 'PRODUCTO' ? theme.colors.primary[700] : theme.colors.success.text
                          }}>
                            {detalle.tipo_item}
                          </span>
                          <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[600] }}>
                            {detalle.producto_nombre || detalle.servicio_nombre}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
                          <span style={{ fontSize: '12px', color: theme.colors.gray[400] }}>x{detalle.cantidad}</span>
                          <span style={{ 
                            fontWeight: theme.typography.fontWeight.semibold, 
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.gray[800]
                          }}>
                            ${detalle.subtotal?.toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
