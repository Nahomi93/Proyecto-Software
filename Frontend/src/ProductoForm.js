import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar2 from './NavBar2';
import Swal from 'sweetalert2';
import fondoImagen from './images/logo_pipoca.png';  // Importa la imagen
import './styles/forms.css';
import { getToken } from './tokenStorage';

export default function ProductoForm() {
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
    const [producto, setProducto] = useState({
        id: '',
        nombre: '',
        detalle: '',
        cantidad: '',
        precio: '',
        idProveedor: '',
        modo: ''
    });
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
          
        const params = new URLSearchParams(location.search);
        const productoData = {
            id: params.get('id') || '',
            nombre: params.get('nombre') || '',
            detalle: params.get('detalle') || '',
            cantidad: params.get('cantidad') || '',
            precio: params.get('precio') || '',
            idProveedor: params.get('idProveedor') || '',
            modo: params.get('modo') || 'registrar'
        };

        setProducto(productoData);
    }, [location.search,navigate]);


    /*useEffect(() => {
      if (modo === 'actualizar' && usuarioActual) {
        setUsuario(usuarioActual);
      }
    }, [modo, usuarioActual]);
  */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (producto.modo === 'registrar') {
            axios.post('http://localhost:8080/producto', producto,{ headers:headers.current })
                .then(response => {
                    console.log('Usuario registrado:', response.data);
                    Swal.fire({
                        title: "CORRECTO!",
                        text: "Se Registro el Producto Correctamente al Sistema",
                        icon: "success"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // El usuario hizo clic en el botón "OK"
                            navigate('/Producto-vista');
                        }
                    });

                })
                .catch(error => {
                    console.log("entro al catch")
                    if (error.response.status === 401) {
                        navigate('/');
                    } else {
                        console.log('Error:', error);
                        console.error('Error al registrar el producto:', error);
                    Swal.fire({
                        title: "ERROR!",
                        text: "No se Registro el Producto Correctamente",
                        icon: "error"
                    })
                    }
                });
        } else if (producto.modo === 'actualizar') {
            axios.put('http://localhost:8080/producto', producto,{ headers:headers.current })
                .then(response => {
                    navigate('/Producto-vista');
                    console.log('Producto actualizado:', response.data);
                    Swal.fire({
                        title: "CORRECTO!",
                        text: "Se Actualizó el Producto Correctamente",
                        icon: "success"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // El usuario hizo clic en el botón "OK"
                            navigate('/Producto-vista');
                        }
                    });
                })
                .catch(error => {
                    
                    console.log("entro al catch")
                    if (error.response.status === 401) {
                        navigate('/');
                    } else {
                        console.error('Error al actualizar Producto:', error);
                        Swal.fire({
                        title: "ERROR!",
                        text: "No se Actualizó el Producto Correctamente",
                        icon: "error"
                    })
                    }
                });
        }
    };

    const [data, setData] = useState([]);

    useEffect(() => {
        // Función para obtener datos de la API usando Axios
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/proveedor',{ headers:headers.current });
                setData(response.data);
            } catch (error) {
                console.log("entro al catch")
                if (error.response && error.response.status === 401) {
                  navigate('/');
                } else {
                  console.log('Error:', error);
                }
                
            }
        };

        // Llama a la función para obtener datos cuando el componente se monta
        fetchData();
    }, []); // El segundo parámetro del useEffect vacío significa que se ejecutará solo una vez al montar el componente

    

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
                                <div class="card rounded-2 text-black form-boxe" id="borde">
                                    <div class="card-body p-md-5 mx-md-4">
                                        <div >
                                            <h4 class="mt-1 mb-5 pb-1">{producto.modo === 'registrar' ? 'Registrar Producto' : 'Actualizar Producto'}</h4>
                                        </div>

                                        <div class="row">
                                            {producto.modo === 'actualizar' && (
                                                <div class="form-outline mb-4  col-sm-5" >
                                                    <label class="label-plomo" for="form2Example22">ID:</label>
                                                    <input class="form-control"
                                                        type="text"
                                                        name="ID"
                                                        value={producto.id}
                                                        readOnly
                                                    />
                                                </div>
                                            )}
                                            <div class="form-outline mb-4  col-sm-5" >
                                                <label class="label-plomo" for="form2Example22">NOMBRE:</label>
                                                <input class="form-control" type="text"
                                                    name="nombre"
                                                    value={producto.nombre}
                                                    onChange={handleChange} required />
                                            </div>
                                            <div class="form-outline mb-4 col-sm-5">
                                                <label class="label-plomo" for="form2Example22">DETALLE:</label>
                                                <input class="form-control"
                                                    type="text"
                                                    name="detalle"
                                                    value={producto.detalle}
                                                    onChange={handleChange} required
                                                /></div>
                                            <div class="form-outline mb-4 col-sm-5">
                                                <label class="label-plomo" for="form2Example22">PRECIO:</label>
                                                <input class="form-control"
                                                    type="number"
                                                    name="precio"
                                                    value={producto.precio}
                                                    onChange={handleChange} required
                                                /></div>
                                            <div class="form-outline mb-4 col-sm-5">
                                                <label class="label-plomo" for="form2Example22">CANTIDAD:</label>
                                                <input class="form-control"
                                                    type="number"
                                                    name="cantidad"
                                                    value={producto.cantidad}
                                                    onChange={handleChange} required
                                                /></div>

                                            <div class="form-outline mb-4 col-sm-5">
                                                <label class="label-plomo" for="form2Example22">PROVEEDOR:</label>
                                                <select class="form-select form-control" aria-label="Default select example" value={producto.idProveedor} name='idProveedor' onChange={handleChange} required>
                                                    <option value="">(vacio)</option>
                                                    {data.map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.nombre} 
                                                        </option> 
                                                    ))}
                                                </select></div>
                                            <div class="text-center pt-1 mb-5 pb-1">
                                                <button type="submit" class="btn btn-primary">{producto.modo === 'registrar' ? 'Registrar Producto' : 'Actualizar Producto'}</button>
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
    )
}
