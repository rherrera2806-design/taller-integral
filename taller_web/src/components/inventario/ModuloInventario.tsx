import React, { useState, useEffect } from 'react';
import { Producto, Servicio } from '../../types';
import { productoService, servicioService } from '../../services/api';
import { theme, componentStyles, getCategoriaColor } from '../../utils/theme';
import { FormularioProducto } from './FormularioProducto';
import { FormularioServicio } from './FormularioServicio';
import { 
  Package, Wrench, Plus, RefreshCw, Search, 
  Edit2, Trash2, AlertTriangle, Loader2,
  DollarSign, Hash, Tag, Clock
} from 'lucide-react';

type TabType = 'productos' | 'servicios';
type VistaType = 'lista' | 'formulario';

export function ModuloInventario() {
  const [tabActiva, setTabActiva] = useState<TabType>('productos');
  const [vista, setVista] = useState<VistaType>('lista');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [servicioEditando, setServicioEditando] = useState<Servicio | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [prodData, servData] = await Promise.all([
        productoService.getAll(),
        servicioService.getAll()
      ]);
      setProductos(prodData);
      setServicios(servData);
      setError(null);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarProducto = async (data: Partial<Producto>) => {
    // Simular guardado - en producción llamaría a la API
    console.log('Guardar producto:', data);
    await cargarDatos();
    setVista('lista');
    setProductoEditando(null);
  };

  const handleGuardarServicio = async (data: Partial<Servicio>) => {
    // Simular guardado - en producción llamaría a la API
    console.log('Guardar servicio:', data);
    await cargarDatos();
    setVista('lista');
    setServicioEditando(null);
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoEditando(producto);
    setVista('formulario');
  };

  const handleEditarServicio = (servicio: Servicio) => {
    setServicioEditando(servicio);
    setVista('formulario');
  };

  const handleNuevoItem = () => {
    setProductoEditando(null);
    setServicioEditando(null);
    setVista('formulario');
  };

  const handleCancelar = () => {
    setVista('lista');
    setProductoEditando(null);
    setServicioEditando(null);
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const productosConStockBajo = productos.filter(p => p.stock_actual <= p.stock_minimo);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '400px' 
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `3px solid ${theme.colors.gray[200]}`,
          borderTopColor: theme.colors.primary[500],
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Inventario
          </h2>
          <p style={{ 
            color: theme.colors.gray[500], 
            marginTop: theme.spacing[1],
            fontSize: theme.typography.fontSize.md,
            margin: '4px 0 0 0'
          }}>
            Gestiona productos y servicios del taller
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
          <button
            onClick={cargarDatos}
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
          
          {vista === 'lista' && (
            <button
              onClick={handleNuevoItem}
              style={{
                ...componentStyles.button.primary,
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`
              }}
            >
              <Plus size={18} />
              {tabActiva === 'productos' ? 'Nuevo Producto' : 'Nuevo Servicio'}
            </button>
          )}
        </div>
      </div>

      {/* Alerta de Stock Bajo */}
      {tabActiva === 'productos' && productosConStockBajo.length > 0 && vista === 'lista' && (
        <div style={{
          marginBottom: theme.spacing[4],
          padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
          backgroundColor: theme.colors.warning.bg,
          border: `1px solid ${theme.colors.warning.main}30`,
          borderRadius: theme.borderRadius.lg,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[3]
        }}>
          <AlertTriangle size={20} color={theme.colors.warning.main} />
          <div>
            <span style={{ 
              fontSize: theme.typography.fontSize.sm, 
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.warning.text 
            }}>
              {productosConStockBajo.length} productos con stock bajo
            </span>
            <span style={{ 
              fontSize: theme.typography.fontSize.sm, 
              color: theme.colors.gray[600],
              marginLeft: theme.spacing[2]
            }}>
              • Revisar inventario
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: theme.spacing[1],
        marginBottom: theme.spacing[5],
        backgroundColor: theme.colors.gray[100],
        padding: theme.spacing[1],
        borderRadius: theme.borderRadius.lg,
        width: 'fit-content'
      }}>
        <button
          onClick={() => { setTabActiva('productos'); setVista('lista'); }}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            borderRadius: theme.borderRadius.md,
            border: 'none',
            backgroundColor: tabActiva === 'productos' ? 'white' : 'transparent',
            color: tabActiva === 'productos' ? theme.colors.primary[700] : theme.colors.gray[500],
            fontWeight: tabActiva === 'productos' ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
            fontSize: theme.typography.fontSize.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            boxShadow: tabActiva === 'productos' ? theme.shadows.sm : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Package size={16} />
          Productos
          <span style={{
            padding: `2px 8px`,
            backgroundColor: tabActiva === 'productos' ? theme.colors.primary[100] : theme.colors.gray[200],
            borderRadius: theme.borderRadius.full,
            fontSize: '11px',
            fontWeight: theme.typography.fontWeight.semibold
          }}>
            {productos.length}
          </span>
        </button>
        
        <button
          onClick={() => { setTabActiva('servicios'); setVista('lista'); }}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            borderRadius: theme.borderRadius.md,
            border: 'none',
            backgroundColor: tabActiva === 'servicios' ? 'white' : 'transparent',
            color: tabActiva === 'servicios' ? theme.colors.primary[700] : theme.colors.gray[500],
            fontWeight: tabActiva === 'servicios' ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
            fontSize: theme.typography.fontSize.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            boxShadow: tabActiva === 'servicios' ? theme.shadows.sm : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Wrench size={16} />
          Servicios
          <span style={{
            padding: `2px 8px`,
            backgroundColor: tabActiva === 'servicios' ? theme.colors.primary[100] : theme.colors.gray[200],
            borderRadius: theme.borderRadius.full,
            fontSize: '11px',
            fontWeight: theme.typography.fontWeight.semibold
          }}>
            {servicios.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {vista === 'formulario' ? (
        tabActiva === 'productos' ? (
          <FormularioProducto
            producto={productoEditando}
            onGuardar={handleGuardarProducto}
            onCancelar={handleCancelar}
          />
        ) : (
          <FormularioServicio
            servicio={servicioEditando}
            onGuardar={handleGuardarServicio}
            onCancelar={handleCancelar}
          />
        )
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
                placeholder={`Buscar ${tabActiva === 'productos' ? 'productos' : 'servicios'}...`}
                style={{
                  ...componentStyles.input.base,
                  paddingLeft: '40px',
                  border: 'none',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          {/* Product List */}
          {tabActiva === 'productos' && (
            <div style={componentStyles.card.base}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: theme.colors.gray[50], 
                      borderBottom: `1px solid ${theme.colors.gray[200]}` 
                    }}>
                      {['Código', 'Nombre', 'Categoría', 'Stock', 'Precio Venta', 'Acciones'].map(header => (
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
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ 
                          padding: theme.spacing[10], 
                          textAlign: 'center', 
                          color: theme.colors.gray[400] 
                        }}>
                          No se encontraron productos
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((producto) => {
                        const catColor = getCategoriaColor(producto.categoria);
                        const stockBajo = producto.stock_actual <= producto.stock_minimo;
                        
                        return (
                          <tr key={producto.producto_id} style={{ 
                            borderBottom: `1px solid ${theme.colors.gray[100]}`,
                            backgroundColor: stockBajo ? theme.colors.warning.bg + '50' : 'transparent'
                          }}>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                              <span style={{ 
                                fontFamily: theme.typography.fontFamily.mono, 
                                fontSize: theme.typography.fontSize.sm,
                                color: theme.colors.gray[600]
                              }}>
                                {producto.codigo_barras}
                              </span>
                            </td>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                              <span style={{ 
                                fontWeight: theme.typography.fontWeight.medium,
                                color: theme.colors.gray[800]
                              }}>
                                {producto.nombre}
                              </span>
                            </td>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
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
                                {producto.categoria}
                              </span>
                            </td>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                                <span style={{
                                  fontWeight: theme.typography.fontWeight.semibold,
                                  color: stockBajo ? theme.colors.danger.main : theme.colors.gray[800]
                                }}>
                                  {producto.stock_actual}
                                </span>
                                {stockBajo && (
                                  <AlertTriangle size={14} color={theme.colors.danger.main} />
                                )}
                              </div>
                            </td>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                              <span style={{ 
                                fontWeight: theme.typography.fontWeight.semibold,
                                color: theme.colors.gray[800]
                              }}>
                                ${producto.precio_venta.toLocaleString('es-CL')}
                              </span>
                            </td>
                            <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[4]}` }}>
                              <div style={{ display: 'flex', gap: theme.spacing[1] }}>
                                <button
                                  onClick={() => handleEditarProducto(producto)}
                                  style={{
                                    padding: '6px',
                                    borderRadius: theme.borderRadius.md,
                                    border: 'none',
                                    backgroundColor: theme.colors.primary[100],
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit2 size={14} color={theme.colors.primary[600]} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Service List */}
          {tabActiva === 'servicios' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: theme.spacing[4]
            }}>
              {serviciosFiltrados.length === 0 ? (
                <div style={{
                  ...componentStyles.card.base,
                  padding: theme.spacing[10],
                  textAlign: 'center',
                  color: theme.colors.gray[400]
                }}>
                  No se encontraron servicios
                </div>
              ) : (
                serviciosFiltrados.map((servicio) => {
                  const catColor = getCategoriaColor(servicio.categoria);
                  
                  return (
                    <div 
                      key={servicio.servicio_id} 
                      style={{
                        ...componentStyles.card.base,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = theme.shadows.lg;
                        e.currentTarget.style.borderColor = catColor.main;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = theme.shadows.sm;
                        e.currentTarget.style.borderColor = theme.colors.gray[200];
                      }}
                    >
                      <div style={{ padding: theme.spacing[4] }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          justifyContent: 'space-between',
                          marginBottom: theme.spacing[3]
                        }}>
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
                            {servicio.categoria}
                          </span>
                          <button
                            onClick={() => handleEditarServicio(servicio)}
                            style={{
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: 'none',
                              backgroundColor: theme.colors.gray[100],
                              cursor: 'pointer'
                            }}
                          >
                            <Edit2 size={14} color={theme.colors.gray[600]} />
                          </button>
                        </div>
                        
                        <h3 style={{ 
                          fontSize: theme.typography.fontSize.lg, 
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.gray[800],
                          margin: `0 0 ${theme.spacing[2]} 0`
                        }}>
                          {servicio.nombre}
                        </h3>
                        
                        {servicio.descripcion && (
                          <p style={{ 
                            fontSize: theme.typography.fontSize.sm, 
                            color: theme.colors.gray[500],
                            margin: `0 0 ${theme.spacing[3]} 0`,
                            lineHeight: theme.typography.lineHeight.relaxed
                          }}>
                            {servicio.descripcion}
                          </p>
                        )}
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          paddingTop: theme.spacing[3],
                          borderTop: `1px solid ${theme.colors.gray[100]}`
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                            <DollarSign size={16} color={theme.colors.primary[600]} />
                            <span style={{ 
                              fontSize: theme.typography.fontSize.xl, 
                              fontWeight: theme.typography.fontWeight.bold,
                              color: theme.colors.primary[700]
                            }}>
                              ${servicio.precio_base.toLocaleString('es-CL')}
                            </span>
                          </div>
                          
                          {servicio.duracion_estimada_minutos && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: theme.spacing[1],
                              color: theme.colors.gray[400],
                              fontSize: theme.typography.fontSize.sm
                            }}>
                              <Clock size={14} />
                              <span>{servicio.duracion_estimada_minutos} min</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
