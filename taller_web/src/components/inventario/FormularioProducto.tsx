import React, { useState } from 'react';
import { Producto } from '../../types';
import { theme, componentStyles, getCategoriaColor } from '../../utils/theme';
import { 
  Save, X, Loader2, AlertCircle, Package, 
  Barcode, DollarSign, Hash, Tag, Truck
} from 'lucide-react';

interface FormularioProductoProps {
  producto?: Producto | null;
  onGuardar: (producto: Partial<Producto>) => Promise<void>;
  onCancelar: () => void;
}

const CATEGORIAS = [
  { value: 'ACEITES', label: 'Aceites', icon: '🛢️' },
  { value: 'FILTROS', label: 'Filtros', icon: '🔧' },
  { value: 'REPUESTOS', label: 'Repuestos', icon: '⚙️' },
  { value: 'INSUMOS', label: 'Insumos', icon: '🧴' }
];

export function FormularioProducto({ producto, onGuardar, onCancelar }: FormularioProductoProps) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    codigo_barras: producto?.codigo_barras || '',
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    categoria: producto?.categoria || 'ACEITES',
    stock_actual: producto?.stock_actual?.toString() || '0',
    stock_minimo: producto?.stock_minimo?.toString() || '5',
    precio_costo: producto?.precio_costo?.toString() || '',
    precio_venta: producto?.precio_venta?.toString() || '',
    unidad_medida: producto?.unidad_medida || 'UNIDAD',
    proveedor: producto?.proveedor || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo_barras || !formData.nombre || !formData.precio_costo || !formData.precio_venta) {
      setError('Complete todos los campos obligatorios');
      return;
    }

    if (parseFloat(formData.precio_venta) < parseFloat(formData.precio_costo)) {
      setError('El precio de venta debe ser mayor al precio de costo');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar({
        codigo_barras: formData.codigo_barras,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        categoria: formData.categoria as any,
        stock_actual: parseInt(formData.stock_actual),
        stock_minimo: parseInt(formData.stock_minimo),
        precio_costo: parseFloat(formData.precio_costo),
        precio_venta: parseFloat(formData.precio_venta),
        unidad_medida: formData.unidad_medida,
        proveedor: formData.proveedor
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={componentStyles.card.base}>
      {/* Header */}
      <div style={{
        ...componentStyles.card.header,
        background: `linear-gradient(135deg, ${theme.colors.lubricentro.bg} 0%, white 100%)`
      }}>
        <div style={{
          ...componentStyles.iconContainer,
          backgroundColor: theme.colors.lubricentro.main
        }}>
          <Package size={16} color="white" />
        </div>
        <div>
          <span style={{ 
            fontSize: theme.typography.fontSize.lg, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[800] 
          }}>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </span>
          <p style={{ 
            fontSize: '12px', 
            color: theme.colors.gray[400], 
            margin: '2px 0 0 0' 
          }}>
            Complete la información del producto
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

        {/* Código de Barras y Nombre */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: theme.spacing[4], marginBottom: theme.spacing[4] }}>
          <div>
            <label style={componentStyles.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Barcode size={12} />
                Código de Barras *
              </div>
            </label>
            <input
              type="text"
              value={formData.codigo_barras}
              onChange={(e) => handleChange('codigo_barras', e.target.value)}
              placeholder="7801234567890"
              style={{
                ...componentStyles.input.base,
                fontFamily: theme.typography.fontFamily.mono
              }}
              required
            />
          </div>
          <div>
            <label style={componentStyles.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={12} />
                Nombre del Producto *
              </div>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Aceite Motor 5W-30 4L"
              style={componentStyles.input.base}
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: theme.spacing[4] }}>
          <label style={componentStyles.label}>Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Descripción detallada del producto..."
            rows={2}
            style={{ ...componentStyles.input.base, resize: 'vertical' }}
          />
        </div>

        {/* Categoría y Unidad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4], marginBottom: theme.spacing[4] }}>
          <div>
            <label style={componentStyles.label}>Categoría *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.spacing[2] }}>
              {CATEGORIAS.map(cat => {
                const catColor = getCategoriaColor(cat.value);
                const isSelected = formData.categoria === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleChange('categoria', cat.value)}
                    style={{
                      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                      borderRadius: theme.borderRadius.lg,
                      border: `2px solid ${isSelected ? catColor.main : theme.colors.gray[200]}`,
                      backgroundColor: isSelected ? catColor.bg : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2],
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                    <span style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: isSelected ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                      color: isSelected ? catColor.text : theme.colors.gray[600]
                    }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={componentStyles.label}>Unidad de Medida</label>
            <select
              value={formData.unidad_medida}
              onChange={(e) => handleChange('unidad_medida', e.target.value)}
              style={{
                ...componentStyles.input.base,
                cursor: 'pointer'
              }}
            >
              <option value="UNIDAD">Unidad</option>
              <option value="LITRO">Litro</option>
              <option value="KILO">Kilo</option>
              <option value="JUEGO">Juego</option>
              <option value="SET">Set</option>
            </select>
            
            <div style={{ marginTop: theme.spacing[3] }}>
              <label style={componentStyles.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={12} />
                  Proveedor
                </div>
              </label>
              <input
                type="text"
                value={formData.proveedor}
                onChange={(e) => handleChange('proveedor', e.target.value)}
                placeholder="Nombre del proveedor"
                style={componentStyles.input.base}
              />
            </div>
          </div>
        </div>

        {/* Stock */}
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.gray[50],
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing[4]
        }}>
          <h4 style={{ 
            fontSize: theme.typography.fontSize.sm, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[700],
            margin: `0 0 ${theme.spacing[3]} 0`,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[1]
          }}>
            <Hash size={14} />
            Inventario
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={componentStyles.label}>Stock Actual</label>
              <input
                type="number"
                value={formData.stock_actual}
                onChange={(e) => handleChange('stock_actual', e.target.value)}
                min="0"
                style={componentStyles.input.base}
              />
            </div>
            <div>
              <label style={componentStyles.label}>Stock Mínimo (Alerta)</label>
              <input
                type="number"
                value={formData.stock_minimo}
                onChange={(e) => handleChange('stock_minimo', e.target.value)}
                min="0"
                style={componentStyles.input.base}
              />
            </div>
          </div>
        </div>

        {/* Precios */}
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.lg,
          marginBottom: theme.spacing[5]
        }}>
          <h4 style={{ 
            fontSize: theme.typography.fontSize.sm, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.primary[700],
            margin: `0 0 ${theme.spacing[3]} 0`,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[1]
          }}>
            <DollarSign size={14} />
            Precios
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={componentStyles.label}>Precio Costo *</label>
              <input
                type="number"
                value={formData.precio_costo}
                onChange={(e) => handleChange('precio_costo', e.target.value)}
                placeholder="0"
                min="0"
                style={componentStyles.input.base}
                required
              />
            </div>
            <div>
              <label style={componentStyles.label}>Precio Venta *</label>
              <input
                type="number"
                value={formData.precio_venta}
                onChange={(e) => handleChange('precio_venta', e.target.value)}
                placeholder="0"
                min="0"
                style={componentStyles.input.base}
                required
              />
            </div>
            <div>
              <label style={componentStyles.label}>Margen</label>
              <div style={{
                ...componentStyles.input.base,
                backgroundColor: theme.colors.gray[100],
                display: 'flex',
                alignItems: 'center',
                color: theme.colors.gray[600]
              }}>
                {formData.precio_costo && formData.precio_venta
                  ? `${((parseFloat(formData.precio_venta) / parseFloat(formData.precio_costo) - 1) * 100).toFixed(1)}%`
                  : '---'
                }
              </div>
            </div>
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
                {producto ? 'Actualizar' : 'Crear'} Producto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
