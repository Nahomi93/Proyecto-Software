import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar2 from './NavBar2';
import Swal from 'sweetalert2';
import fondoImagen from './images/logo_pipoca.png';  // Importa la imagen
import './styles/forms.css';
import { getToken } from './tokenStorage';

export default function ProveedorForm() {

  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, // Utiliza la imagen importada
    backgroundSize: '100% 100%',  // Ajusta la imagen a la altura y ancho de la pantalla
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', // Ajusta según sea necesario
    // Otros estilos según tus necesidades
  };

  const location = useLocation();
  const navigate = useNavigate();
  const token = getToken();
  const headers = useRef ({
    Authorization: `${token}`,
  });
  const [proveedor, setProveedor] = useState({
    id: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    modo: ''
  });

  useEffect(() => {
    if (!token || token==="" || token===undefined) {
      navigate('/');
      console.log("entra al if");
      return;
    }
    
    const params = new URLSearchParams(location.search);
    const proveedorData = {
      id: params.get('id') || '',
      nombre: params.get('nombre') || '',
      apellido: params.get('apellido') || '',
      direccion: params.get('direccion') || '',
      telefono: params.get('telefono') || '',
      modo: params.get('modo') || 'registrar'
    };

    setProveedor(proveedorData);
  }, [location.search,navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor({ ...proveedor, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (proveedor.modo === 'registrar') {
      axios.post('http://localhost:8080/proveedor', proveedor,{ headers:headers.current })
        .then(response => {
          console.log('Proveedor registrado:', response.data);
          Swal.fire({
            title: "CORRECTO!",
            text: "Se Registro el Proveedor Correctamente al Sistema",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              // El usuario hizo clic en el botón "OK"
              navigate('/Proveedor-vista');
            }
          });

        })
        .catch(error => {
          console.log("entro al catch")
          if (error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
            console.error('Error al registrar proveedor:', error);
          }
          
        });
    } else if (proveedor.modo === 'actualizar') {
      axios.put('http://localhost:8080/proveedor', proveedor,{ headers:headers.current })
        .then(response => {
          navigate('/Proveedor-vista');
          console.log('Usuario actualizado:', response.data);
        })
        .catch(error => {
          
          console.log("entro al catch")
          if (error.response.status === 401) {
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
        {<form onSubmit={handleSubmit}>
          <section class="forms-css" >
            <div class="container py-5 h-100">
              <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10 ">
                 
                  <div class="card rounded-2 text-black form-boxe" id="borde">
                    <div class="card-body p-md-5 mx-md-4 ">
                      <div >
                        <h4 class="mt-1 mb-5 pb-1">REGISTRO DE NUEVO PROVEEDOR </h4>
                      </div>
                      <div class="row">
                        <div class="form-outline mb-4  col-sm-5" >
                          <label class="label-plomo" for="form2Example22">NOMBRE:</label>
                          <input class="form-control" type="text"
                            name="nombre"
                            value={proveedor.nombre}
                            onChange={handleChange} required />
                        </div>
                        <div class="form-outline mb-4 col-sm-5">
                          <label class="label-plomo" for="form2Example22">APELLIDO:</label>
                          <input class="form-control"
                            type="text"
                            name="apellido"
                            value={proveedor.apellido}
                            onChange={handleChange} required
                          /></div>
                        <div class="form-outline mb-4 col-sm-5">
                          <label class="label-plomo" for="form2Example22">DIRECCION:</label>
                          <input class="form-control"
                            type="text"
                            name="direccion"
                            value={proveedor.direccion}
                            onChange={handleChange} required
                          /> </div>
                        <div class="form-outline mb-4 col-sm-5">
                          <label class="label-plomo" for="form2Example22">TELEFONO:</label>
                          <input class="form-control"
                            type="text"
                            name="telefono"
                            value={proveedor.telefono}
                            onChange={handleChange} required
                          /></div>
                        <div class="text-center pt-1 mb-5 pb-1">
                          <button type="submit" class="btn btn-primary">{proveedor.modo === 'registrar' ? 'Registrar Proveedor' : 'Actualizar Proveedor'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>}
      </div>
    </>
  )
}
