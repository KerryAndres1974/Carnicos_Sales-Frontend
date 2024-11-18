import { useNavigate } from 'react-router-dom'
import '../estilos/Inventario.css'
import { useAuth } from '../Auth/AuthProvider';
import { useEffect, useState } from 'react';

function Inventario() {
    const auth = useAuth();
    const goTo = useNavigate();
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    const [productos, setProductos] = useState([]);

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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombreproducto: nombre,
                        tipoproducto: tipo
                    })
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
    }, [tipo, nombre])

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

                <section className='seccion-buscadores'>
                    <input 
                        type='text'
                        placeholder='Nombre del producto'
                        className='buscador'
                        onChange={(e) => setNombre(e.target.value)} />

                    <select 
                        value={tipo}
                        className='select' 
                        onChange={(e) => {e.target.value === 'Tipo' ? setTipo('') : setTipo(e.target.value)}}
                        title='Tipo' >
                        <option>Tipo</option>
                        <option>Res</option>
                        <option>Cerdo</option>
                        <option>Pollo</option>
                        <option>Cordero</option>
                        <option>Pavo</option>
                        <option>Pescado</option>
                    </select>
                </section>

                <section className='seccion-tabla'>
                    <header className='cabeza-tabla'>
                        <div className='celda'>Id_Producto</div>
                        <div className='celda'>Tipo Producto</div>
                        <div className='celda'>Nombre</div>
                        <div className='celda'>Cantidad(lbr)</div>
                        <div className='celda'>Fecha Compra</div>
                        <div className='celda'>Fecha Vencimiento</div>
                        <div className='celda'>Precio(lbr)</div>
                    </header>
                    <body className='cuerpo-tabla'>
                        {productos.map((producto) => (
                            <div className='elementos' key={producto.idproducto}>
                                <div className='celda'>{producto.idproducto}</div>
                                <div className='celda'>{producto.tipoproducto}</div>
                                <div className='celda'>{producto.nombreproducto}</div>
                                <div className='celda'>{producto.cantidadxlibra}</div>
                                <div className='celda'>{producto.fechacompra}</div>
                                <div className='celda'>{producto.fechavencimiento}</div>
                                <div className='celda'>{producto.precioxlibra}</div>
                            </div>
                        ))}
                    </body>
                </section>
                
            </main>
        </div>
    );
}

export default Inventario