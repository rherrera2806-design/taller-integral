import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { BuscadorHistorial } from './components/historial/BuscadorHistorial';
import { ModuloCotizacion } from './components/cotizacion/ModuloCotizacion';
import { ModuloInventario } from './components/inventario/ModuloInventario';
import { ModuloClientes } from './components/clientes/ModuloClientes';

function App() {
  const [currentPage, setCurrentPage] = useState('kanban');

  const renderPage = () => {
    switch (currentPage) {
      case 'kanban':
        return <KanbanBoard />;
      case 'clientes':
        return <ModuloClientes />;
      case 'historial':
        return <BuscadorHistorial />;
      case 'cotizaciones':
        return <ModuloCotizacion />;
      case 'productos':
        return <ModuloInventario />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
