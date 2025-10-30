// --- 1. Importaciones ---
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './componentes/layout/Layout';
import { Home } from './pages/home/Home';
import LoginView from './componentes/formulario/LoginView';
import { CrearUsuario } from './componentes/formulario/CrearUsuario';
import { EditarUsuario } from './componentes/formulario/EditarUsuario';
import { Productos } from './componentes/productos/Productos'; // Importa la tabla de productos
import { Clientes } from './componentes/clientes/Clientes';     // Importa la tabla de usuarios
import { CrearProducto } from './componentes/formulario/CrearProducto';
import { EditarProd } from './componentes/formulario/EditarProd';
import Administrador from "./pages/administrador/Administrador";
import { Registro } from './componentes/formulario/Registro';
import ProductListByCategory from './pages/productos/ProductListByCategory';

// ... (Importa tus otros componentes: Contacto, Productos, etc.) ...
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><LoginView /></Layout>} />
        <Route path="/administrador" element={<Layout><Administrador /></Layout>} />
        <Route path="/clientes-admin" element={<Layout><Clientes /></Layout>} />
        <Route path="/crear-usuario" element={<Layout><CrearUsuario /></Layout>} />
        <Route path="/editar-usuario/:id" element={<Layout><EditarUsuario /></Layout>} />
        <Route path="/productos" element={<Layout><Productos /></Layout>} />
        <Route path="/crear-producto" element={<Layout><CrearProducto /></Layout>} />
        <Route path="/editar-producto/:id" element={<Layout><EditarProd /></Layout>} />
        <Route path="/registro" element={<Layout><Registro /></Layout>} />
        <Route path="/productos/categoria/:id" element={<Layout><ProductListByCategory /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;