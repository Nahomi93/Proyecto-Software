import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar2 from './NavBar2';
import fondoImagen from './images/logo_pipoca.png';  // Importa la imagen
import './styles/forms.css';
import StyleBack from './StyleBack';
import Swal from 'sweetalert2';
import { getToken,getusu } from './tokenStorage';


export function VentaForm() {
  const estiloDeFondo = {
    backgroundImage: `url(${fondoImagen})`,
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '92.3vh',
  };




  const [productos, setProductos] = useState([]);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensajeProductoAgotado, setMensajeProductoAgotado] = useState('');
  const [productosSeleccionadosEstado, setProductosSeleccionadosEstado] = useState({});
  //const [productoExtraido, setproductoExtraido] = useState([]);
  const [productosAgotados, setProductosAgotados] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const idu = getusu();
  const [venta, setVenta] = useState({
    nombre: '',
    apellido: '',
    fecha_venta: '',
    nit: '',
    total: 0,
    idUsuario: idu // Asegúrate de obtener este valor del usuario actual
  });
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
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
    // Obtener lista de productos desde la API

    axios.get('http://localhost:8080/producto',{ headers:headers.current })
      .then(response => {
        const params = new URLSearchParams(location.search);
        setProductos(response.data);
        const ventaData = {
          id: params.get('id') || '',
          nombre: params.get('nombre') || '',
          apellido: params.get('apellido') || '',
          fecha_venta: params.get('fecha_venta') || '',
          nit: params.get('nit') || '',
          total: params.get('total') || '',
          cantidad: params.get('cantidad') || '',
          idUsuario: params.get('idUsuario') || 1,
          modo: params.get('modo') || 'registrar'
        }
        setVenta(ventaData);
        if (ventaData.id !== '') {
          /*const listaProductos = response.data;
  
          const params = new URLSearchParams(location.search);
          const ventaData = {
            id: params.get('id') || '',
            nombre: params.get('nombre') || '',
            apellido: params.get('apellido') || '',
            fecha_venta: params.get('fecha_venta') || '',
            nit: params.get('nit') || '',
            total: params.get('total') || '',
            idUsuario: params.get('idUsuario') || '',
            modo: params.get('modo') || 'registrar'}
          //setTotal(0); // Inicializar el total en 0
          if(ventaData.id!==''){
            setVenta(ventaData);
            axios.get(`http://localhost:8080/ventaProducto/${ventaData.id}`)
            .then(response => {
              const productosVenta = response.data.map(productoVenta => {
                // Buscar el producto correspondiente en la lista completa de productos
                const producto = listaProductos.find(p => p.id === productoVenta.idProducto);
                
                // Si se encuentra el producto, crear un nuevo objeto con información adicional
                if (producto) {
                  return {
                    ...producto,
                    cantidad: productoVenta.cantidad,
                    //precio: producto.precio, // Ajusta según la estructura real de tus datos
                  };
                }
                return null; // Puedes manejar el caso en que no se encuentre el producto
              }).filter(Boolean); // Filtrar para eliminar productos nulos (no encontrados)
              setProductosSeleccionados(productosVenta);
              console.log("este es productos venta seleccionados ");
              console.log(productosVenta);
              //setProductosSeleccionados({ idProducto: productoId, cantidad: 1,precio: precio, nombre: nombre, detalle:detalle,idProveedor:idProveedor })
              //console.log(productoExtraido);
              //console.log(response.data)
            })
            .catch(error => console.error('Error al obtener productos de venta:', error));
            */
        }
        else {
          setVenta(prevVenta => ({
            ...prevVenta,
            total: 0
          }));
        }

      })

    .catch(error => {
        console.log("entro al catch");
        if (error.response.status === 401) {
          navigate('/');
        } else {
          console.log('Error:', error);
        }
      });
  }, [location.search,navigate]);

  const handleVentaChange = (e) => {
    const { name, value } = e.target;
    setVenta({ ...venta, [name]: value });
    /*console.log(value);
    // Si el campo es 'fecha_venta', formatea el valor antes de actualizar el estado
  if (name === 'fecha_venta') {
    const formattedDate = value.split('-').reverse().join('-');
    setVenta({ ...venta, [name]: formattedDate });
    //console.log(formattedDate);
    
  } else {
    setVenta({ ...venta, [name]: value });
  }
*/
  };
  const handleCheckboxChange = (productoId, isChecked, precio, nombre, detalle, idProveedor) => {
    const productoSeleccionado = productos.find(item => item.id === productoId);
    const cantidadDisponible = productoSeleccionado.cantidad;
    if (cantidadDisponible > 0) {
      if (isChecked) {
        setProductosSeleccionados([...productosSeleccionados, { id: productoId, cantidad: 1, precio: precio, nombre: nombre, detalle: detalle, idProveedor: idProveedor }]);
        //setTotal(total + productoSeleccionado.precio);
        console.log(productoSeleccionado);
        setVenta(prevVenta => ({
          ...prevVenta,
          total: prevVenta.total + productoSeleccionado.precio
        }));
      } else {
        const cantidadSeleccionada = productosSeleccionados.find(item => item.id === productoId)?.cantidad || 0;
        setProductosSeleccionados(productosSeleccionados.filter(item => item.id !== productoId));
        //setTotal(total - (productoSeleccionado.precio * cantidadSeleccionada));
        setVenta(prevVenta => ({
          ...prevVenta,
          total: prevVenta.total - (productoSeleccionado.precio * cantidadSeleccionada)
        }));
        if (venta.total - (productoSeleccionado.precio * cantidadSeleccionada) < 0) {
          //setTotal(0);
          setVenta(prevVenta => ({
            ...prevVenta,
            total: 0
          }));
        }
      }
    } else {
      setMensajeProductoAgotado(`El producto ${productoSeleccionado.nombre} está agotado.`);
      setMostrarMensaje(true);
      setProductosSeleccionadosEstado(prevState => ({
        ...prevState,
        [productoId]: false // Deshabilita el checkbox del producto agotado
      }));
      setProductosAgotados(prevState => ({
        ...prevState,
        [productoId]: true
      }));
      Swal.fire({
        title: "EL PRODUCTO NO TIENE STOCK DISPONIBLE",
        text: "no se podra seleccionar el producto",
        icon: "error"
      })
      // Establecer un temporizador para ocultar el mensaje después de 3 segundos
      // setTimeout(() => {
      // setMostrarMensaje(false);
      //setMensajeProductoAgotado('');

      //}, 3000);
    }
    // Asegurarse de que el total nunca sea menor que cero

  };

  const handleCantidadChange = (productoId, cantidad) => {
    const nuevosProductosSeleccionados = productosSeleccionados.map(item => {
      if (item.id === productoId) {
        // Verificar que la cantidad no exceda la cantidad disponible en la base de datos
        const producto = productos.find(p => p.id === productoId);
        //console.log(producto.cantidad)
        //console.log(cantidad)
        if (cantidad <= producto.cantidad) {
          return { ...item, cantidad };
        } else {
          return item;
        }
      }
      return item;
    });
    setProductosSeleccionados(nuevosProductosSeleccionados);

    setProductosSeleccionados(nuevosProductosSeleccionados);

    // Calcular el nuevo total
    let nuevoTotal = 0;
    nuevosProductosSeleccionados.forEach(producto => {
      const productoSeleccionado = productos.find(item => item.id === producto.id);
      nuevoTotal += productoSeleccionado.precio * producto.cantidad;
    });
    //setTotal(nuevoTotal);
    setVenta(prevVenta => ({
      ...prevVenta,
      total: nuevoTotal
    }));
  };

  const handleSubmit = (event) => {

    event.preventDefault();
    /*
        // Calcular el total
      let nuevoTotal = 0;
      productosSeleccionados.forEach(producto => {
        const productoSeleccionado = productos.find(item => item.id === producto.id);
        nuevoTotal += productoSeleccionado.precio * producto.cantidad;
      });
      */
    // Formatear la fecha en el formato "yyyy-MM-dd"
    /*const formattedFechaVenta = new Date(venta.fecha_venta).toISOString().slice(0, 10);
       setVenta(prevVenta => ({
         ...prevVenta,
         fecha_venta: formattedFechaVenta
       }));*/
    // Guardar la venta en la base de datos
    console.log(venta);
    venta.idUsuario= idu;
    if (venta.modo === 'registrar') {
      if (venta.total !== 0) {
        console.log(venta);
        axios.post('http://localhost:8080/venta', venta,{ headers:headers.current })
          .then(response => {
            const idVenta = response.data; // Obtener el ID de la venta creada
            //console.log(response.data)
            // Guardar los productos asociados a la venta
            productosSeleccionados.forEach(producto => {
              const ventaProducto = {
                idVenta: idVenta,
                idProducto: producto.id,
                cantidad: producto.cantidad,
              };
              /*
              console.log("venta producto " + ventaProducto)
              console.log("producto cantidad: " + producto.cantidad)
              console.log(ventaProducto.idVenta);
              console.log(ventaProducto.id);
              console.log(ventaProducto.cantidad);
              */
              axios.post('http://localhost:8080/ventaProducto', ventaProducto)
                .then(response => console.log('VentaProducto guardado con éxito'))
                .catch(error => console.error('Error:', error));
              // Actualizar el producto
              const productoantiguo = productos.find(p => p.id === producto.id);
              const productoActualizado = {
                id: producto.id,
                precio: producto.precio,
                detalle: producto.detalle,
                cantidad: productoantiguo.cantidad - producto.cantidad,
                nombre: producto.nombre,
                idProveedor: producto.idProveedor
              };
              console.log(productoActualizado)

              axios.put(`http://localhost:8080/producto`, productoActualizado,{ headers:headers.current })
                .then(response => console.log('Producto actualizado con éxito'))
                .catch(error => {
                  console.log("entro al catch")
                  if (error.response && error.response.status === 401) {
                    navigate('/');
                  } else {
                    console.log('Error:', error);
                  }
                });
              navigate('/Venta-vista');
            });
            console.log('Venta guardada con éxito');
            Swal.fire({
              title: "CORRECTO!",
              text: "Se Registro la Venta Correctamente al Sistema",
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
              console.log('Error:', error);
            }
          });
      }
      else {
        //setMensajeProductoAgotado(`Debe seleecionar algun producto`);
        //setMostrarMensaje(true);
        Swal.fire({
          title: "ERROR!",
          text: "Se Debe seleccionar algun producto",
          icon: "error"
      })
        // Establecer un temporizador para ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          //setMostrarMensaje(false);
          //setMensajeProductoAgotado('');
        }, 2000);
      }
    } else if (venta.modo === 'actualizar') {
      console.log("entro a actualizar");
      axios.put('http://localhost:8080/venta', venta,{ headers:headers.current })
        .then(response => { navigate('/Venta-vista'); })
        .catch(error => {
          console.log("entro al catch")
          if (error.response && error.response.status === 401) {
            navigate('/');
          } else {
            console.log('Error:', error);
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
                          <h4 class="mt-1 mb-5 pb-1">REGISTRAR VENTA: </h4>
                        </div>
                        <div class="row">
                          {venta.modo === 'actualizar' && (
                            <div class="form-outline mb-4  col-sm-5" >
                              <label class="label-plomo" for="form2Example22">ID:</label>
                              <input class="form-control"
                                type="text"
                                name="ID"
                                value={venta.id}
                                readOnly
                              />
                            </div>
                          )}
                          <div class="form-outline mb-4  col-sm-5" >
                            <label class="label-plomo" for="form2Example22">NOMBRE:</label>
                            <input class="form-control" type="text"
                              name="nombre"
                              value={venta.nombre}
                              onChange={handleVentaChange} required/>
                          </div>
                          <div class="form-outline mb-4 col-sm-5">
                            <label class="label-plomo" for="form2Example22">APELLIDO:</label>
                            <input class="form-control"
                              type="text"
                              name="apellido"
                              value={venta.apellido}
                              onChange={handleVentaChange} required
                            /></div>
                          <div class="form-outline mb-4 col-sm-5">
                            <label class="label-plomo" for="form2Example22">FECHA VENTA:</label>
                            <input class="form-control"
                              type="date"
                              name="fecha_venta"
                              value={venta.fecha_venta}
                              onChange={handleVentaChange} required
                            /> </div>
                          <div class="form-outline mb-4 col-sm-5">
                            <label class="label-plomo" for="form2Example22">NIT:</label>
                            <input class="form-control"
                              type="text"
                              name="nit"
                              value={venta.nit}
                              onChange={handleVentaChange} required
                            /></div>
                          <div class="form-outline mb-4 col-sm-5">
                            <label class="label-plomo" for="form2Example22">TOTAL:</label>
                            <input class="form-control"
                              type="number"
                              name="total"
                              value={venta.total}
                              readOnly
                              onChange={handleVentaChange}
                            />
                          </div>
                          {venta.modo === 'registrar' && (
                            <div >
                              <label class="label-plomo" for="form2Example22">PRODUCTOS:</label>
                              <table class=" tablita">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>NOMBRE</th>
                                    <th>PRECIO</th>
                                    <th>CANTIDAD COMPRA</th>
                                    <th>STOCK DISPONIBLE</th>
                                  </tr>
                                </thead>
                                {productos.map(producto => (
                                  <tbody key={producto.id}>

                                    <tr>
                                      <td><input
                                        type="checkbox"
                                        checked={productosSeleccionadosEstado[producto.id]}
                                        //checked={productosSeleccionados.find(item => item.id === producto.id)}
                                        onChange={(e) => handleCheckboxChange(producto.id, e.target.checked, producto.precio, producto.nombre, producto.detalle, producto.idProveedor)}
                                        disabled={productosAgotados[producto.id]}
                                      /></td>
                                      <td> <label>{producto.nombre}</label></td>
                                      <td><label>{producto.precio}</label></td>
                                      <td>{productosSeleccionados.find(item => item.id === producto.id) && (
                                        <input class="form-control"
                                          type="number"
                                          min="1"
                                          value={productosSeleccionados.find(item => item.id === producto.id).cantidad}
                                          onChange={(e) => handleCantidadChange(producto.id, e.target.value)}
                                        />
                                      )}</td>
                                      <td><label>{producto.cantidad}</label></td>
                                    </tr>
                                  </tbody>


                                ))}
                              </table>
                              {/*mostrarMensaje && (
                                <div class="alert alert-secondary" role="alert">
                                  <label>Mensaje:</label>
                                  <div>{mensajeProductoAgotado}</div>
                                </div>
                              )*/}
                            </div>
                          )}
                          <div class="text-center pt-1 mb-5 pb-1">
                            <button type="submit" class="btn btn-primary">{venta.modo === 'registrar' ? 'Realizar Venta' : 'Actualizar Venta'}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> </form>
        }
      </div>
      <StyleBack />




    </>
  );
};

export default VentaForm;