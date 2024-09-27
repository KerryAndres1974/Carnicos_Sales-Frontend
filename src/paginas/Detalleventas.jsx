import '../hojasEstilos/Detalleventas.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../Auth/AuthProvider'
import { v4 as uuidv4 } from 'uuid'

function Detalleventas() {
    const auth = useAuth()
    const goTo = useNavigate()
    const [ventana, setVentana] = useState(false)
    const [factura, setFactura] = useState(null)
    const [filas, setFilas] = useState([
        {cantidad: '1', idProducto: '', articulo: '', costoSinIVA: '', iva: '', total: ''}])

    const logeado = () => {
        const accesstoken = auth.login()
        return accesstoken
    }

    const deslogeado = () => {
        window.location.reload()
        auth.logout()
    }

    const calcularTotal = () =>{
        return filas.reduce((acc, fila) => {
            const subtotal = parseFloat(fila.costoSinIVA || 0)
            return acc + (subtotal + (subtotal * (19 / 100)))
        }, 0).toFixed(2)
    }

    const validarFila = async (e, fila) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            const idp = e.target.value;
            
            try {
                const response = await fetch(`http://localhost:8000/verificar-producto/${idp}`);
                const data = await response.json();
    
                if (data) {
                    const producto = data[0]
                    const cantidad = document.getElementById(`cant-${fila}`).value
                    const nuevasFilas = [...filas];
                    nuevasFilas[fila].articulo = producto.nombreproducto; // Asignar nombre del producto
                    nuevasFilas[fila].costoSinIVA = parseFloat(producto.precioxlibra) * cantidad; // Asignar precio del producto
                    nuevasFilas[fila].iva = '19%'
                    nuevasFilas[fila].total = parseFloat(producto.precioxlibra * (19/100) * cantidad) + (parseFloat(producto.precioxlibra) * cantidad)
                    setFilas(nuevasFilas);

                    // Enfoque al input idProducto de la siguiente fila si existe
                    if (fila + 1 < filas.length) {
                        document.getElementById(`idProducto-${fila + 1}`).focus();
                    } else {
                        // Añadir una nueva fila si quieres seguir añadiendo
                        setFilas([...filas, { cantidad: '1', idProducto: '', articulo: '', costoSinIVA: '', iva: '', total: '' }]);
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
        const nuevasFilas = [...filas]
        nuevasFilas[fila][campo] = e.target.value
        setFilas(nuevasFilas)
    }

    const quitarFila = (i) => {
        if (filas.length <= 1){
            const reinicio = [...filas]
            reinicio[0].idProducto = ''
            setFilas(reinicio)
        } else {
            const nuevasFilas = filas.filter((_, fila) => fila !== i)
            setFilas(nuevasFilas)
        }
    }

    const ventaCancelada = () => {
        setFilas([{cantidad: '1', idProducto: '', articulo: '', costoSinIVA: '', iva: '', total: ''}])
    }

    const facturarVentas = () => {
        const idfactura = uuidv4()
        const fecha = new Date().toLocaleString()

        const detalles = filas.slice(0, -1).map(fila => {
            const subtotal = parseFloat(fila.cantidad) * parseFloat(fila.costoSinIVA)
            return {
                ...fila, subtotal: subtotal.toFixed(2)
            }
        })
        setFactura({ id: idfactura, fecha: fecha, detalles: detalles })
        setVentana(true)
    }

    const cerrarVentana = () => {
        setVentana(false)
        ventaCancelada()
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
                                <th>Costo sin IVA</th>
                                <th>IVA</th>
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
                                    <td><label className="Lcosto">{fila.costoSinIVA}</label></td>
                                    <td><label className="Liva">{fila.iva}</label></td>
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
                    <button className='boton' onClick={ventaCancelada}>Cancelar Venta</button>
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
                                        <td>{detalle.costoSinIVA}</td>
                                        <td>{detalle.subtotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p><strong>Total:</strong> ${calcularTotal()}</p>
                        <button onClick={cerrarVentana}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Detalleventas