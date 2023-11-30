import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar2 from './NavBar2';
import Swal from 'sweetalert2';
import fondoImagen from './images/logo_pipoca.png';  // Importa la imagen
import './styles/forms.css';
import { getToken } from './tokenStorage';


export function UsuarioForm() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, 
    backgroundSize: '100% 100%',  
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', 
  };


  const location = useLocation();
  const navigate = useNavigate();
  /*const { nombre, apellido, cargo, telefono, usuario1, contrasenia } = useParams();*/
  const token = getToken();
  const headers = useRef ({
    Authorization: `${token}`,
  });
  const [usuario, setUsuario] = useState({
    id: '',
    nombre: '',
    apellido: '',
    cargo: '',
    telefono: '',
    usuario: '',
    contrasenia: '',
    modo: ''
  });

  useEffect(() => {
    if (!token || token==="" || token===undefined) {
      navigate('/');
      console.log("entra al if");
      return;
    }
    
    const params = new URLSearchParams(location.search);
    const usuarioData = {
      id: params.get('id') || '',
      nombre: params.get('nombre') || '',
      apellido: params.get('apellido') || '',
      cargo: params.get('cargo') || '',
      telefono: params.get('telefono') || '',
      usuario: params.get('usuario') || '',
      contrasenia: '',
      modo: params.get('modo') || 'registrar'
    };

    setUsuario(usuarioData);
  }, [location.search,navigate]);


  /*useEffect(() => {
    if (modo === 'actualizar' && usuarioActual) {
      setUsuario(usuarioActual);
    }
  }, [modo, usuarioActual]);
*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usuario.modo === 'registrar') {
      axios.post('http://localhost:8080/usuario', usuario,{ headers:headers.current })
        .then(response => {
          console.log('Usuario registrado:', response.data);
          Swal.fire({
            title: "CORRECTO!",
            text: "Se Registro el usuario Correctamente al Sistema",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                // El usuario hizo clic en el botón "OK"
                navigate('/Usuario-vista');
            }
        });
         
        })
        .catch(error => {
          console.log("entro al catch")
          if (error.response && error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al registrar usuario:', error);
          }
          
        });
    } else if (usuario.modo === 'actualizar') {
      axios.put('http://localhost:8080/usuario', usuario, { headers:headers.current })
        .then(response => {
          navigate('/Usuario-vista');
          console.log('Usuario actualizado:', response.data);
        })
        .catch(error => {
          
          console.log("entro al catch")
          if (error.response && error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al actualizar usuario:', error);
          }
        });
    }
  };
  return (
    <>
      <NavBar2 />
      <div style={estiloDeFondo}>
        {
      <form onSubmit={handleSubmit}>
        <section class="h-100 gradient-form" >
          <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
              <div class="col-xl-10">
                <div class="card rounded-2 text-black form-boxe " id="borde">
                  <div class="card-body p-md-5 mx-md-4">
                    <div >
                      <h4 class="mt-1 mb-5 pb-1">REGISTRO DE NUEVO USUARIO </h4>
                    </div>

                    <div class="row">
                      {usuario.modo === 'actualizar' && (
                        <div class="form-outline mb-4  col-sm-5" >
                          <label class="label-plomo" for="form2Example22">ID:</label>
                          <input class="form-control"
                            type="text"
                            name="ID"
                            value={usuario.id}
                            readOnly
                          />
                        </div>
                      )}
                      <div class="form-outline mb-4  col-sm-5" >
                        <label class="label-plomo" for="form2Example22">NOMBRE:</label>
                        <input class="form-control" type="text"
                          name="nombre"
                          value={usuario.nombre}
                          onChange={handleChange} required />
                      </div>
                      <div class="form-outline mb-4 col-sm-5">
                        <label class="label-plomo" for="form2Example22">APELLIDO:</label>
                        <input class="form-control"
                          type="text"
                          name="apellido"
                          value={usuario.apellido}
                          onChange={handleChange} required
                        /></div>
                      <div class="form-outline mb-4 col-sm-5">
                        <label class="label-plomo" for="form2Example22">CARGO:</label>
                        <input class="form-control"
                          type="text"
                          name="cargo"
                          value={usuario.cargo}
                          onChange={handleChange} required
                        /> </div>
                      <div class="form-outline mb-4 col-sm-5">
                        <label class="label-plomo" for="form2Example22">TELEFONO:</label>
                        <input class="form-control"
                          type="number"
                          name="telefono"
                          value={usuario.telefono}
                          onChange={handleChange} required
                        /></div>
                      <div class="form-outline mb-4 col-sm-5">
                        <label class="label-plomo" for="form2Example22">USUARIO:</label>
                        <input class="form-control"
                          type="text"
                          name="usuario"
                          value={usuario.usuario}
                          onChange={handleChange} required
                        /></div>
                      <div class="form-outline mb-4 col-sm-5">
                        <label class="label-plomo" for="form2Example22">CONTRASEÑA:</label>
                        <input class="form-control"
                          type="password"
                          name="contrasenia"
                          value={usuario.contrasenia}
                          onChange={handleChange} required
                        /> </div>
                      <div class="text-center pt-1 mb-5 pb-1">
                        <button type="submit" class="btn btn-primary">{usuario.modo === 'registrar' ? 'Registrar Usuario' : 'Actualizar Usuario'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    }
            </div>




    </>
  );
};

export default UsuarioForm;