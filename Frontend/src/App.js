//import { login } from './Login';
import './App.css';
//import './assets/css/App.css';
//import React from 'react';
import { Login } from './Login'; 
import { UsuarioForm } from './UsuarioForm';
import { UsuarioTable } from './UsuarioTable';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VentaForm from './VentaForm';
import VentaTable from './VentaTable';
import NavBar from './NavBarP';
import ProveedorForm from './ProveedorForm';
import ProveedorTable from './ProveedorTable';
import ProductoForm from './ProductoForm';
import ProductoTable from './ProductoTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<NavBar />} />
        <Route path="/Usuario" element={<UsuarioForm />} />
        <Route path="/Usuario-vista" element={<UsuarioTable />} />
        <Route path="/Venta" element={<VentaForm />} />
        <Route path="/Venta-vista" element={<VentaTable />} />
        <Route path="/Proveedor" element={<ProveedorForm />} />
        <Route path="/Proveedor-vista" element={<ProveedorTable/>} />
        <Route path="/Producto" element={<ProductoForm />} />
        <Route path="/Producto-vista" element={<ProductoTable />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Router>
  );
}

export default App;
