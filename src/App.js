import { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

function App() {
    // Navegacion
    const goTo = useNavigate();
    // Busqueda
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    // Resultados
    const [cantidades, setCantidades] = useState('');
    const [reservados, setReservados] = useState({});
    const [productos, setProductos] = useState([]);
    const [allTipos, setAllTipos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    // Acciones
    const [ventana, setVentana] = useState(false);
    const [factura, setFactura] = useState(null);
    const [domicilio, setDomicilio] = useState(false);
    const [realizado, setRealizado] = useState(false);
    // Clientes
    const [infoUser, setInfoUser] = useState({ cor: '', nom: '', dir: '', tel: '', });
    
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
                    const datos = await respuesta.json();
                    setProductos(datos);

                    if (allTipos.length === 0) {
                        const tipos = [...new Set(datos.map((producto) => producto.tipoproducto))];
                        setAllTipos(tipos);
                    }
                } else {
                    alert('Error al obtener los productos');
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error);
            }
        }
        cargarProductos();
    }, [tipo, nombre, allTipos]);

    async function sendReservas(e) {
        e.preventDefault();

        if (domicilio) {
            const camposFaltantes = Object.entries(infoUser).filter(([_, valor]) => !valor);
            if (camposFaltantes.length > 0) {
                Swal.fire({
                    icon: 'error',
                    text: 'Debes llenar todos los campos para pedir a domicilio!',
                    toast: true,
                    color: 'red',
                    showConfirmButton: false,
                    timer: 4000,
                    position: 'top-end',
                    timerProgressBar: true,
                });
                return;
            }
        }

        const datos = JSON.stringify({ reserva: reservados, cliente: infoUser });
        
        try {
            const response = await fetch('http://localhost:8000/new-reserva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: datos
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    text: 'Se ha reservado su pedido con exito!',
                    toast: true,
                    color: 'green',
                    showConfirmButton: false,
                    timer: 4000,
                    width: '30%',
                    position: 'top-end',
                    timerProgressBar: true,
                }).then(() => setRealizado(true));
            } else {
                throw new Error('Error en la solicitud al backend');
            }

        } catch (error) {
            console.error(error);
        }
    }

    const calcularTotal = () =>{
        if (!factura || !factura.detalles) return 0;
        return factura.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    };

    const reservar = () => {
        if (seleccionados.length > 0) {
            const idfactura = uuidv4().split('-')[0];
            const fecha = new Date().toLocaleString();

            let total = 0;

            const tieneError = productos.some((producto) => {
                if (seleccionados.includes(producto.idproducto)) {
                    const cantidad = cantidades[producto.idproducto] || 0;
                    if (cantidad <= 0 || cantidad > parseInt(producto.cantidadxlibra)) {
                        Swal.fire({
                            icon: 'error',
                            text: `No podemos venderte ${cantidad} libras de ${producto.nombreproducto}`,
                            toast: true,
                            color: 'red',
                            width: '40%',
                            timer: 3000,
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true
                        });
                        return true;
                    }
                }
                return false;
            });

            if (tieneError) return;

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
                    };
                });
                
            const reservadosData = detalles.map((detalle) => ({
                nombre: detalle.articulo,
                cantidad: detalle.cantidad
            }));
            
            setReservados({ id: idfactura, fecha: fecha, producto: reservadosData, valor: total });
            setFactura({ id: idfactura, fecha: fecha, detalles: detalles });
            setVentana(true);
        }
    }

    const añadir = (idproducto) => {
        setSeleccionados((prevSeleccion) => {
            if (prevSeleccion.includes(idproducto)) {
                return prevSeleccion.filter((id) => id !== idproducto);
            } else {
                return [...prevSeleccion, idproducto];
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
                        {allTipos.map((tipo, i) => (
                            <option key={i} value={tipo}>
                                {tipo}
                            </option>
                        ))}
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

            {ventana && <div className='modal'>
                <div className='contenido-modal'>
                    <h2>Tiquete de Reserva</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div><strong>ID: </strong>{factura.id}</div>
                        <strong style={{ color: 'green' }}>
                            {realizado ? 'Guarda este codigo para reclamar tu pedido' : ''}
                        </strong>
                    </div>
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
                            Swal.fire({
                                icon: 'info',
                                text: 'Estos campos son opcionales, queremos almacenar tu informacion para futuros descuentos o recompensas.',
                                toast: true,
                                color: 'blue',
                                width: '40%',
                                position: 'top-end',
                                timer: 5000,
                                timerProgressBar: true,
                                showConfirmButton: false
                            })
                        }>
                            ?
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
                        <button onClick={() => {setVentana(false); setRealizado(false)}}>
                            {realizado ? 'Cerrar' : 'Cancelar'}
                        </button>
                        <button onClick={sendReservas} disabled={realizado === true}>Confirmar Reserva</button>
                        <button onClick={() => setDomicilio((prev) => !prev)} disabled={realizado === true}>
                            {!domicilio ? 'Pedir Domicilio' : 'No Domicilio'}
                        </button>
                    </div>
                </div>

            </div>}

        </div>
    );
}

export default App;