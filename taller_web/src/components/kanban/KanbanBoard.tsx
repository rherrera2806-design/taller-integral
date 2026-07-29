import React, { useEffect, useRef } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { useOrdenesTrabajo } from '../../hooks/useOrdenesTrabajo';
import { ESTADOS_OT, EstadoOT } from '../../types';
import { theme, getEstadoColor } from '../../utils/theme';
import { RefreshCw, AlertCircle, Activity, Clock } from 'lucide-react';

export function KanbanBoard() {
  const { ordenesPorEstado, loading, error, cambiarEstado, refetch } = useOrdenesTrabajo();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refetch();
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetch]);

  const handleMoverOT = async (otId: number, nuevoEstado: string) => {
    await cambiarEstado(otId, nuevoEstado, {
      id: 1,
      nombre: 'Operador Web'
    });
  };

  const columnConfig: Record<EstadoOT, { title: string; description: string; icon: React.ReactNode }> = {
    RECIBIDO: { 
      title: 'Recibidos', 
      description: 'Vehículos en espera',
      icon: <Clock size={16} />
    },
    EN_PROCESO: { 
      title: 'En Proceso', 
      description: 'Trabajo en curso',
      icon: <Activity size={16} />
    },
    CONTROL_CALIDAD: { 
      title: 'Control Calidad', 
      description: 'Verificación final',
      icon: <AlertCircle size={16} />
    },
    LISTO: { 
      title: 'Listo', 
      description: 'Para entregar',
      icon: <RefreshCw size={16} />
    },
  };

  const totalOTs = Object.values(ordenesPorEstado).reduce((sum, ots) => sum + ots.length, 0);

  if (loading && totalOTs === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: theme.spacing[4]
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `3px solid ${theme.colors.gray[200]}`,
          borderTopColor: theme.colors.primary[500],
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: theme.colors.gray[500], fontSize: theme.typography.fontSize.md }}>
          Cargando órdenes de trabajo...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: theme.colors.danger.bg,
        border: `1px solid ${theme.colors.gray[200]}`,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing[6],
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[4]
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: theme.colors.danger.bg,
          borderRadius: theme.borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AlertCircle size={20} color={theme.colors.danger.main} />
        </div>
        <div>
          <h3 style={{ 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.danger.text, 
            margin: '0 0 4px 0',
            fontSize: theme.typography.fontSize.lg
          }}>
            Error al cargar datos
          </h3>
          <p style={{ 
            color: theme.colors.gray[600], 
            fontSize: theme.typography.fontSize.md,
            margin: 0
          }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        marginBottom: theme.spacing[6]
      }}>
        <div>
          <h2 style={{ 
            fontSize: theme.typography.fontSize['3xl'], 
            fontWeight: theme.typography.fontWeight.extrabold, 
            color: theme.colors.gray[900],
            margin: 0,
            letterSpacing: '-0.025em'
          }}>
            Tablero de Órdenes
          </h2>
          <p style={{ 
            color: theme.colors.gray[500], 
            marginTop: theme.spacing[1],
            fontSize: theme.typography.fontSize.md,
            margin: '4px 0 0 0'
          }}>
            {totalOTs} órdenes activas • Actualización automática cada 10s
          </p>
        </div>
        
        <button
          onClick={refetch}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: 'white',
            border: `1px solid ${theme.colors.gray[200]}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.gray[600],
            transition: 'all 0.2s',
            boxShadow: theme.shadows.sm
          }}
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {/* Kanban Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: theme.spacing[5],
        height: 'calc(100vh - 200px)'
      }}>
        {ESTADOS_OT.map((estado) => {
          const estadoColor = getEstadoColor(estado);
          const config = columnConfig[estado];
          
          return (
            <KanbanColumn
              key={estado}
              estado={estado}
              titulo={config.title}
              descripcion={config.description}
              icon={config.icon}
              ordenes={ordenesPorEstado[estado] || []}
              color={estadoColor.dot}
              bgColor={estadoColor.bg}
              textColor={estadoColor.text}
              onMoverOT={handleMoverOT}
              siguienteEstado={
                estado === 'RECIBIDO' ? 'EN_PROCESO' :
                estado === 'EN_PROCESO' ? 'CONTROL_CALIDAD' :
                estado === 'CONTROL_CALIDAD' ? 'LISTO' : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}
