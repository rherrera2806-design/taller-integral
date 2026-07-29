import React from 'react';
import { Vehiculo } from '../../types';
import { theme, componentStyles } from '../../utils/theme';
import { Car, Calendar, Gauge, Palette, User, Phone, Mail } from 'lucide-react';

interface FichaVehiculoProps {
  vehiculo: Vehiculo;
  totalVisitas: number;
}

export function FichaVehiculo({ vehiculo, totalVisitas }: FichaVehiculoProps) {
  return (
    <div style={componentStyles.card.base}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[800]} 100%)`,
        padding: theme.spacing[6],
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[4] }}>
          <div style={{
            width: '56px',
            height: '56px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: theme.borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car size={28} />
          </div>
          <div>
            <p style={{ 
              fontSize: theme.typography.fontSize['2xl'], 
              fontFamily: theme.typography.fontFamily.mono, 
              fontWeight: theme.typography.fontWeight.bold,
              margin: 0,
              letterSpacing: '1px'
            }}>
              {vehiculo.patente}
            </p>
            <p style={{ 
              fontSize: theme.typography.fontSize.md, 
              opacity: 0.9,
              margin: '4px 0 0 0'
            }}>
              {vehiculo.marca} {vehiculo.modelo}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div style={{ padding: theme.spacing[5] }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: theme.spacing[4],
          marginBottom: theme.spacing[5]
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.primary[50]
            }}>
              <Calendar size={16} color={theme.colors.primary[600]} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: theme.colors.gray[400], margin: 0 }}>Año</p>
              <p style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800], 
                margin: 0 
              }}>
                {vehiculo.anio}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.success.bg
            }}>
              <Gauge size={16} color={theme.colors.success.main} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: theme.colors.gray[400], margin: 0 }}>Kilometraje</p>
              <p style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800], 
                margin: 0 
              }}>
                {vehiculo.kilometraje_actual?.toLocaleString('es-CL') || 'N/A'} km
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.warning.bg
            }}>
              <Palette size={16} color={theme.colors.warning.main} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: theme.colors.gray[400], margin: 0 }}>Color</p>
              <p style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800], 
                margin: 0 
              }}>
                {vehiculo.color || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.primary[50]
            }}>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: theme.typography.fontWeight.bold, 
                color: theme.colors.primary[600] 
              }}>
                {totalVisitas}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: theme.colors.gray[400], margin: 0 }}>Visitas</p>
              <p style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800], 
                margin: 0 
              }}>
                {totalVisitas} visitas
              </p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        {vehiculo.cliente && (
          <div style={{ 
            paddingTop: theme.spacing[4], 
            borderTop: `1px solid ${theme.colors.gray[100]}`
          }}>
            <h4 style={{ 
              fontSize: '11px', 
              fontWeight: theme.typography.fontWeight.semibold, 
              color: theme.colors.gray[400],
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: `0 0 ${theme.spacing[3]} 0`
            }}>
              Propietario
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <User size={14} color={theme.colors.gray[500]} />
                <span style={{ 
                  fontSize: theme.typography.fontSize.md, 
                  color: theme.colors.gray[800], 
                  fontWeight: theme.typography.fontWeight.medium 
                }}>
                  {vehiculo.cliente.nombre}
                </span>
              </div>
              {vehiculo.cliente.telefono && (
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                  <Phone size={14} color={theme.colors.gray[500]} />
                  <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[500] }}>
                    {vehiculo.cliente.telefono}
                  </span>
                </div>
              )}
              {vehiculo.cliente.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                  <Mail size={14} color={theme.colors.gray[500]} />
                  <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[500] }}>
                    {vehiculo.cliente.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
