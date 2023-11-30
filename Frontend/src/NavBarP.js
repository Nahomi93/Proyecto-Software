import React from "react"
import './App.css'
import fondoImagen from './images/logo_pipoca.png';  // Importa la imagen
export default function NavBar() {
    const estiloDeFondo = {
        backgroundImage: `url(${fondoImagen})`, // Utiliza la imagen importada
        backgroundSize: '100% 100%',  // Ajusta la imagen a la altura y ancho de la pantalla
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '92.3vh', // Ajusta según sea necesario
        // Otros estilos según tus necesidades
    };
    const handleLogout = () => {

        console.log("se borro")
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("ID");
      };
    return (
        <>
            <div class="barra">
                <nav class="navbar navbar-expand-lg navbar-dark">
                    <div class="container-fluid">
                        
                        <a href="" class="navbar-brand text-info fw-semibold fs-4">TIENDA DON PIPOCA</a>
                        
                        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuLateral">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <section class="offcanvas offcanvas-start" id="menuLateral" tabindex="-1">
                            <div class="offcanvas-header" data-bs-theme="dark">
                                <h5 class="offcanvas-title text-info">TIENDA DON PIPOCA</h5>
                                <button class="btn-close" type="button" aria-label="Close" data-bs-dismiss="offcanvas"></button>
                            </div>

                            <div class="offcanvas-body d-flex flex-column justify-content-between px-0">
                                <ul class="navbar-nav fs-5 justify-content-evenly">
                                    <li class="nav-item p-3 py-md-1 dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">PRODUCTOS</a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/Producto">Registrar Productos</a></li>
                                            <li><a class="dropdown-item" href="/Producto-vista">Listar Productos</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item p-3 py-md-1 dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">VENTAS</a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/Venta">Registrar Venta</a></li>
                                            <li><a class="dropdown-item" href="/Venta-vista">Listar Venta</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item p-3 py-md-1 dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">PROVEEDORES</a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/Proveedor">Registrar Proveedor</a></li>
                                            <li><a class="dropdown-item" href="/Proveedor-vista">Listar Proveedores</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item p-3 py-md-1 dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">USUARIOS</a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/Usuario">Registrar Usuario</a></li>
                                            <li><a class="dropdown-item" href="/Usuario-vista">Listar Usuarios</a></li>
                                            <li><a class="dropdown-item" href="*" onClick={handleLogout}>Cerrar Sesion</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </nav>
            </div>
            <div style={estiloDeFondo}>
                {/* Contenido de tu aplicación */}
            </div>
        </>
    );
}