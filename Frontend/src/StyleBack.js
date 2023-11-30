import React from 'react'
import './styles/forms.css';
import fondoImagen from './images/logo_pipoca.png'; 
export default function StyleBack() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`, // Utiliza la imagen importada
    backgroundSize: '100% 100%',  // Ajusta la imagen a la altura y ancho de la pantalla
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh', // Ajusta según sea necesario
    // Otros estilos según tus necesidades
  };
  return (
    <div style={estiloDeFondo}></div>
  )
}

