import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar2 from './NavBar2';
import fondoImagen from './images/fondo_azul.png';  // Importa la imagen
import './styles/forms.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken } from './tokenStorage';

export function UsuarioTable() {

  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, 
    backgroundSize: '100% 100%',  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', 
  };

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const token = getToken();
  const headers = useRef ({
    Authorization: `${token}`,
  });
  //const history = useHistory();
  useEffect(() => {
    try{
      //const header = getAuthHeaders()
      //console.log(token);
      //console.log(token==="");
      //console.log(token===undefined);
      if (!token || token==="" || token===undefined) {
        navigate('/');
        console.log("entra al if");
        return;
      }
      
    axios.get('http://localhost:8080/usuario',{ headers:headers.current })
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/');
        } else {
          console.log('Error:', error);
        }
        console.error('Error al obtener usuarios:', error);
      });
    }catch (error) {
      console.log("entro al catch")
      if (error.response && error.response.status === 401) {
        navigate('/');
      } else {
        console.log('Error:', error);
      }
    }

  }, [navigate]);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);


    // Realizar solicitud al backend cuando hay un valor en el campo de búsqueda
    if (e.target.value) {
      axios.get(`http://localhost:8080/usuario/${e.target.value}`,{ headers:headers.current })
        .then(response => {
          setUsuarios([response.data]);
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
      axios.get('http://localhost:8080/usuario',{ headers:headers.current })
        .then(response => {
          setUsuarios(response.data);
        })
        .catch(error => {
          console.error('Error al obtener usuarios:', error);
        });
    }
  };
  /*
    const filtrarUsuarios = () => {
      return usuarios.filter(usuario => usuario.id.toString().includes(busqueda));
      
    };*/

  const handleEliminar = (id) => {
    axios.delete(`http://localhost:8080/usuario/${id}`,{ headers:headers.current })
      .then(response => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));
        console.log('Usuario eliminado:', response.data);
        //navigate('/Usuario-vista');
        Swal.fire({
          title: "CORRECTO!",
          text: "Se Elimino correctamente el usuario de la Lista",
          icon: "success"
        }).then((result) => {
          if (result.isConfirmed) {
            // El usuario hizo clic en el botón "OK"
            navigate('/Usuario-vista');
          }
        });

      })
      .catch(error => {
        console.error('Error al eliminar usuario:', error);
      });

  };

  /*  const handleActualizar = (id) => {
      window.location.href = `http://localhost:3000/Usuario?id=${id}`;
    };
  */
  /*const handleActualizar = (id) => {
    axios.get(`http://localhost:8080/usuario/${id}`)
      .then(response => {
        // response.data debe contener la información del usuario
        const usuario = response.data;

        // Redireccionar al formulario de usuario con la información
        window.location.href = `http://localhost:3000/Usuario?id=${usuario.id}&nombre=${usuario.nombre}&apellido=${usuario.apellido}&cargo=${usuario.cargo}&telefono=${usuario.telefono}&usuario=${usuario.usuario}&contrasenia=${usuario.contrasenia}&estado=${usuario.estado}`;
      })
      .catch(error => {
        console.error('Error al obtener usuario:', error);
      });
  };*/
  const handleActualizar = (usuario) => {
    const queryParams = new URLSearchParams({
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      cargo: usuario.cargo,
      telefono: usuario.telefono,
      usuario: usuario.usuario,
      modo: 'actualizar'
    }).toString();

    const url = `/Usuario?${queryParams}`;

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
                  <h4 className="mt-1 mb-5 pb-1">LISTA DE USUARIOS</h4>
                  <div className="row">
                    <input 
                      type="text"
                      placeholder="Buscar por ID"
                      value={busqueda}
                      onChange={handleInputChange}
                    />
                    <div className="form-outline mb-4">

                      <table className="tablita">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cargo</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                              <td>{usuario.id}</td>
                              <td>{usuario.nombre}</td>
                              <td>{usuario.apellido}</td>
                              <td>{usuario.cargo}</td>
                              <td>{usuario.telefono}</td>


                              <td>
                                <button  class="btn btn-danger" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                                <Link to="#" onClick={() => handleActualizar(usuario)}>
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
  );
};

export default UsuarioTable;