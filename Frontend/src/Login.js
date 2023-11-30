import './styles/login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { saveToken } from './tokenStorage';
export function Login() {
    const [formData, setFormData] = useState({
        usuario: '',
        contrasenia: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    //const jwt = require('jsonwebtoken');
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth', formData);

            if (response.data) {
                console.log('Respuesta del servidor:', response.data);
                console.log('Respuesta del token:', response.data.jwtToken);
                console.log('Respuesta del usuario:', response.data.usuarioDTO);
                console.log('Respuesta del resultado:', response.data.result);
                //const token = response.data.result;
            
                // Decodificar el token
                //const decodedToken = jwt.decode(token);
                //console.log("decodificado ", decodedToken);
                saveToken(response.data.jwtToken,response.data.usuarioDTO.id);
                Swal.fire({
                    title: "ACCESO CORRECTO",
                    text: "Bienvenido al Sistema",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        // El usuario hizo clic en el botón "OK"
                        navigate('/Home');
                    }
                }); // Corregir aquí: cerrar el paréntesis de la función then
            } else {
                throw new Error('Error en la solicitud');
                
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: "ACCESO INCORRECTO",
                text: "No puede ingresar al Sistema",
                icon: "error"
            }).then((result) => {
                if (result.isConfirmed) {
                    // El usuario hizo clic en el botón "OK"
                    navigate('/');
                }
            }); // Corregir aquí: cerrar el paréntesis de la función then
        }
    };

    return (
        <>
            <section class="secion-login">
                <div class="form-box">
                    <div class="form-value">
                        <form onSubmit={handleSubmit}>
                            <h2>TIENDA DON PIPOCA</h2>
                            <h1>Inicio de Sesion</h1>
                            <div class="inputbox">

                                <input name="usuario"
                                    value={formData.usuario}
                                    onChange={handleChange} type="text" required />
                                <label for="">Usuario</label>
                            </div>
                            <div class="inputbox">
                                <input name="contrasenia"
                                    value={formData.contrasenia}
                                    onChange={handleChange} type="password" required />
                                <label for="">Contraseña</label>
                            </div>
                            <div class="text-center ">
                            <button  type="submit" class="btn btn-primary">INGRESAR</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>



        </>



    );
}

export default Login;