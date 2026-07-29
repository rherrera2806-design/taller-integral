import React, { useState } from 'react';
import { theme, componentStyles } from '../../utils/theme';
import { 
  LayoutDashboard, 
  Search,
  Package,
  Menu,
  X,
  Car,
  FileText,
  Wrench,
  Activity,
  Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'kanban', label: 'Tablero OT', icon: LayoutDashboard, description: 'Gestión de órdenes' },
  { id: 'clientes', label: 'Clientes', icon: Users, description: 'Clientes y vehículos' },
  { id: 'historial', label: 'Historial', icon: Search, description: 'Buscar vehículos' },
  { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText, description: 'Presupuestos' },
  { id: 'productos', label: 'Inventario', icon: Package, description: 'Stock y productos' },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: theme.colors.gray[50],
      fontFamily: theme.typography.fontFamily.sans
    }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '72px',
        backgroundColor: 'white',
        borderRight: `1px solid ${theme.colors.gray[200]}`,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: theme.shadows.sm
      }}>
        {/* Logo */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          padding: sidebarOpen ? '0 16px' : '0',
          borderBottom: `1px solid ${theme.colors.gray[200]}`
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[800]} 100%)`,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
              }}>
                <Wrench size={18} color="white" />
              </div>
              <div>
                <span style={{ 
                  fontWeight: theme.typography.fontWeight.extrabold, 
                  fontSize: '18px', 
                  color: theme.colors.gray[900],
                  letterSpacing: '-0.025em',
                  display: 'block',
                  lineHeight: '1.2'
                }}>
                  TallerPro
                </span>
                <span style={{
                  fontSize: '10px',
                  color: theme.colors.gray[400],
                  fontWeight: theme.typography.fontWeight.medium,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Sistema Integral
                </span>
              </div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              borderRadius: theme.borderRadius.md,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.gray[400],
              transition: 'color 0.2s'
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: theme.spacing[3], 
          display: 'flex', 
          flexDirection: 'column', 
          gap: theme.spacing[1] 
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[3],
                  padding: sidebarOpen ? '10px 12px' : '10px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  borderRadius: theme.borderRadius.lg,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? theme.colors.primary[50] : 'transparent',
                  color: isActive ? theme.colors.primary[700] : theme.colors.gray[500],
                  fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                  fontSize: theme.typography.fontSize.md
                }}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <div style={{ textAlign: 'left' }}>
                    <div>{item.label}</div>
                    <div style={{
                      fontSize: '11px',
                      color: isActive ? theme.colors.primary[400] : theme.colors.gray[400],
                      fontWeight: theme.typography.fontWeight.normal
                    }}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        {sidebarOpen && (
          <div style={{ 
            padding: theme.spacing[4], 
            borderTop: `1px solid ${theme.colors.gray[200]}`
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.success.bg,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: theme.colors.success.main,
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '12px',
                color: theme.colors.success.text,
                fontWeight: theme.typography.fontWeight.medium
              }}>
                Sistema en línea
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ 
          height: '64px', 
          backgroundColor: 'white', 
          borderBottom: `1px solid ${theme.colors.gray[200]}`,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: `0 ${theme.spacing[6]}`,
          flexShrink: 0,
          boxShadow: theme.shadows.sm
        }}>
          <div>
            <h1 style={{ 
              fontSize: theme.typography.fontSize.xl, 
              fontWeight: theme.typography.fontWeight.bold, 
              color: theme.colors.gray[900],
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              {menuItems.find(m => m.id === currentPage)?.label || 'Panel'}
            </h1>
            <p style={{
              fontSize: '12px',
              color: theme.colors.gray[400],
              margin: '2px 0 0 0'
            }}>
              {menuItems.find(m => m.id === currentPage)?.description}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[4] }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.gray[50],
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.gray[500]
            }}>
              <Activity size={14} />
              <span>Actualización en tiempo real</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: theme.spacing[6]
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
