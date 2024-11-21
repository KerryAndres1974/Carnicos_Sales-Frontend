import '../estilos/Detalleventas.css';
import { useAuth } from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

function Detalleventas() {
    const auth = useAuth();
    const goTo = useNavigate();
    const [ventana1, setVentana1] = useState(false);
    const [ventana2, setVentana2] = useState(false);
    const [factura, setFactura] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [ventanaReservas, setVentanaReservas] = useState(false);
    const [filas, setFilas] = useState([
        {cantidad: '1', idProducto: '', articulo: '', precio: '', total: '' }]);

    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    useEffect(() => {

        const cargarReservas = async () => {
            // logica para traer las reservas desde el backend
            try {
                const respuesta = await fetch('http://localhost:8000/get-reservas');

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setReservas(datos);
                } else {
                    alert('Error al obtener las reservas');
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error);
            }
        }
        cargarReservas();
    }, []);

    const logeado = () => {
        const accesstoken = auth.login();
        return accesstoken;
    }

    const deslogeado = () => {
        window.location.reload();
        auth.logout();
    }

    const calcularTotal = () =>{
        return filas.reduce((acc, fila) => {
            const subtotal = parseFloat(fila.total || 0);
            return acc + subtotal
        }, 0)
    }

    async function validarFila(e, fila) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const idp = e.target.value;
            
            try {
                const response = await fetch(`http://localhost:8000/get-product/${idp}`);
                const data = await response.json();
    
                if (data) {
                    const producto = data[0];
                    const cantidad = document.getElementById(`cant-${fila}`).value;
                    const nuevasFilas = [...filas];
                    nuevasFilas[fila].articulo = producto.nombreproducto;
                    nuevasFilas[fila].precio = parseFloat(producto.precioxlibra);
                    nuevasFilas[fila].total = parseFloat(producto.precioxlibra) * cantidad;
                    setFilas(nuevasFilas);

                    // Enfoque al input idProducto de la siguiente fila si existe
                    if (fila + 1 < filas.length) {
                        document.getElementById(`idProducto-${fila + 1}`).focus();
                    } else {
                        // Añadir una nueva fila si quieres seguir añadiendo
                        setFilas([...filas, { cantidad: '1', idProducto: '', articulo: '', precio: '', total: '' }]);
                        setTimeout(() => {
                            document.getElementById(`idProducto-${fila + 1}`).focus();
                        }, 0);
                    }

                } else {
                    throw new Error('Error en la solicitud al backend');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    text: `El producto ${idp} no existe en inventario`,
                    toast: true,
                    color: 'red',
                    showConfirmButton: false,
                    timer: 4000,
                    width: '30%',
                    timerProgressBar: true,
                });
                console.error(error);
            }
        }
    }

    const valorColumna = (e, fila, campo) => {
        const nuevasFilas = [...filas];
        nuevasFilas[fila][campo] = e.target.value;
        setFilas(nuevasFilas);
    }

    const quitarFila = (i) => {
        if (filas.length <= 1){
            const reinicio = [...filas];
            reinicio[0].idProducto = '';
            setFilas(reinicio);
        } else {
            const nuevasFilas = filas.filter((_, fila) => fila !== i);
            setFilas(nuevasFilas);
        }
    }

    const reinicio = () => {
        setFilas([{cantidad: '1', idProducto: '', articulo: '', precio: '', total: ''}]);
    }

    const facturarVentas = () => {
        const idfactura = uuidv4().split('-')[0];
        const fecha = new Date().toLocaleString();

        const detalles = filas
            .map((fila) => {
                const subtotal = parseFloat(fila.cantidad) * parseFloat(fila.precio);
                return { ...fila, subtotal: subtotal };
            })
            .filter((fila, i) => {
                if (i === filas.length - 1 && fila.idProducto === '') return false;
                return true;
            });

        setFactura({ id: idfactura, fecha: fecha, detalles: detalles });
        if (detalles.length !== 0) setVentana1(true);
    }

    async function sendFacturas(e) {
        e.preventDefault();

        const filasFiltradas = filas.slice(0,-1).map(fila => ({
            nombre: fila.articulo,
            cantidad: fila.cantidad
        }));
        
        try {
            const response = await fetch('http://localhost:8000/new-venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: factura.id,
                    nombreempleado: logeado().role,
                    totalventa: calcularTotal(),
                    fecha: factura.fecha,
                    producto: filasFiltradas
                })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    text: 'Venta realizada!',
                    toast: true,
                    color: 'green',
                    showConfirmButton: false,
                    timer: 4000,
                    position: 'top',
                    timerProgressBar: true,
                }).then(() => window.location.reload());
            } else {
                throw new Error('Error en la solicitud al backend');
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    async function chageEstado(e) {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/edit-reserva/${reservaSeleccionada.idreserva}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    text: 'Entrega realizada!',
                    toast: true,
                    color: 'green',
                    showConfirmButton: false,
                    timer: 4000,
                    position: 'top',
                    timerProgressBar: true,
                }).then(() => window.location.reload());
            } else {
                throw new Error('Error en la solicitud al backend');
            }
        } catch (error) {
            console.error(error);
        }
        
    }

    return (
        <div className='principal-ventas'>

            <header className='cabezera-ventas'>
                <h1>DETALLE DE VENTA</h1>

                {logeado().role === 'vendedor' && <div>
                    <button onClick={() => setVentanaReservas((prev) => !prev)}>ver reservas ({reservas.length})</button>
                    <button onClick={() => {goTo('/Inventario')}}>inventario</button>
                    <button onClick={deslogeado}>salir</button>
                </div>}

                {logeado().role === 'gerente' && <div>
                    <button onClick={() => setVentanaReservas((prev) => !prev)}>ver reservas ({reservas.length})</button>
                    <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
                </div>}
                
            </header>

            <main className='contenido-ventas'>
                <div className='elementos'>
                    <table className='tabla-elementos'>
                        <thead>
                            <tr>
                                <th>Cantidad(lbr)</th>
                                <th>Id_Producto</th>
                                <th>Articulo</th>
                                <th>Costo por Libra</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, i) => (
                                <tr key={i}>
                                    <td>
                                        <input 
                                            type='number'
                                            id={`cant-${i}`}
                                            min='1'
                                            value={fila.cantidad}
                                            onChange={(e) => valorColumna(e, i, 'cantidad')}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`idProducto-${i}`}
                                            placeholder='Id_Producto'
                                            value={fila.idProducto}
                                            onChange={(e) => valorColumna(e, i, 'idProducto')}
                                            onKeyPress={(e) => validarFila(e, i)}
                                        />
                                    </td>
                                    <td><label className="Larticulo">{fila.articulo}</label></td>
                                    <td><label className="Lcosto">{fila.precio}</label></td>
                                    <td><label className="Ltotal">{fila.total}</label></td>
                                    <td>
                                        <button onClick={() => quitarFila(i)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='detalles'>
                    <div className='titulos'>
                        <h2>Cárnicos Sales</h2>
                        <label>CAJA</label>
                    </div>
                    <div className='descripcion'>
                        <div className='linea'>
                            <span className='descripcion'><strong>Total:</strong></span>
                            <span className='monto'>{calcularTotal()}</span>
                        </div>
                    </div>
                </div>
            </main>
            <footer className='piepagina-ventas'>
                <div className='botones'>
                    <button className='boton' onClick={reinicio}>Cancelar Venta</button>
                    <button className='boton' onClick={facturarVentas}>Facturar</button>
                </div>
            </footer>

            {ventanaReservas && (
                <div className='contenedor-reservas'>
                    {reservas.map((reserva) => (
                        <div key={reserva.idreserva} onClick={() => {setReservaSeleccionada(reserva); setVentana2(true)}} className='contenedorXReserva'>
                            {reserva.fecha}
                        </div>
                    ))}                    
                </div>
            )}

            {ventana1 && (
                <div className='modal'>
                    <div className='contenido-modal'>
                        <h2>Factura</h2>
                        <p><strong>ID:</strong> {factura.id}</p>
                        <p><strong>Fecha:</strong> {factura.fecha}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>cantidad</th>
                                    <th>articulo</th>
                                    <th>costo unitario</th>
                                    <th>subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {factura.detalles.map((detalle, i) => (
                                    <tr key={i}>
                                        <td>{detalle.cantidad}</td>
                                        <td>{detalle.articulo}</td>
                                        <td>{detalle.precio}</td>
                                        <td>{detalle.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> ${calcularTotal()}</p>
                        <div className='botones-modal'>
                            <button onClick={() => setVentana1(false)}>Cerrar</button>
                            <button onClick={sendFacturas}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {ventana2 && (
                <div className='modal'>
                    <div className='contenido-modal'>
                        <h2>Tiquete de Reserva</h2>
                        <p><strong>ID:</strong> {reservaSeleccionada.idreserva}</p>
                        <p><strong>Fecha:</strong> {reservaSeleccionada.fecha}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>cantidad</th>
                                    <th>articulo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservaSeleccionada.productos.map((producto) => (
                                    <tr key={producto.idproducto}>
                                        <td>{producto.cantidad} {producto.cantidad > 1 ? 'Libras' : 'Libra'}</td>
                                        <td>{producto.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> ${reservaSeleccionada.valor}</p>
                        <div className='botones-modal'>
                            <button onClick={() => setVentana2(false)}>Cerrar</button>
                            <button onClick={chageEstado}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Detalleventas