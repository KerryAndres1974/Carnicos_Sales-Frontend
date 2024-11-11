import '../estilos/Detalleventas.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { v4 as uuidv4 } from 'uuid';

function Detalleventas() {
    const auth = useAuth();
    const goTo = useNavigate();
    const [ventana, setVentana] = useState(false);
    const [factura, setFactura] = useState(null);
    const [filas, setFilas] = useState([
        {cantidad: '1', idProducto: '', articulo: '', precio: '', total: ''}]);

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

    const validarFila = async (e, fila) => {
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
                    nuevasFilas[fila].articulo = producto.nombreproducto; // Asignar nombre del producto
                    nuevasFilas[fila].precio = parseFloat(producto.precioxlibra); // Asignar precio del producto
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
                    alert(`El producto ${idp} no existe en inventario.`);
                }
            } catch (error) {
                console.error('Error al verificar el producto:', error);
                alert('Error al verificar el producto.');
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
        const idfactura = uuidv4();
        const fecha = new Date().toLocaleString();

        const detalles = filas.slice(0, -1).map(fila => {
            const subtotal = parseFloat(fila.cantidad) * parseFloat(fila.precio);
            return {
                ...fila, subtotal: subtotal
            }
        })
        setFactura({ id: idfactura, fecha: fecha, detalles: detalles });
        setVentana(true);
    }

    async function sendFacturas(e) {
        e.preventDefault();

        const filasFiltradas = filas.slice(0,-1).map(fila => ({
            id: fila.idProducto,
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
                alert('Se ha finalizado la venta con exito');
                window.location.reload();
            } else {
                throw new Error('Error en la solicitud al backend');
            }
    
            const data = await response.json();
            console.log('Respuesta del backend:', data);

        } catch (error) {
            console.error('Error al enviar los datos al backend:', error);
        }
    }

    return (
        <div className='principal-ventas'>

            <header className='cabezera-ventas'>
                <h1>DETALLE DE VENTA</h1>

                {logeado().role === 'vendedor' && <div>
                    <button onClick={deslogeado}>salir</button>
                    <button onClick={() => {goTo('/Inventario')}}>inventario</button>
                </div>}

                {logeado().role === 'gerente' && <div>
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
                        <h2>Carniceria Integrada.</h2>
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

            {ventana && (
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
                            <button onClick={() => setVentana(false)}>Cerrar</button>
                            <button onClick={sendFacturas}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Detalleventas