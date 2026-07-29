// TallerPro Design System
// Industrial automotive workshop theme

export const theme = {
  // Color Palette
  colors: {
    // Primary - Trust & Professionalism
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    
    // Category Accents
    lubricentro: {
      bg: '#fff7ed',
      text: '#ea580c',
      border: '#fed7aa',
      main: '#ea580c'
    },
    mecanica: {
      bg: '#eff6ff',
      text: '#2563eb',
      border: '#bfdbfe',
      main: '#2563eb'
    },
    lavado: {
      bg: '#ecfeff',
      text: '#0891b2',
      border: '#a5f3fc',
      main: '#0891b2'
    },
    
    // Status Colors
    estado: {
      recibido: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
      proceso: { bg: '#fef3c7', text: '#92400e', dot: '#eab308' },
      calidad: { bg: '#f3e8ff', text: '#6b21a8', dot: '#a855f7' },
      listo: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
      entregado: { bg: '#f0fdf4', text: '#166534', dot: '#16a34a' },
      cancelado: { bg: '#fef2f2', text: '#991b1b', dot: '#ef4444' }
    },
    
    // Neutral
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    
    // Semantic
    success: { bg: '#dcfce7', text: '#166534', main: '#16a34a' },
    warning: { bg: '#fef3c7', text: '#92400e', main: '#ca8a04' },
    danger: { bg: '#fef2f2', text: '#991b1b', main: '#dc2626' }
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '28px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  
  // Spacing (8px grid)
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px'
  },
  
  // Border Radius
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px'
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
};

// Reusable component styles
export const componentStyles = {
  // Card styles
  card: {
    base: {
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.gray[200]}`,
      overflow: 'hidden' as const,
      boxShadow: theme.shadows.sm
    },
    header: {
      padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
      borderBottom: `1px solid ${theme.colors.gray[200]}`,
      backgroundColor: theme.colors.gray[50],
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3]
    },
    body: {
      padding: theme.spacing[5]
    }
  },
  
  // Input styles
  input: {
    base: {
      width: '100%',
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      border: `1.5px solid ${theme.colors.gray[200]}`,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.gray[800],
      backgroundColor: 'white',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      fontFamily: theme.typography.fontFamily.sans
    },
    focus: {
      borderColor: theme.colors.primary[500],
      boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`
    }
  },
  
  // Label styles
  label: {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.gray[600],
    marginBottom: theme.spacing[1],
    letterSpacing: '0.025em'
  },
  
  // Button styles
  button: {
    primary: {
      backgroundColor: theme.colors.primary[600],
      color: 'white',
      borderRadius: theme.borderRadius.md,
      border: 'none',
      cursor: 'pointer',
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.semibold,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      transition: 'background-color 0.2s',
      boxShadow: `0 2px 8px rgba(37, 99, 235, 0.3)`
    },
    secondary: {
      backgroundColor: 'white',
      color: theme.colors.gray[600],
      borderRadius: theme.borderRadius.md,
      border: `1.5px solid ${theme.colors.gray[200]}`,
      cursor: 'pointer',
      fontSize: theme.typography.fontSize.md,
      fontWeight: theme.typography.fontWeight.medium,
      transition: 'all 0.2s'
    }
  },
  
  // Badge styles
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold
    }
  },
  
  // Category icon container
  iconContainer: {
    width: '28px',
    height: '28px',
    borderRadius: theme.borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// Helper functions
export const getCategoriaColor = (categoria: string) => {
  const cat = categoria.toUpperCase();
  if (cat.includes('ACEITE') || cat.includes('LUBRICENTRO')) return theme.colors.lubricentro;
  if (cat.includes('FILTRO') || cat.includes('MECANICA') || cat.includes('REPUESTO')) return theme.colors.mecanica;
  if (cat.includes('LAVADO') || cat.includes('INSUMO')) return theme.colors.lavado;
  return theme.colors.mecanica;
};

export const getEstadoColor = (estado: string) => {
  const e = estado.toUpperCase().replace(/_/g, '');
  if (e === 'RECIBIDO') return theme.colors.estado.recibido;
  if (e === 'ENPROCESO') return theme.colors.estado.proceso;
  if (e === 'CONTROLCALIDAD') return theme.colors.estado.calidad;
  if (e === 'LISTO') return theme.colors.estado.listo;
  if (e === 'ENTREGADO') return theme.colors.estado.entregado;
  if (e === 'CANCELADO') return theme.colors.estado.cancelado;
  return theme.colors.estado.recibido;
};

export default theme;
