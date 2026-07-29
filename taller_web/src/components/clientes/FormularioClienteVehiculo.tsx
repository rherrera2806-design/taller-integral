import React, { useState } from 'react';
import { theme, componentStyles } from '../../utils/theme';
import { 
  Save, X, Loader2, AlertCircle, User, Car,
  Phone, Mail, MapPin, Hash, Building, CreditCard,
  Calendar, Gauge, Palette, ChevronRight, Check
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

interface Vehiculo {
  vehiculo_id?: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje_actual: number;
  color?: string;
  observaciones?: string;
}

interface FormularioClienteVehiculoProps {
  onGuardar: (cliente: Cliente, vehiculo: Vehiculo) => Promise<void>;
  onCancelar: () => void;
}

const MARCAS = [
  'Toyota', 'Honda', 'Nissan', 'Chevrolet', 'Suzuki', 
  'Hyundai', 'Kia', 'Mazda', 'Ford', 'Volkswagen',
  'Peugeot', 'Renault', 'Fiat', 'BMW', 'Mercedes-Benz',
  'Audi', 'Subaru', 'Mitsubishi', 'Jeep', 'Otra'
];

const COLORES = [
  { value: 'Blanco', label: 'Blanco', hex: '#ffffff' },
  { value: 'Negro', label: 'Negro', hex: '#1e293b' },
  { value: 'Plata', label: 'Plata', hex: '#94a3b8' },
  { value: 'Gris', label: 'Gris', hex: '#64748b' },
  { value: 'Rojo', label: 'Rojo', hex: '#ef4444' },
  { value: 'Azul', label: 'Azul', hex: '#3b82f6' },
  { value: 'Verde', label: 'Verde', hex: '#22c55e' },
  { value: 'Amarillo', label: 'Amarillo', hex: '#eab308' },
  { value: 'Naranja', label: 'Naranja', hex: '#f97316' },
  { value: 'Marrón', label: 'Marrón', hex: '#92400e' }
];

export function FormularioClienteVehiculo({ onGuardar, onCancelar }: FormularioClienteVehiculoProps) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paso, setPaso] = useState<1 | 2>(1); // 1: Cliente, 2: Vehículo
  
  // Datos del cliente
  const [clienteData, setClienteData] = useState({
    rut_dni: '',
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    ciudad: 'Santiago'
  });

  // Datos del vehículo
  const [vehiculoData, setVehiculoData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear().toString(),
    kilometraje_actual: '0',
    color: 'Blanco',
    observaciones: ''
  });

  const handleClienteChange = (field: string, value: string) => {
    setClienteData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleVehiculoChange = (field: string, value: string) => {
    setVehiculoData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const formatRUT = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
    if (cleaned.length <= 1) {
      handleClienteChange('rut_dni', cleaned);
    } else if (cleaned.length <= 4) {
      handleClienteChange('rut_dni', `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`);
    } else {
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      handleClienteChange('rut_dni', `${formatted}-${dv}`);
    }
  };

  const formatPatente = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 2) {
      handleVehiculoChange('patente', cleaned);
    } else if (cleaned.length <= 4) {
      handleVehiculoChange('patente', `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`);
    } else {
      handleVehiculoChange('patente', `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}`);
    }
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+56')) {
      const number = cleaned.slice(3);
      if (number.length <= 1) {
        handleClienteChange('telefono', `+56 ${number}`);
      } else if (number.length <= 5) {
        handleClienteChange('telefono', `+56 ${number.slice(0, 1)} ${number.slice(1)}`);
      } else {
        handleClienteChange('telefono', `+56 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5, 9)}`);
      }
    } else {
      handleClienteChange('telefono', cleaned);
    }
  };

  const validarPaso1 = (): boolean => {
    if (!clienteData.rut_dni || !clienteData.nombre || !clienteData.telefono) {
      setError('Complete RUT/DNI, Nombre y Teléfono del cliente');
      return false;
    }
    return true;
  };

  const validarPaso2 = (): boolean => {
    if (!vehiculoData.patente || !vehiculoData.marca || !vehiculoData.modelo) {
      setError('Complete Patente, Marca y Modelo del vehículo');
      return false;
    }
    if (parseInt(vehiculoData.anio) < 1900 || parseInt(vehiculoData.anio) > new Date().getFullYear() + 1) {
      setError('El año del vehículo no es válido');
      return false;
    }
    return true;
  };

  const handleSiguiente = () => {
    if (validarPaso1()) {
      setPaso(2);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarPaso2()) return;

    setGuardando(true);
    setError(null);

    try {
      await onGuardar(
        {
          rut_dni: clienteData.rut_dni,
          nombre: clienteData.nombre,
          email: clienteData.email,
          telefono: clienteData.telefono,
          direccion: clienteData.direccion,
          comuna: clienteData.comuna,
          ciudad: clienteData.ciudad
        },
        {
          patente: vehiculoData.patente,
          marca: vehiculoData.marca,
          modelo: vehiculoData.modelo,
          anio: parseInt(vehiculoData.anio),
          kilometraje_actual: parseInt(vehiculoData.kilometraje_actual),
          color: vehiculoData.color,
          observaciones: vehiculoData.observaciones
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={componentStyles.card.base}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)`,
        padding: theme.spacing[5],
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[4] }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: theme.borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {paso === 1 ? <User size={24} /> : <Car size={24} />}
          </div>
          <div>
            <h2 style={{ 
              fontSize: theme.typography.fontSize.xl, 
              fontWeight: theme.typography.fontWeight.bold, 
              margin: 0 
            }}>
              Nuevo Cliente + Vehículo
            </h2>
            <p style={{ 
              fontSize: theme.typography.fontSize.sm, 
              opacity: 0.9, 
              margin: '4px 0 0 0' 
            }}>
              {paso === 1 ? 'Paso 1: Datos del cliente' : 'Paso 2: Datos del vehículo'}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: theme.spacing[2],
          marginTop: theme.spacing[4] 
        }}>
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.3)'
          }}>
            <div style={{
              width: paso === 1 ? '50%' : '100%',
              height: '100%',
              borderRadius: '2px',
              backgroundColor: 'white',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'rgba(255,255,255,0.3)'
          }}>
            <div style={{
              width: paso === 2 ? '100%' : '0%',
              height: '100%',
              borderRadius: '2px',
              backgroundColor: 'white',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Step Labels */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: theme.spacing[2] 
        }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: paso === 1 ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
            opacity: paso === 1 ? 1 : 0.6
          }}>
            Cliente
          </span>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: paso === 2 ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
            opacity: paso === 2 ? 1 : 0.6
          }}>
            Vehículo
          </span>
        </div>
      </div>

      {/* Form Content */}
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

        {/* Paso 1: Datos del Cliente */}
        {paso === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[5] }}>
            {/* RUT y Nombre */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: theme.spacing[4] }}>
              <div>
                <label style={componentStyles.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} />
                    RUT / DNI *
                  </div>
                </label>
                <input
                  type="text"
                  value={clienteData.rut_dni}
                  onChange={(e) => formatRUT(e.target.value)}
                  placeholder="12.345.678-9"
                  style={{
                    ...componentStyles.input.base,
                    fontFamily: theme.typography.fontFamily.mono,
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold
                  }}
                  maxLength={12}
                />
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
                  value={clienteData.nombre}
                  onChange={(e) => handleClienteChange('nombre', e.target.value)}
                  placeholder="Juan Pérez González"
                  style={{
                    ...componentStyles.input.base,
                    fontSize: theme.typography.fontSize.lg
                  }}
                />
              </div>
            </div>

            {/* Contacto */}
            <div style={{
              padding: theme.spacing[4],
              backgroundColor: theme.colors.gray[50],
              borderRadius: theme.borderRadius.xl
            }}>
              <h4 style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[700],
                margin: `0 0 ${theme.spacing[3]} 0`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2]
              }}>
                <Phone size={16} />
                Contacto
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[3] }}>
                <div>
                  <label style={componentStyles.label}>Teléfono *</label>
                  <input
                    type="tel"
                    value={clienteData.telefono}
                    onChange={(e) => formatPhone(e.target.value)}
                    placeholder="+56 9 1234 5678"
                    style={{
                      ...componentStyles.input.base,
                      fontFamily: theme.typography.fontFamily.mono
                    }}
                  />
                </div>
                <div>
                  <label style={componentStyles.label}>Email</label>
                  <input
                    type="email"
                    value={clienteData.email}
                    onChange={(e) => handleClienteChange('email', e.target.value)}
                    placeholder="cliente@email.com"
                    style={componentStyles.input.base}
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div style={{
              padding: theme.spacing[4],
              backgroundColor: theme.colors.primary[50],
              borderRadius: theme.borderRadius.xl
            }}>
              <h4 style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.primary[700],
                margin: `0 0 ${theme.spacing[3]} 0`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2]
              }}>
                <MapPin size={16} />
                Dirección (Opcional)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                <div>
                  <label style={componentStyles.label}>Dirección</label>
                  <input
                    type="text"
                    value={clienteData.direccion}
                    onChange={(e) => handleClienteChange('direccion', e.target.value)}
                    placeholder="Av. Principal 123"
                    style={componentStyles.input.base}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[3] }}>
                  <div>
                    <label style={componentStyles.label}>Comuna</label>
                    <input
                      type="text"
                      value={clienteData.comuna}
                      onChange={(e) => handleClienteChange('comuna', e.target.value)}
                      placeholder="Providencia"
                      style={componentStyles.input.base}
                    />
                  </div>
                  <div>
                    <label style={componentStyles.label}>Ciudad</label>
                    <select
                      value={clienteData.ciudad}
                      onChange={(e) => handleClienteChange('ciudad', e.target.value)}
                      style={{ ...componentStyles.input.base, cursor: 'pointer' }}
                    >
                      <option value="Santiago">Santiago</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Concepción">Concepción</option>
                      <option value="La Serena">La Serena</option>
                      <option value="Otra">Otra</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Datos del Vehículo */}
        {paso === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[5] }}>
            {/* Patente */}
            <div>
              <label style={componentStyles.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hash size={14} />
                  Patente *
                </div>
              </label>
              <input
                type="text"
                value={vehiculoData.patente}
                onChange={(e) => formatPatente(e.target.value)}
                placeholder="ABC-1234"
                style={{
                  ...componentStyles.input.base,
                  fontFamily: theme.typography.fontFamily.mono,
                  fontSize: theme.typography.fontSize['2xl'],
                  fontWeight: theme.typography.fontWeight.bold,
                  letterSpacing: '2px',
                  textAlign: 'center',
                  textTransform: 'uppercase'
                }}
                maxLength={8}
              />
            </div>

            {/* Marca y Modelo */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
              <div>
                <label style={componentStyles.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={14} />
                    Marca *
                  </div>
                </label>
                <select
                  value={vehiculoData.marca}
                  onChange={(e) => handleVehiculoChange('marca', e.target.value)}
                  style={{ ...componentStyles.input.base, cursor: 'pointer' }}
                >
                  <option value="">Seleccionar marca</option>
                  {MARCAS.map(marca => (
                    <option key={marca} value={marca}>{marca}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={componentStyles.label}>Modelo *</label>
                <input
                  type="text"
                  value={vehiculoData.modelo}
                  onChange={(e) => handleVehiculoChange('modelo', e.target.value)}
                  placeholder="Corolla"
                  style={componentStyles.input.base}
                />
              </div>
            </div>

            {/* Año y Kilometraje */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
              <div>
                <label style={componentStyles.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    Año *
                  </div>
                </label>
                <input
                  type="number"
                  value={vehiculoData.anio}
                  onChange={(e) => handleVehiculoChange('anio', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  style={componentStyles.input.base}
                />
              </div>
              <div>
                <label style={componentStyles.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Gauge size={14} />
                    Kilometraje Actual
                  </div>
                </label>
                <input
                  type="number"
                  value={vehiculoData.kilometraje_actual}
                  onChange={(e) => handleVehiculoChange('kilometraje_actual', e.target.value)}
                  min="0"
                  placeholder="0"
                  style={componentStyles.input.base}
                />
                <span style={{ fontSize: '11px', color: theme.colors.gray[400] }}>km</span>
              </div>
            </div>

            {/* Color */}
            <div>
              <label style={componentStyles.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Palette size={14} />
                  Color
                </div>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[2] }}>
                {COLORES.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleVehiculoChange('color', color.value)}
                    style={{
                      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                      borderRadius: theme.borderRadius.lg,
                      border: `2px solid ${vehiculoData.color === color.value ? theme.colors.primary[500] : theme.colors.gray[200]}`,
                      backgroundColor: vehiculoData.color === color.value ? theme.colors.primary[50] : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2],
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                      border: `1px solid ${theme.colors.gray[300]}`
                    }} />
                    <span style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: vehiculoData.color === color.value ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.normal,
                      color: vehiculoData.color === color.value ? theme.colors.primary[700] : theme.colors.gray[600]
                    }}>
                      {color.label}
                    </span>
                    {vehiculoData.color === color.value && (
                      <Check size={14} color={theme.colors.primary[600]} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label style={componentStyles.label}>Observaciones del Vehículo</label>
              <textarea
                value={vehiculoData.observaciones}
                onChange={(e) => handleVehiculoChange('observaciones', e.target.value)}
                placeholder="Detalles adicionales: golpe en el parachoques, rayón en la puerta, etc."
                rows={3}
                style={{ ...componentStyles.input.base, resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: theme.spacing[6],
          paddingTop: theme.spacing[5],
          borderTop: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div>
            {paso === 2 && (
              <button
                type="button"
                onClick={() => setPaso(1)}
                style={{
                  ...componentStyles.button.secondary,
                  padding: `${theme.spacing[3]} ${theme.spacing[4]}`
                }}
              >
                ← Volver
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing[3] }}>
            <button
              type="button"
              onClick={onCancelar}
              style={{
                ...componentStyles.button.secondary,
                padding: `${theme.spacing[3]} ${theme.spacing[4]}`
              }}
            >
              <X size={18} />
              Cancelar
            </button>
            
            {paso === 1 ? (
              <button
                type="button"
                onClick={handleSiguiente}
                style={{
                  ...componentStyles.button.primary,
                  padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                  backgroundColor: '#8b5cf6',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                }}
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            ) : (
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
                    Crear Cliente + Vehículo
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
