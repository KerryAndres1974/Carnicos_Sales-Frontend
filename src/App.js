import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function App() {
    const goTo = useNavigate();
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    const [cantidades, setCantidades] = useState('');
    const [reservados, setReservados] = useState({});
    const [productos, setProductos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [ventana, setVentana] = useState(false);
    const [factura, setFactura] = useState(null);
    const [domicilio, setDomicilio] = useState(false);

    const [infoUser, setInfoUser] = useState({ cor: '', nom: '', dir: '', tel: '', })
    
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
    }, [tipo, nombre]);

    async function sendReservas(e) {
        e.preventDefault();

        if (domicilio) {
            const camposFaltantes = Object.entries(infoUser).filter(([_, valor]) => !valor);
            if (camposFaltantes.length > 0) {
                alert('Debes llenar todos los campos para pedir a domicilio');
                return;
            }
        }

        const datos = JSON.stringify({ reserva: reservados, cliente: infoUser })
        
        try {
            const response = await fetch('http://localhost:8000/new-reserva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: datos
            });

            if (response.ok) {
                alert('Se ha reservado su pedido con exito');
                window.location.reload();
            } else {
                throw new Error('Error en la solicitud al backend');
            }

        } catch (error) {
            console.error('Error al enviar los datos al backend:', error);
        }
    }

    const calcularTotal = () =>{
        if (!factura || !factura.detalles) return 0;
        return factura.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    };

    const reservar = () => {
        if (seleccionados.length > 0) {
            setVentana(true);
            const idfactura = uuidv4();
            const fecha = new Date().toLocaleString();

            let total = 0;
            const detalles = productos
            .filter((producto) => seleccionados.includes(producto.idproducto))
            .map((producto) => {
                const cantidad = cantidades[producto.idproducto] || 0;  
                total += producto.precioxlibra * cantidad;
                return {
                    cantidad: cantidad, 
                    articulo: producto.nombreproducto,
                    costoSinIVA: producto.precioxlibra,
                    subtotal: producto.precioxlibra * cantidad,
                    idp: producto.idproducto
                }
            });
            
            const reservadosData = detalles.map((detalle) => ({
                idproducto: detalle.idp,
                cantidad: detalle.cantidad
            }));
            
            setReservados({ id: idfactura, fecha: fecha, producto: reservadosData, valor: total });
            setFactura({ id: idfactura, fecha: fecha, detalles: detalles })
        }
    }

    const añadir = (idproducto) => {
        setSeleccionados((prevSeleccion) => {
            if (prevSeleccion.includes(idproducto)) {
                return prevSeleccion.filter((id) => id !== idproducto);
            } else {
                return [...prevSeleccion, idproducto]
            }
        });
    };

    return (
        <div className='principal'>

            <header className='cabezera-principal'>
                <h1>Cárnicos Sales</h1>
                <button onClick={() => {goTo('/Ingreso')}}>Ingreso Empleados</button>
            </header>

            <main className='contenido-principal'>

                <section className='seccion-buscadores'>
                    <input 
                        type='text'
                        placeholder='Que deseas?'
                        className='buscador'
                        onChange={(e) => setNombre(e.target.value)} />

                    <select 
                        value={tipo}
                        className='select' 
                        onChange={(e) => {e.target.value === 'Tipo' ? setTipo('') : setTipo(e.target.value)}}
                        title='Tipo' 
                    >
                        <option>Tipo</option>
                        <option>Res</option>
                        <option>Cerdo</option>
                        <option>Pollo</option>
                        <option>Cordero</option>
                        <option>Pavo</option>
                        <option>Pescado</option>
                    </select>
                </section>
                
                <section className='seccion-productos'>
                    {productos.map((producto) => (
                        <div className='producto' key={producto.idproducto}>
                            <div>
                                <p><strong>Tipo:</strong> {producto.tipoproducto}</p>
                                <p><strong>Nombre:</strong> {producto.nombreproducto}</p>
                                <p><strong>Precio por Libra:</strong> {producto.precioxlibra}</p>
                                <p><strong>Libras Restantes:</strong> {producto.cantidadxlibra}</p>
                            </div>

                            <div className='editables'>
                                <input 
                                    disabled={!seleccionados.includes(producto.idproducto)}
                                    type='number' placeholder='Libras' 
                                    className='libras'
                                    value={cantidades[producto.idproducto] || ''}
                                    onChange={(e) => setCantidades({ ...cantidades, [producto.idproducto]: e.target.value })}
                                    min={1} />

                                <button 
                                    className={`boton ${seleccionados.includes(producto.idproducto) ? "seleccionado" : ""}`}
                                    onClick={() => {añadir(producto.idproducto)}} >
                                    {seleccionados.includes(producto.idproducto) ? "Desagregar" : "Agregar"}
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
                
            </main>

            <footer className='contenedor-boton'>
                <button 
                    className={`boton-e ${seleccionados.length >= 1 ? "activado" : ""}`}
                    onClick={reservar}>
                    {seleccionados.length >= 1 ? (seleccionados.length >= 2 ? `Reservar ${seleccionados.length} Productos` : 'Reservar Producto') : 'Reservar'}
                </button>
            </footer>

            {ventana && 
                <div className='modal'>
                    <div className='contenido-modal'>
                        <h2>Tiquete de Reserva</h2>
                        <p><strong>ID:</strong> {factura.id}</p>
                        <p><strong>Fecha:</strong> {factura.fecha}</p>
                        <div className='campo'>

                            <input 
                                type='text' 
                                placeholder='Correo Electronico' 
                                value={infoUser.cor}
                                onChange={(e) => setInfoUser((prev) => ({ ...prev, cor: e.target.value }))} />
                            
                            <input 
                                type='text' 
                                placeholder='Nombre del Cliente' 
                                value={infoUser.nom}
                                onChange={(e) => setInfoUser((prev) => ({ ...prev, nom: e.target.value }))} />

                            {!domicilio && <button onClick={() => 
                                alert('Estos campos son opcionales, queremos almacenar tu informacion para futuros descuentos o recompensas.')}>?
                            </button>}

                        </div>

                        {domicilio && <div className='campo'>
                            <input 
                                type='text' 
                                placeholder='Direccion' 
                                value={infoUser.dir} 
                                onChange={(e) => setInfoUser((prev) => ({ ...prev, dir: e.target.value }))} />

                            <input 
                                type='text' 
                                placeholder='Numero Telefono' 
                                value={infoUser.tel} 
                                onChange={(e) => setInfoUser((prev) => ({ ...prev, tel: e.target.value }))} />
                        </div>}

                        <table>
                            <thead>
                                <tr>
                                    <th>Cantidad</th>
                                    <th>Articulo</th>
                                    <th>Costo Unitario</th>
                                    <th>Subtotal</th>
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

                        <div className='botones-modal'>
                            <button onClick={() => setVentana(false)}>Cancelar</button>
                            <button onClick={sendReservas}>Confirmar Reserva</button>
                            <button onClick={() => setDomicilio((prev) => !prev)}>Pedir Domicilio</button>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}

export default App;