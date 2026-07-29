import React, { useState, useEffect } from 'react';
import { clienteService } from '../../services/api';
import { theme, componentStyles } from '../../utils/theme';
import { FormularioClienteVehiculo } from './FormularioClienteVehiculo';
import { 
  Users, Plus, RefreshCw, Search, Edit2, 
  Car, Phone, Mail, MapPin, Loader2,
  User, CreditCard, ChevronRight
} from 'lucide-react';

interface Cliente {
  cliente_id: number;
  rut_dni: string;
  nombre: string;
  email?: string;
  telefono: string;
  direccion?: string;
  comuna?: string;
  ciudad?: string;
  vehiculos?: Vehiculo[];
}

interface Vehiculo {
  vehiculo_id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
}

type VistaType = 'lista' | 'formulario';

export function ModuloClientes() {
  const [vista, setVista] = useState<VistaType>('lista');
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteExpandido, setClienteExpandido] = useState<number | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getAll();
      console.log('[Clientes] Data:', data, 'isArray:', Array.isArray(data));
      setClientes(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Error al cargar clientes');
      console.error('[Clientes] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.rut_dni.includes(busqueda) ||
    c.telefono.includes(busqueda)
  );

  const handleGuardarClienteVehiculo = async (cliente: any, vehiculo: any) => {
    setGuardando(true);
    setError(null);
    setExito(null);
    
    try {
      const resultado = await clienteService.createConVehiculo(cliente, vehiculo);
      console.log('Guardado:', resultado);
      
      setExito(`Cliente "${cliente.nombre}" y vehículo ${vehiculo.patente} creados correctamente`);
      
      // Recargar lista
      await cargarClientes();
      
      // Volver a la lista después de un momento
      setTimeout(() => {
        setVista('lista');
        setExito(null);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Error al guardar cliente y vehículo');
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            Clientes
          </h2>
          <p style={{ 
            color: theme.colors.gray[500], 
            marginTop: theme.spacing[1],
            fontSize: theme.typography.fontSize.md,
            margin: '4px 0 0 0'
          }}>
            Gestiona clientes y sus vehículos
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
          {vista === 'lista' && (
            <>
              <button
                onClick={cargarClientes}
                style={{
                  ...componentStyles.button.secondary,
                  padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2]
                }}
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setVista('formulario')}
                style={{
                  ...componentStyles.button.primary,
                  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                  backgroundColor: '#8b5cf6',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                }}
              >
                <Plus size={18} />
                Nuevo Cliente + Vehículo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {exito && (
        <div style={{
          marginBottom: theme.spacing[4],
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.success.bg,
          border: `1px solid ${theme.colors.success.main}30`,
          borderRadius: theme.borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2]
        }}>
          <User size={18} color={theme.colors.success.main} />
          <span style={{ color: theme.colors.success.text, fontSize: theme.typography.fontSize.md }}>
            {exito}
          </span>
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: theme.spacing[4],
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.danger.bg,
          border: `1px solid ${theme.colors.danger.main}30`,
          borderRadius: theme.borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[2]
        }}>
          <User size={18} color={theme.colors.danger.main} />
          <span style={{ color: theme.colors.danger.text, fontSize: theme.typography.fontSize.md }}>
            {error}
          </span>
        </div>
      )}

      {/* Content */}
      {vista === 'formulario' ? (
        <FormularioClienteVehiculo
          onGuardar={handleGuardarClienteVehiculo}
          onCancelar={() => setVista('lista')}
        />
      ) : (
        <>
          {/* Search Bar */}
          <div style={{
            ...componentStyles.card.base,
            marginBottom: theme.spacing[4],
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`
          }}>
            <div style={{ position: 'relative' }}>
              <Search 
                size={18} 
                color={theme.colors.gray[400]}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, RUT o teléfono..."
                style={{
                  ...componentStyles.input.base,
                  paddingLeft: '40px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: theme.spacing[4],
            marginBottom: theme.spacing[5]
          }}>
            <div style={{
              ...componentStyles.card.base,
              padding: theme.spacing[4],
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[3]
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f3e8ff',
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} color="#8b5cf6" />
              </div>
              <div>
                <div style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.gray[900] }}>
                  {clientes.length}
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.gray[400] }}>Clientes</div>
              </div>
            </div>
            
            <div style={{
              ...componentStyles.card.base,
              padding: theme.spacing[4],
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[3]
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: theme.colors.primary[100],
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Car size={20} color={theme.colors.primary[600]} />
              </div>
              <div>
                <div style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.gray[900] }}>
                  {clientes.reduce((sum, c) => sum + (c.vehiculos?.length || 0), 0)}
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.gray[400] }}>Vehículos</div>
              </div>
            </div>
            
            <div style={{
              ...componentStyles.card.base,
              padding: theme.spacing[4],
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[3]
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: theme.colors.success.bg,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={20} color={theme.colors.success.main} />
              </div>
              <div>
                <div style={{ fontSize: theme.typography.fontSize['2xl'], fontWeight: theme.typography.fontWeight.bold, color: theme.colors.gray[900] }}>
                  {clientes.filter(c => c.vehiculos && c.vehiculos.length > 0).length}
                </div>
                <div style={{ fontSize: '12px', color: theme.colors.gray[400] }}>Con vehículos</div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: theme.spacing[10]
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: `3px solid ${theme.colors.gray[200]}`,
                borderTopColor: '#8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
          )}

          {/* Client List */}
          {!loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              {clientesFiltrados.length === 0 ? (
                <div style={{
                  ...componentStyles.card.base,
                  padding: theme.spacing[10],
                  textAlign: 'center',
                  color: theme.colors.gray[400]
                }}>
                  <Users size={48} color={theme.colors.gray[200]} style={{ margin: `0 auto ${theme.spacing[3]}` }} />
                  <p style={{ margin: 0 }}>
                    {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                  </p>
                  {!busqueda && (
                    <button
                      onClick={() => setVista('formulario')}
                      style={{
                        ...componentStyles.button.primary,
                        margin: `${theme.spacing[4]} auto 0`,
                        backgroundColor: '#8b5cf6'
                      }}
                    >
                      <Plus size={18} />
                      Crear primer cliente
                    </button>
                  )}
                </div>
              ) : (
                clientesFiltrados.map(cliente => (
                  <div 
                    key={cliente.cliente_id}
                    style={{
                      ...componentStyles.card.base,
                      overflow: 'visible'
                    }}
                  >
                    <div 
                      style={{
                        padding: theme.spacing[4],
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[4],
                        cursor: 'pointer'
                      }}
                      onClick={() => setClienteExpandido(
                        clienteExpandido === cliente.cliente_id ? null : cliente.cliente_id
                      )}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                        borderRadius: theme.borderRadius.xl,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: theme.typography.fontWeight.bold,
                        fontSize: theme.typography.fontSize.lg
                      }}>
                        {cliente.nombre.charAt(0)}
                      </div>
                      
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: theme.typography.fontSize.lg, 
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.gray[900]
                        }}>
                          {cliente.nombre}
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: theme.spacing[3],
                          marginTop: '4px'
                        }}>
                          <span style={{
                            fontFamily: theme.typography.fontFamily.mono,
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.gray[500]
                          }}>
                            {cliente.rut_dni}
                          </span>
                          <span style={{ color: theme.colors.gray[300] }}>•</span>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: theme.typography.fontSize.sm,
                            color: theme.colors.gray[500]
                          }}>
                            <Phone size={12} />
                            {cliente.telefono}
                          </span>
                          {cliente.vehiculos && cliente.vehiculos.length > 0 && (
                            <>
                              <span style={{ color: theme.colors.gray[300] }}>•</span>
                              <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.primary[600]
                              }}>
                                <Car size={12} />
                                {cliente.vehiculos.length} vehículo{cliente.vehiculos.length > 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Expand Icon */}
                      <ChevronRight 
                        size={20} 
                        color={theme.colors.gray[400]}
                        style={{
                          transform: clienteExpandido === cliente.cliente_id ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s'
                        }}
                      />
                    </div>
                    
                    {/* Expanded Content - Vehicles */}
                    {clienteExpandido === cliente.cliente_id && cliente.vehiculos && cliente.vehiculos.length > 0 && (
                      <div style={{
                        padding: `0 ${theme.spacing[4]} ${theme.spacing[4]}`,
                        marginLeft: '64px'
                      }}>
                        <div style={{
                          backgroundColor: theme.colors.gray[50],
                          borderRadius: theme.borderRadius.xl,
                          padding: theme.spacing[3]
                        }}>
                          <h4 style={{ 
                            fontSize: theme.typography.fontSize.sm, 
                            fontWeight: theme.typography.fontWeight.semibold, 
                            color: theme.colors.gray[500],
                            margin: `0 0 ${theme.spacing[2]} 0`,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Vehículos
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                            {cliente.vehiculos.map((vehiculo: any) => (
                              <div 
                                key={vehiculo.vehiculo_id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: theme.spacing[3],
                                  padding: theme.spacing[2],
                                  backgroundColor: 'white',
                                  borderRadius: theme.borderRadius.lg,
                                  border: `1px solid ${theme.colors.gray[200]}`
                                }}
                              >
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: theme.colors.primary[100],
                                  borderRadius: theme.borderRadius.md,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Car size={16} color={theme.colors.primary[600]} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <span style={{
                                    fontFamily: theme.typography.fontFamily.mono,
                                    fontWeight: theme.typography.fontWeight.bold,
                                    color: theme.colors.gray[800]
                                  }}>
                                    {vehiculo.patente}
                                  </span>
                                  <span style={{
                                    fontSize: theme.typography.fontSize.sm,
                                    color: theme.colors.gray[500],
                                    marginLeft: theme.spacing[2]
                                  }}>
                                    {vehiculo.marca} {vehiculo.modelo} • {vehiculo.anio}
                                  </span>
                                </div>
                                {vehiculo.color && (
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: theme.spacing[1]
                                  }}>
                                    <div style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      backgroundColor: vehiculo.color.toLowerCase() === 'blanco' ? '#ffffff' : 
                                                      vehiculo.color.toLowerCase() === 'negro' ? '#1e293b' :
                                                      vehiculo.color.toLowerCase() === 'plata' ? '#94a3b8' :
                                                      vehiculo.color.toLowerCase() === 'rojo' ? '#ef4444' :
                                                      vehiculo.color.toLowerCase() === 'azul' ? '#3b82f6' :
                                                      '#94a3b8',
                                      border: `1px solid ${theme.colors.gray[300]}`
                                    }} />
                                    <span style={{
                                      fontSize: theme.typography.fontSize.sm,
                                      color: theme.colors.gray[500]
                                    }}>
                                      {vehiculo.color}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
