import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar2 from './NavBar2'
import fondoImagen from './images/fondo_azul.png';  // Importa la imagen
import './styles/forms.css';
import Swal from 'sweetalert2';
import { getToken } from './tokenStorage';

import { useNavigate } from 'react-router-dom';


export default function ProveedorTable() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, 
    backgroundSize: '100% 100%',  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', 
  };



  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
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
    
    axios.get('http://localhost:8080/proveedor',{ headers:headers.current })
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        
        console.log("entro al catch")
        if (error.response && error.response.status === 401) {
          navigate('/');
        } else {
          console.log('Error:', error);
          console.error('Error al obtener proveedores:', error);
        }
      });
  }, [navigate]);


  const handleInputChange = (e) => {
    setBusqueda(e.target.value);


    // Realizar solicitud al backend cuando hay un valor en el campo de búsqueda
    if (e.target.value) {
      axios.get(`http://localhost:8080/proveedor/${e.target.value}`,{ headers:headers.current })
        .then(response => {
          setProveedores([response.data]);
          console.log(e.target.value);
        })
        .catch(error => {
          
          console.log("entro al catch")
          if (error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al obtener usuario:', error);
          }
        });
    }
    else {
      axios.get('http://localhost:8080/proveedor',{ headers:headers.current })
        .then(response => {
          setProveedores(response.data);
        })
        .catch(error => {
          console.error('Error al obtener usuarios:', error);
        });
    }
  };

  const handleEliminar = (id) => {
    axios.delete(`http://localhost:8080/proveedor/${id}`,{ headers:headers.current })
      .then(response => {
        setProveedores(proveedores.filter(usuario => proveedores.id !== id));
        console.log('Proveedor eliminado:', response.data);
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente el proveedor de la Lista",
          icon: "success"
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario hizo clic en el botón "OK"
            navigate('/Proveedor-vista');
          }
        });

      })
      .catch(error => {
        console.error('Error al eliminar proveedor:', error);
      });
  };

  const handleActualizar = (proveedor) => {
    const queryParams = new URLSearchParams({
      id: proveedor.id,
      nombre: proveedor.nombre,
      apellido: proveedor.apellido,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
      modo: 'actualizar'
    }).toString();

    const url = `/Proveedor?${queryParams}`;

    window.location.href = url;
  };


  return (
    <>
      <NavBar2 />
      <div style={estiloDeFondo}>
        {
      <section className="h-100 gradient-form">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-xl-12"> {/* Cambié de col-xl-10 a col-xl-12 */}
              <div className="card rounded-2 text-black form-boxe" id="borde">
                <div></div>
                <div className="card-body p-md-5 mx-md-4">
                  <h4 className="mt-1 mb-5 pb-1">LISTA DE PROVEEDORES</h4>
                  <div className="row">
                    <input 
                      type="text"
                      placeholder="Buscar por ID"
                      value={busqueda}
                      onChange={handleInputChange}
                    />
                    <div className="form-outline mb-4">
                      <br></br>
                      <table className="tablita">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Teléfono</th>
                            <th>Direccion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {proveedores.map(proveedor => (
                            <tr key={proveedor.id}>
                              <td>{proveedor.id}</td>
                              <td>{proveedor.nombre}</td>
                              <td>{proveedor.apellido}</td>
                              <td>{proveedor.telefono}</td>
                              <td>{proveedor.direccion}</td>
                              <td>
                                <button class="btn btn-danger" onClick={() => handleEliminar(proveedor.id)}>Eliminar</button>
                                <Link to="#" onClick={() => handleActualizar(proveedor)}>
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
    </>
  )
}
