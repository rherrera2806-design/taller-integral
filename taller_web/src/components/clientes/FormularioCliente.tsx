import React, { useState } from 'react';
import { theme, componentStyles } from '../../utils/theme';
import { 
  Save, X, Loader2, AlertCircle, User, 
  Phone, Mail, MapPin, Hash, Building, CreditCard
} from 'lucide-react';

interface Cliente {
  cliente_id?: number;
  rut_dni: string;
  nombre: string;
  email?: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
}

interface FormularioClienteProps {
  cliente?: Cliente | null;
  onGuardar: (cliente: Cliente) => Promise<void>;
  onCancelar: () => void;
}

export function FormularioCliente({ cliente, onGuardar, onCancelar }: FormularioClienteProps) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    rut_dni: cliente?.rut_dni || '',
    nombre: cliente?.nombre || '',
    email: cliente?.email || '',
    telefono: cliente?.telefono || '',
    direccion: cliente?.direccion || '',
    comuna: cliente?.comuna || '',
    ciudad: cliente?.ciudad || 'Santiago'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const formatRUT = (value: string) => {
    // Formato RUT chileno: XX.XXX.XXX-X
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleaned.length <= 1) {
      handleChange('rut_dni', cleaned);
    } else if (cleaned.length <= 4) {
      handleChange('rut_dni', `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`);
    } else if (cleaned.length <= 7) {
      handleChange('rut_dni', `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`);
    } else {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      handleChange('rut_dni', `${formatted}-${dv}`);
    }
  };

  const formatPhone = (value: string) => {
    // Formato teléfono: +56 9 XXXX XXXX
    const cleaned = value.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+56')) {
      const number = cleaned.slice(3);
      if (number.length <= 1) {
        handleChange('telefono', `+56 ${number}`);
      } else if (number.length <= 5) {
        handleChange('telefono', `+56 ${number.slice(0, 1)} ${number.slice(1)}`);
      } else {
        handleChange('telefono', `+56 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5, 9)}`);
      }
    } else {
      handleChange('telefono', cleaned);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rut_dni || !formData.nombre || !formData.telefono) {
      setError('Complete los campos obligatorios: RUT/DNI, Nombre y Teléfono');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await onGuardar({
        rut_dni: formData.rut_dni,
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        comuna: formData.comuna,
        ciudad: formData.ciudad
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cliente');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={componentStyles.card.base}>
      {/* Header */}
      <div style={{
        ...componentStyles.card.header,
        background: `linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)`
      }}>
        <div style={{
          ...componentStyles.iconContainer,
          backgroundColor: 'rgba(255,255,255,0.2)'
        }}>
          <User size={18} color="white" />
        </div>
        <div>
          <span style={{ 
            fontSize: theme.typography.fontSize.xl, 
            fontWeight: theme.typography.fontWeight.bold, 
            color: 'white' 
          }}>
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </span>
          <p style={{ 
            fontSize: '13px', 
            color: 'rgba(255,255,255,0.8)', 
            margin: '2px 0 0 0' 
          }}>
            Complete la información del cliente
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
            <AlertCircle size={18} color={theme.colors.danger.main} />
            <span style={{ color: theme.colors.danger.text, fontSize: theme.typography.fontSize.md }}>
              {error}
            </span>
          </div>
        )}

        {/* RUT/DNI y Nombre */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: theme.spacing[4], marginBottom: theme.spacing[5] }}>
          <div>
            <label style={componentStyles.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} />
                RUT / DNI *
              </div>
            </label>
            <input
              type="text"
              value={formData.rut_dni}
              onChange={(e) => formatRUT(e.target.value)}
              placeholder="12.345.678-9"
              style={{
                ...componentStyles.input.base,
                fontFamily: theme.typography.fontFamily.mono,
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                letterSpacing: '0.5px'
              }}
              maxLength={12}
              required
            />
            <p style={{ 
              fontSize: '11px', 
              color: theme.colors.gray[400], 
              margin: `${theme.spacing[1]} 0 0 0` 
            }}>
              Formato: XX.XXX.XXX-X
            </p>
          </div>
          <div>
            <label style={componentStyles.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} />
                Nombre Completo *
              </div>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Juan Pérez González"
              style={{
                ...componentStyles.input.base,
                fontSize: theme.typography.fontSize.lg
              }}
              required
            />
          </div>
        </div>

        {/* Contacto */}
        <div style={{
          padding: theme.spacing[5],
          backgroundColor: theme.colors.gray[50],
          borderRadius: theme.borderRadius.xl,
          marginBottom: theme.spacing[5]
        }}>
          <h4 style={{ 
            fontSize: theme.typography.fontSize.md, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.gray[700],
            margin: `0 0 ${theme.spacing[4]} 0`,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2]
          }}>
            <Phone size={16} />
            Información de Contacto
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
            <div>
              <label style={componentStyles.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} />
                  Teléfono *
                </div>
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => formatPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                style={{
                  ...componentStyles.input.base,
                  fontFamily: theme.typography.fontFamily.mono
                }}
                required
              />
            </div>
            <div>
              <label style={componentStyles.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="cliente@email.com"
                style={componentStyles.input.base}
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div style={{
          padding: theme.spacing[5],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.xl,
          marginBottom: theme.spacing[5]
        }}>
          <h4 style={{ 
            fontSize: theme.typography.fontSize.md, 
            fontWeight: theme.typography.fontWeight.semibold, 
            color: theme.colors.primary[700],
            margin: `0 0 ${theme.spacing[4]} 0`,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2]
          }}>
            <MapPin size={16} />
            Dirección
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
            <div>
              <label style={componentStyles.label}>Dirección</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                placeholder="Av. Principal 123, Depto 45"
                style={componentStyles.input.base}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
              <div>
                <label style={componentStyles.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} />
                    Comuna
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.comuna}
                  onChange={(e) => handleChange('comuna', e.target.value)}
                  placeholder="Providencia"
                  style={componentStyles.input.base}
                />
              </div>
              <div>
                <label style={componentStyles.label}>Ciudad</label>
                <select
                  value={formData.ciudad}
                  onChange={(e) => handleChange('ciudad', e.target.value)}
                  style={{
                    ...componentStyles.input.base,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Santiago">Santiago</option>
                  <option value="Valparaíso">Valparaíso</option>
                  <option value="Concepción">Concepción</option>
                  <option value="La Serena">La Serena</option>
                  <option value="Antofagasta">Antofagasta</option>
                  <option value="Temuco">Temuco</option>
                  <option value="Rancagua">Rancagua</option>
                  <option value="Talca">Talca</option>
                  <option value="Chillán">Chillán</option>
                  <option value="Osorno">Osorno</option>
                  <option value="Puerto Montt">Puerto Montt</option>
                  <option value="Otra">Otra</option>
                </select>
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
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            style={{
              ...componentStyles.button.primary,
              padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
              backgroundColor: '#8b5cf6',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
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
                {cliente ? 'Actualizar' : 'Crear'} Cliente
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
