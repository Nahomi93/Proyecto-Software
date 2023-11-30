import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar2 from './NavBar2';
import { useNavigate } from 'react-router-dom';
import fondoImagen from './images/fondo_azul.png';  // Importa la imagen
import './styles/forms.css';
import Swal from 'sweetalert2';
import { getToken } from './tokenStorage';


export function VentaTable() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, 
    backgroundSize: '100% 100%',  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', 
  };


  const [ventas, setVentas] = useState([]);
  const [productosVenta, setProductosVenta] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const navigate = useNavigate();
  const token = getToken();
  const headers = useRef ({
    Authorization: `${token}`,
  });
  useEffect(() => {
    if (!token || token==="" || token===undefined) {
      navigate('/');
      console.log("entra al if");
      return;
    }
    
    // Obtener lista de ventas desde la API
    axios.get('http://localhost:8080/venta',{ headers:headers.current })
      .then(response => {
        setVentas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener ventas:', error)
        console.log("entro al catch")
        if (error.response && error.response.status === 401) {
          navigate('/');
        } else {
          console.log('Error:', error);
        }
      });
  }, [navigate]);

  const handleSeleccionarVenta = (venta) => {
    // Cuando se selecciona una venta, obtener los productos de esa venta
    axios.get(`http://localhost:8080/ventaProducto/${venta.id}`,{ headers:headers.current })
      .then(response => {
        setProductosVenta(response.data);
        setVentaSeleccionada(venta);
      })
      
      .catch(error => 
        {console.error('Error al obtener productos de venta:', error)
        console.log("entro al catch")
        if (error.response && error.response.status === 401) {
          navigate('/');
        } else {
          console.log('Error:', error);
        }
    });
  };
  const handleEliminar = (id) => {
    axios.delete(`http://localhost:8080/venta/${id}`,{ headers:headers.current })
      .then(response => {
        setVentas(ventas.filter(venta => venta.id !== id));
        console.log('Venta eliminada:', response.data);
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente la venta de la Lista",
          icon: "success"
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario hizo clic en el botón "OK"
            navigate('/Venta-vista');
          }
        });
      })
      .catch(error => {
        
        console.log("entro al catch")
        if (error.response.status === 401) {
          navigate('/');
        } else {
          console.error('Error al eliminar venta:', error);
        }
      });
  };

  const handleActualizar = (venta) => {
    //axios.get(`http://localhost:8080/ventaProducto/${venta.id}`)
    // .then(response => {
    const queryParams = new URLSearchParams({
      id: venta.id,
      nombre: venta.nombre,
      apellido: venta.apellido,
      nit: venta.nit,
      fecha_venta: venta.fecha_venta,
      total: venta.total,
      idUsuario: venta.idUsuario,
      modo: 'actualizar',
    }).toString();
    const url = `/Venta?${queryParams}`;

    window.location.href = url;
    //})
    //.catch(error => console.error('Error al obtener productos de venta:', error));

  };


  
  return (
    <>
    <NavBar2/>
    
      
<div style={estiloDeFondo}>
        {
      <section className="h-100 gradient-form">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-12"> {/* Cambié de col-xl-10 a col-xl-12 */}
              <div className="card rounded-2 text-black form-boxe" id="borde">
                <div></div>
                <div className="card-body p-md-5 mx-md-4">
                  <h4 className="mt-1 mb-5 pb-1">LISTA DE VENTAS REGISTRADOS</h4>
                  <div className="row">
                    <div className="form-outline mb-4">
                      <table className="tablita">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Apellido</th>
                            <th>Fecha Venta</th>
                            <th>NIT</th>
                            <th>Nombre</th>
                            <th>Total</th>
                            <th>Usuario</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventas.map(venta => (
                            <tr key={venta.id}>
                              <td>{venta.id}</td>
                              <td>{venta.apellido}</td>
                              <td>{venta.fecha_venta}</td>
                              <td>{venta.nit}</td>
                              <td>{venta.nombre}</td>
                              <td>{venta.total}</td>
                              <td>{venta.idUsuario}</td>
                              <td>
                                <button class="btn btn-info" onClick={() => handleSeleccionarVenta(venta)}>Ver Productos</button>
                                <button class="btn btn-danger" onClick={() => handleEliminar(venta.id)}>Eliminar</button>
                                <Link to="#" onClick={() => handleActualizar(venta)}>
                                  <button class="btn btn-success">Actualizar</button>
                                </Link>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    }
            </div>
            {ventaSeleccionada && (
      <div style={estiloDeFondo}>
      {
        <section className="h-100 gradient-form">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-xl-10"> {/* Cambié de col-xl-10 a col-xl-12 */}
                <div className="card rounded-2 text-black form-boxe" id="borde">
                  <div className="card-body p-md-5 mx-md-4"> 
                  <h4 className="mt-1 mb-5 pb-1">Productos de la Venta ID: {ventaSeleccionada.id}</h4>
                    <div className="row">
                      <div className="form-outline mb-4">
                        <table className="tablita">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Cantidad</th>
                              <th>Producto</th>
                              <th>Precio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productosVenta.map(producto => (
                              <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.cantidad}</td>
                                <td>{producto.nombreP}</td>
                                <td>{producto.precioP}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
       } </div>
      )}
    </>
  );
}

export default VentaTable;