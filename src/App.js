import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
    const goTo = useNavigate();
    const [tipo, setTipo] = useState('Tipo');
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:8000/get-products')

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
    }, []);

    return (
        <div className='principal'>
            <header className='cabezera-principal'>
                <h1>Carniceria Integral</h1>
                <button onClick={() => {goTo('/Ingreso')}}>Ingreso Empleados</button>
            </header>
            <main className='contenido-principal'>

                <section className='seccion-buscadores'>
                    <input type='text' placeholder='Que deseas?' className='buscador'/>
                    <select className='select' value={tipo}
                        onChange={(e) => setTipo(e.target.value)} id='i4' title='Tipo'>
                        <option disabled >Tipo</option>
                        <option>Res</option>
                        <option>Cerdo</option>
                        <option>Pollo</option>
                    </select>
                </section>
                
                <section className='seccion-productos'>
                    {productos.map((producto) => (
                        <div key={producto.idproducto} className="producto">
                        <p><strong>ID:</strong> {producto.idproducto}</p>
                        <p><strong>Tipo:</strong> {producto.tipoproducto}</p>
                        <p><strong>Nombre:</strong> {producto.nombreproducto}</p>
                        <p><strong>Cantidad x Libra:</strong> {producto.cantidadxlibra}</p>
                        <p><strong>Fecha de Compra:</strong> {producto.fechacompra}</p>
                        <p><strong>Fecha de Vencimiento:</strong> {producto.fechavencimiento}</p>
                        <p><strong>Precio x Libra:</strong> {producto.precioxlibra}</p>
                        </div>
                    ))}
                </section>

            </main>
        </div>
    );
}

export default App;