import React, { useState } from 'react';
import { Servicio } from '../../types';
import { theme, componentStyles, getCategoriaColor } from '../../utils/theme';
import { 
  Save, X, Loader2, AlertCircle, Wrench, 
  Clock, DollarSign, Tag, Fuel, Droplets, Settings
} from 'lucide-react';

interface FormularioServicioProps {
  servicio?: Servicio | null;
  onGuardar: (servicio: Partial<Servicio>) => Promise<void>;
  onCancelar: () => void;
}

const CATEGORIAS = [
  { 
    value: 'LUBRICENTRO', 
    label: 'Lubricentro', 
    icon: <Fuel size={20} />,
    description: 'Cambio de aceite, filtros'
  },
  { 
    value: 'MECANICA', 
    label: 'Mecánica', 
    icon: <Wrench size={20} />,
    description: 'Alineación, frenos, suspensión'
  },
  { 
    value: 'LAVADO', 
    label: 'Lavado', 
    icon: <Droplets size={20} />,
    description: 'Lavado exterior e interior'
  }
];

export function FormularioServicio({ servicio, onGuardar, onCancelar }: FormularioServicioProps) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: servicio?.nombre || '',
    descripcion: servicio?.descripcion || '',
    precio_base: servicio?.precio_base?.toString() || '',
    categoria: servicio?.categoria || 'LUBRICENTRO',
    duracion_estimada_minutos: servicio?.duracion_estimada_minutos?.toString() || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio_base || !formData.categoria) {
      setError('Complete todos los campos obligatorios');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio_base: parseFloat(formData.precio_base),
        categoria: formData.categoria as any,
        duracion_estimada_minutos: formData.duracion_estimada_minutos 
          ? parseInt(formData.duracion_estimada_minutos) 
          : undefined
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar servicio');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={componentStyles.card.base}>
      {/* Header */}
      <div style={{
        ...componentStyles.card.header,
        background: `linear-gradient(135deg, ${theme.colors.mecanica.bg} 0%, white 100%)`
      }}>
        <div style={{
          ...componentStyles.iconContainer,
          backgroundColor: theme.colors.mecanica.main
        }}>
          <Wrench size={16} color="white" />
        </div>
        <div>
          <span style={{ 
            fontSize: theme.typography.fontSize.lg, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[800] 
          }}>
            {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
          </span>
          <p style={{ 
            fontSize: '12px', 
            color: theme.colors.gray[400], 
            margin: '2px 0 0 0' 
          }}>
            Defina el servicio y su precio base
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={componentStyles.card.body}>
        {/* Error */}
        {error && (
          <div style={{
            marginBottom: theme.spacing[4],
            padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
            backgroundColor: theme.colors.danger.bg,
            border: `1px solid ${theme.colors.danger.main}20`,
            borderRadius: theme.borderRadius.lg,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2]
          }}>
            <AlertCircle size={16} color={theme.colors.danger.main} />
            <span style={{ color: theme.colors.danger.text, fontSize: theme.typography.fontSize.sm }}>
              {error}
            </span>
          </div>
        )}

        {/* Nombre */}
        <div style={{ marginBottom: theme.spacing[4] }}>
          <label style={componentStyles.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} />
              Nombre del Servicio *
            </div>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Cambio de Aceite Simple"
            style={componentStyles.input.base}
            required
          />
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: theme.spacing[4] }}>
          <label style={componentStyles.label}>Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción detallada del servicio..."
            rows={3}
            style={{ ...componentStyles.input.base, resize: 'vertical' }}
          />
        </div>

        {/* Categoría - Selector visual */}
        <div style={{ marginBottom: theme.spacing[4] }}>
          <label style={componentStyles.label}>Categoría *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing[3] }}>
            {CATEGORIAS.map(cat => {
              const catColor = getCategoriaColor(cat.value);
              const isSelected = formData.categoria === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleChange('categoria', cat.value)}
                  style={{
                    padding: theme.spacing[4],
                    borderRadius: theme.borderRadius.xl,
                    border: `2px solid ${isSelected ? catColor.main : theme.colors.gray[200]}`,
                    backgroundColor: isSelected ? catColor.bg : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: theme.spacing[2],
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? `0 4px 12px ${catColor.main}20` : 'none'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: isSelected ? catColor.main : theme.colors.gray[100],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'white' : theme.colors.gray[500],
                    transition: 'all 0.2s'
                  }}>
                    {cat.icon}
                  </div>
                  <span style={{
                    fontSize: theme.typography.fontSize.md,
                    fontWeight: isSelected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                    color: isSelected ? catColor.text : theme.colors.gray[700]
                  }}>
                    {cat.label}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: isSelected ? catColor.text : theme.colors.gray[400],
                    textAlign: 'center'
                  }}>
                    {cat.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Precio y Duración */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: theme.spacing[4],
          marginBottom: theme.spacing[5]
        }}>
          <div style={{
            padding: theme.spacing[4],
            backgroundColor: theme.colors.primary[50],
            borderRadius: theme.borderRadius.lg
          }}>
            <label style={{
              ...componentStyles.label,
              color: theme.colors.primary[700],
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <DollarSign size={14} />
              Precio Base *
            </label>
            <input
              type="number"
              value={formData.precio_base}
              onChange={(e) => handleChange('precio_base', e.target.value)}
              placeholder="0"
              min="0"
              style={{
                ...componentStyles.input.base,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                textAlign: 'center'
              }}
              required
            />
            <p style={{ 
              fontSize: '11px', 
              color: theme.colors.primary[400], 
              textAlign: 'center',
              margin: `${theme.spacing[1]} 0 0 0`
            }}>
              Precio en pesos chilenos
            </p>
          </div>
          
          <div style={{
            padding: theme.spacing[4],
            backgroundColor: theme.colors.warning.bg,
            borderRadius: theme.borderRadius.lg
          }}>
            <label style={{
              ...componentStyles.label,
              color: theme.colors.warning.text,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clock size={14} />
              Duración Estimada
            </label>
            <input
              type="number"
              value={formData.duracion_estimada_minutos}
              onChange={(e) => handleChange('duracion_estimada_minutos', e.target.value)}
              placeholder="30"
              min="0"
              style={{
                ...componentStyles.input.base,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                textAlign: 'center'
              }}
            />
            <p style={{ 
              fontSize: '11px', 
              color: theme.colors.warning.text, 
              textAlign: 'center',
              margin: `${theme.spacing[1]} 0 0 0`
            }}>
              Minutos aproximados
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing[3] }}>
          <button
            type="button"
            onClick={onCancelar}
            style={{
              ...componentStyles.button.secondary,
              padding: `${theme.spacing[3]} ${theme.spacing[5]}`
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            style={{
              ...componentStyles.button.primary,
              padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
              opacity: guardando ? 0.7 : 1,
              cursor: guardando ? 'not-allowed' : 'pointer'
            }}
          >
            {guardando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                {servicio ? 'Actualizar' : 'Crear'} Servicio
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
