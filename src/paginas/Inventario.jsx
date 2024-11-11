import { useNavigate } from 'react-router-dom'
import '../estilos/Inventario.css'
import { useAuth } from '../Auth/AuthProvider';
import { useEffect, useState } from 'react';

function Inventario() {
    const auth = useAuth()
    const goTo = useNavigate()
    const [productos, setProductos] = useState([])

    const logeado = () => {
        const access = auth.login()
        return access
    }

    const deslogeado = () => {
        window.location.reload()
        auth.logout()
    }

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:8000/get-products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (respuesta.ok) {
                    const datos = await respuesta.json()
                    setProductos(datos)
                } else {
                    alert('Error al obtener los productos')
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error)
            }
        }
        cargarProductos()
    }, [])

    return(
        <div className='principal-inventario'>
            <header className='cabezera-inventario'>
                <h1>INVENTARIO</h1>
                {logeado().role === 'vendedor' && <div>
                    <button onClick={deslogeado}>salir</button>
                    <button onClick={() => {goTo('/Detalleventas')}}>ventas</button>
                </div>}
                {logeado().role === 'gerente' && <div>
                    <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
                </div>}
            </header>
            <main className='contenido-inventario'>
                <table className='tabla'>
                    <thead className='titulos'>
                        <tr>
                            <th>Id_Producto</th>
                            <th>Tipo Producto</th>
                            <th>Nombre</th>
                            <th>Cantidad(lbr)</th>
                            <th>Fecha Compra</th>
                            <th>Fecha vencimiento</th>
                            <th>Precio(lbr)</th>
                        </tr>
                    </thead>
                    <tbody className='elementos'>
                        {productos.map((producto) => (
                            <tr key={producto.idproducto}>
                                <td>{producto.idproducto}</td>
                                <td>{producto.tipoproducto}</td>
                                <td>{producto.nombreproducto}</td>
                                <td>{producto.cantidadxlibra}</td>
                                <td>{producto.fechacompra}</td>
                                <td>{producto.fechavencimiento}</td>
                                <td>{producto.precioxlibra}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Inventario