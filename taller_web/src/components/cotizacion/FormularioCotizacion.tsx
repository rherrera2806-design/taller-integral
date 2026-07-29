import React, { useState, useEffect } from 'react';
import { Producto, Servicio } from '../../types';
import { useCotizaciones } from '../../hooks/useCotizaciones';
import { productoService, servicioService } from '../../services/api';
import { SelectorClientes } from '../common/SelectorClientes';
import { SelectorVehiculos } from '../common/SelectorVehiculos';
import { theme, componentStyles, getCategoriaColor } from '../../utils/theme';
import { 
  Plus, Trash2, Save, Loader2, AlertCircle,
  Package, Wrench, Search, X, Fuel, Droplets, Settings, Sparkles
} from 'lucide-react';

interface FormularioCotizacionProps {
  onCreada: () => void;
  onCancelar: () => void;
}

interface ItemCotizacion {
  tipo_item: 'PRODUCTO' | 'SERVICIO';
  producto_id?: number;
  servicio_id?: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  descuento_porcentaje: number;
}

interface Cliente {
  cliente_id: number;
  rut_dni: string;
  nombre: string;
  telefono?: string;
  email?: string;
}

interface Vehiculo {
  vehiculo_id: number;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  cliente_id: number;
}

export function FormularioCotizacion({ onCreada, onCancelar }: FormularioCotizacionProps) {
  const { crearCotizacion } = useCotizaciones();
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodData, servData] = await Promise.all([
        productoService.getAll(),
        servicioService.getAll()
      ]);
      setProductos(prodData);
      setServicios(servData);
    } catch (err) {
      setError('Error al cargar catálogos');
    }
  };

  const handleAddProducto = (producto: Producto) => {
    const existe = items.find(i => i.tipo_item === 'PRODUCTO' && i.producto_id === producto.producto_id);
    if (existe) {
      setItems(items.map(i => 
        i.tipo_item === 'PRODUCTO' && i.producto_id === producto.producto_id
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));
    } else {
      setItems([...items, {
        tipo_item: 'PRODUCTO',
        producto_id: producto.producto_id,
        nombre: producto.nombre,
        cantidad: 1,
        precio_unitario: producto.precio_venta,
        descuento_porcentaje: 0
      }]);
    }
  };

  const handleAddServicio = (servicio: Servicio) => {
    const existe = items.find(i => i.tipo_item === 'SERVICIO' && i.servicio_id === servicio.servicio_id);
    if (!existe) {
      setItems([...items, {
        tipo_item: 'SERVICIO',
        servicio_id: servicio.servicio_id,
        nombre: servicio.nombre,
        cantidad: 1,
        precio_unitario: servicio.precio_base,
        descuento_porcentaje: 0
      }]);
    }
  };

  const handleUpdateItem = (index: number, field: keyof ItemCotizacion, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calcularSubtotal = (item: ItemCotizacion): number => {
    const subtotal = item.cantidad * item.precio_unitario;
    return subtotal - (subtotal * item.descuento_porcentaje / 100);
  };

  const calcularTotal = (): number => {
    return items.reduce((sum, item) => sum + calcularSubtotal(item), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteSeleccionado || !vehiculoSeleccionado) {
      setError('Seleccione un cliente y un vehículo');
      return;
    }

    if (items.length === 0) {
      setError('Agregue al menos un item a la cotización');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      await crearCotizacion({
        patente: vehiculoSeleccionado.patente,
        cliente_id: clienteSeleccionado.cliente_id,
        vehiculo_id: vehiculoSeleccionado.vehiculo_id,
        observaciones,
        items: items.map(item => ({
          tipo_item: item.tipo_item,
          producto_id: item.producto_id,
          servicio_id: item.servicio_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          descuento_porcentaje: item.descuento_porcentaje
        }))
      });
      onCreada();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cotización');
    } finally {
      setGuardando(false);
    }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.codigo_barras.includes(busquedaProducto)
  );

  const serviciosFiltrados = servicios.filter(s =>
    s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase()) ||
    s.categoria.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing[6] }}>
        
        {/* Sección: Datos del Cliente y Vehículo */}
        <div style={componentStyles.card.base}>
          <div style={componentStyles.card.header}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.primary[100]
            }}>
              <Package size={16} color={theme.colors.primary[600]} />
            </div>
            <span style={{ 
              fontSize: theme.typography.fontSize.lg, 
              fontWeight: theme.typography.fontWeight.semibold, 
              color: theme.colors.gray[800] 
            }}>
              Datos del Cliente y Vehículo
            </span>
          </div>
          
          <div style={componentStyles.card.body}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
              <SelectorClientes
                clienteSeleccionado={clienteSeleccionado}
                onSelect={setClienteSeleccionado}
                onLimpiar={() => setClienteSeleccionado(null)}
              />
              <SelectorVehiculos
                vehiculoSeleccionado={vehiculoSeleccionado}
                clienteId={clienteSeleccionado?.cliente_id}
                onSelect={setVehiculoSeleccionado}
                onLimpiar={() => setVehiculoSeleccionado(null)}
              />
            </div>
            <div style={{ marginTop: theme.spacing[4] }}>
              <label style={componentStyles.label}>Observaciones</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales para la cotización..."
                rows={2}
                style={{ ...componentStyles.input.base, resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
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

        {/* Catálogos y Items */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[6] }}>
          
          {/* Catálogo de Productos */}
          <div style={componentStyles.card.base}>
            <div style={{
              ...componentStyles.card.header,
              background: `linear-gradient(135deg, ${theme.colors.lubricentro.bg} 0%, white 100%)`
            }}>
              <div style={{
                ...componentStyles.iconContainer,
                backgroundColor: theme.colors.lubricentro.main
              }}>
                <Package size={14} color="white" />
              </div>
              <span style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800] 
              }}>
                Productos
              </span>
              <span style={{
                marginLeft: 'auto',
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: theme.colors.gray[100],
                borderRadius: theme.borderRadius.full,
                fontSize: '11px',
                color: theme.colors.gray[500]
              }}>
                {productos.length} items
              </span>
            </div>
            
            <div style={{ padding: theme.spacing[3] }}>
              <div style={{ position: 'relative', marginBottom: theme.spacing[3] }}>
                <Search size={16} color={theme.colors.gray[400]} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={busquedaProducto}
                  onChange={(e) => setBusquedaProducto(e.target.value)}
                  placeholder="Buscar producto..."
                  style={{
                    ...componentStyles.input.base,
                    paddingLeft: '34px',
                    fontSize: theme.typography.fontSize.sm,
                    padding: '8px 12px 8px 34px'
                  }}
                />
              </div>
              
              <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="scrollbar-thin">
                {productosFiltrados.map((producto) => {
                  const catColor = getCategoriaColor(producto.categoria);
                  return (
                    <div
                      key={producto.producto_id}
                      onClick={() => handleAddProducto(producto)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                        marginBottom: theme.spacing[1],
                        borderRadius: theme.borderRadius.md,
                        border: `1px solid ${theme.colors.gray[100]}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        backgroundColor: theme.colors.gray[50]
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                        e.currentTarget.style.borderColor = theme.colors.primary[200];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                        e.currentTarget.style.borderColor = theme.colors.gray[100];
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray[800], marginBottom: '2px' }}>
                          {producto.nombre}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: `2px ${theme.spacing[1]}`,
                            borderRadius: theme.borderRadius.sm,
                            fontSize: '10px',
                            fontWeight: theme.typography.fontWeight.semibold,
                            backgroundColor: catColor.bg,
                            color: catColor.text,
                            border: `1px solid ${catColor.border}`
                          }}>
                            {producto.categoria}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            color: producto.stock_actual <= producto.stock_minimo ? theme.colors.danger.main : theme.colors.gray[400]
                          }}>
                            Stock: {producto.stock_actual}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                        <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.gray[700] }}>
                          ${producto.precio_venta.toLocaleString('es-CL')}
                        </span>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: theme.colors.primary[100],
                          borderRadius: theme.borderRadius.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Plus size={12} color={theme.colors.primary[600]} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Catálogo de Servicios */}
          <div style={componentStyles.card.base}>
            <div style={{
              ...componentStyles.card.header,
              background: `linear-gradient(135deg, ${theme.colors.mecanica.bg} 0%, white 100%)`
            }}>
              <div style={{
                ...componentStyles.iconContainer,
                backgroundColor: theme.colors.mecanica.main
              }}>
                <Wrench size={14} color="white" />
              </div>
              <span style={{ 
                fontSize: theme.typography.fontSize.md, 
                fontWeight: theme.typography.fontWeight.semibold, 
                color: theme.colors.gray[800] 
              }}>
                Servicios
              </span>
              <span style={{
                marginLeft: 'auto',
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: theme.colors.gray[100],
                borderRadius: theme.borderRadius.full,
                fontSize: '11px',
                color: theme.colors.gray[500]
              }}>
                {servicios.length} items
              </span>
            </div>
            
            <div style={{ padding: theme.spacing[3] }}>
              <div style={{ position: 'relative', marginBottom: theme.spacing[3] }}>
                <Search size={16} color={theme.colors.gray[400]} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={busquedaServicio}
                  onChange={(e) => setBusquedaServicio(e.target.value)}
                  placeholder="Buscar servicio..."
                  style={{
                    ...componentStyles.input.base,
                    paddingLeft: '34px',
                    fontSize: theme.typography.fontSize.sm,
                    padding: '8px 12px 8px 34px'
                  }}
                />
              </div>
              
              <div style={{ maxHeight: '280px', overflowY: 'auto' }} className="scrollbar-thin">
                {serviciosFiltrados.map((servicio) => {
                  const catColor = getCategoriaColor(servicio.categoria);
                  return (
                    <div
                      key={servicio.servicio_id}
                      onClick={() => handleAddServicio(servicio)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                        marginBottom: theme.spacing[1],
                        borderRadius: theme.borderRadius.md,
                        border: `1px solid ${theme.colors.gray[100]}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        backgroundColor: theme.colors.gray[50]
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.success.bg;
                        e.currentTarget.style.borderColor = theme.colors.success.main;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                        e.currentTarget.style.borderColor = theme.colors.gray[100];
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray[800], marginBottom: '2px' }}>
                          {servicio.nombre}
                        </div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: `2px ${theme.spacing[1]}`,
                          borderRadius: theme.borderRadius.sm,
                          fontSize: '10px',
                          fontWeight: theme.typography.fontWeight.semibold,
                          backgroundColor: catColor.bg,
                          color: catColor.text,
                          border: `1px solid ${catColor.border}`
                        }}>
                          {servicio.categoria}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                        <span style={{ fontSize: theme.typography.fontSize.sm, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.gray[700] }}>
                          ${servicio.precio_base.toLocaleString('es-CL')}
                        </span>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: theme.colors.success.bg,
                          borderRadius: theme.borderRadius.sm,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Plus size={12} color={theme.colors.success.main} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Items Seleccionados */}
        <div style={componentStyles.card.base}>
          <div style={componentStyles.card.header}>
            <div style={{
              ...componentStyles.iconContainer,
              backgroundColor: theme.colors.primary[100]
            }}>
              <Package size={16} color={theme.colors.primary[600]} />
            </div>
            <span style={{ 
              fontSize: theme.typography.fontSize.lg, 
              fontWeight: theme.typography.fontWeight.semibold, 
              color: theme.colors.gray[800] 
            }}>
              Items de la Cotización
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.primary[100],
              borderRadius: theme.borderRadius.full,
              fontSize: '12px',
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary[700]
            }}>
              {items.length} items
            </span>
          </div>
          
          <div style={componentStyles.card.body}>
            {items.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing[10],
                border: `2px dashed ${theme.colors.gray[200]}`,
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.gray[50]
              }}>
                <Search size={32} color={theme.colors.gray[300]} style={{ margin: `0 auto ${theme.spacing[3]}` }} />
                <p style={{ color: theme.colors.gray[400], fontSize: theme.typography.fontSize.md, margin: 0 }}>
                  Seleccione productos o servicios del catálogo
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                {items.map((item, index) => {
                  const catColor = getCategoriaColor(item.tipo_item === 'PRODUCTO' ? 'ACEITES' : 'MECANICA');
                  return (
                    <div 
                      key={index}
                      style={{
                        padding: theme.spacing[4],
                        backgroundColor: theme.colors.gray[50],
                        borderRadius: theme.borderRadius.xl,
                        border: `1px solid ${theme.colors.gray[200]}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: theme.spacing[3] }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                            borderRadius: theme.borderRadius.md,
                            fontSize: '11px',
                            fontWeight: theme.typography.fontWeight.semibold,
                            backgroundColor: item.tipo_item === 'PRODUCTO' ? theme.colors.primary[100] : theme.colors.success.bg,
                            color: item.tipo_item === 'PRODUCTO' ? theme.colors.primary[700] : theme.colors.success.text
                          }}>
                            {item.tipo_item === 'PRODUCTO' ? <Package size={12} /> : <Wrench size={12} />}
                            {item.tipo_item}
                          </span>
                          <span style={{ fontSize: theme.typography.fontSize.md, fontWeight: theme.typography.fontWeight.medium, color: theme.colors.gray[800] }}>
                            {item.nombre}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          style={{
                            padding: '4px',
                            borderRadius: theme.borderRadius.md,
                            border: 'none',
                            backgroundColor: theme.colors.danger.bg,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} color={theme.colors.danger.main} />
                        </button>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing[3] }}>
                        <div>
                          <label style={{ ...componentStyles.label, fontSize: '11px' }}>Cantidad</label>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => handleUpdateItem(index, 'cantidad', parseInt(e.target.value) || 1)}
                            min="1"
                            style={{ ...componentStyles.input.base, padding: '8px 10px', fontSize: theme.typography.fontSize.sm }}
                          />
                        </div>
                        <div>
                          <label style={{ ...componentStyles.label, fontSize: '11px' }}>Precio Unit.</label>
                          <input
                            type="number"
                            value={item.precio_unitario}
                            onChange={(e) => handleUpdateItem(index, 'precio_unitario', parseInt(e.target.value) || 0)}
                            style={{ ...componentStyles.input.base, padding: '8px 10px', fontSize: theme.typography.fontSize.sm }}
                          />
                        </div>
                        <div>
                          <label style={{ ...componentStyles.label, fontSize: '11px' }}>Descuento %</label>
                          <input
                            type="number"
                            value={item.descuento_porcentaje}
                            onChange={(e) => handleUpdateItem(index, 'descuento_porcentaje', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            style={{ ...componentStyles.input.base, padding: '8px 10px', fontSize: theme.typography.fontSize.sm }}
                          />
                        </div>
                      </div>
                      
                      <div style={{
                        marginTop: theme.spacing[3],
                        paddingTop: theme.spacing[2],
                        borderTop: `1px solid ${theme.colors.gray[200]}`,
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}>
                        <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[500] }}>Subtotal: </span>
                        <span style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.gray[900], marginLeft: theme.spacing[1] }}>
                          ${calcularSubtotal(item).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Total y Acciones */}
        <div style={{
          ...componentStyles.card.base,
          padding: theme.spacing[5],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[500], marginBottom: theme.spacing[1] }}>Total Cotización</div>
            <div style={{ 
              fontSize: theme.typography.fontSize['4xl'], 
              fontWeight: theme.typography.fontWeight.extrabold, 
              color: theme.colors.gray[900], 
              letterSpacing: '-0.025em',
              fontFamily: theme.typography.fontFamily.mono
            }}>
              ${calcularTotal().toLocaleString('es-CL')}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing[3] }}>
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
              disabled={guardando || items.length === 0}
              style={{
                ...componentStyles.button.primary,
                padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
                opacity: guardando || items.length === 0 ? 0.5 : 1,
                cursor: guardando || items.length === 0 ? 'not-allowed' : 'pointer'
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
                  Crear Cotización
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
