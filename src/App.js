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
    const [seleccionados, setSeleccionados] = useState([]);
    const [cantidades, setCantidades] = useState({});
    const [reservados, setReservados] = useState({});
    const [productos, setProductos] = useState([]);
    const [allTipos, setAllTipos] = useState([]);
    // Acciones
    const [modal, setModal] = useState(false);
    const [factura, setFactura] = useState(null);
    const [domicilio, setDomicilio] = useState(false);
    const [realizado, setRealizado] = useState(false);
    // Clientes
    const [infoUser, setInfoUser] = useState({ cor: '', nom: '', dir: '', tel: '', });
    
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:8000/productos');

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
    }, [allTipos]);

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
            const response = await fetch('http://localhost:8000/reservas', {
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
                    const descuento = producto.precioxlibra - (producto.precioxlibra * 0.5);

                    total += producto.precioxlibra * cantidad;
                    return {
                        cantidad: cantidad, 
                        articulo: producto.nombreproducto,
                        costoSinIVA: producto.promocion ? descuento : producto.precioxlibra,
                        subtotal: producto.promocion ? descuento * cantidad : producto.precioxlibra * cantidad,
                        idp: producto.idproducto
                    };
                });
                
            const reservadosData = detalles.map((detalle) => ({
                id: detalle.idp,
                nombre: detalle.articulo,
                cantidad: detalle.cantidad
            }));
            
            setReservados({ id: idfactura, fecha: fecha, producto: reservadosData, valor: total });
            setFactura({ id: idfactura, fecha: fecha, detalles: detalles });
            setModal(true);
        }
    }

    const añadir = (idproducto) => {
        setSeleccionados((prev) => {
            if (prev.includes(idproducto)) {
                return prev.filter((id) => id !== idproducto);
            } else {
                return [...prev, idproducto];
            }
        });
    };

    const finalizarReserva = () => {
        setModal(false);
        setRealizado(false);

        if (realizado) window.location.reload();
    }

    return (
        <div className='principal'>

            <header className='cabezera-principal'>
                <h1>Cárnicos Sales</h1>
                <button onClick={() => goTo('/Ingreso')}>Ingreso Empleados</button>
            </header>

            <main className='contenido-principal'>

                <section className='seccion-buscadores'>
                    <input 
                        type='text'
                        value={nombre}
                        className='buscadorN'
                        placeholder='Que deseas?'
                        onChange={(e) => setNombre(e.target.value)} />

                    <select 
                        value={tipo}
                        className='buscadorT' 
                        style={{ height: '100%' }}
                        onChange={(e) => {e.target.value === 'Tipo' ? setTipo('') : setTipo(e.target.value)}} >
                        <option>Tipo</option>
                        {allTipos.map((tipo, i) => (
                            <option key={i} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </section>
                
                <section className='seccion-productos'>
                    {productos
                        .filter((producto) => {
                            const selectNombre = nombre === '' || producto.nombreproducto.toLowerCase().includes(nombre.toLowerCase());
                            const selectTipo = tipo === '' || producto.tipoproducto === tipo;
                            return selectNombre && selectTipo;
                        })
                        .map((producto) => (
                            <div className='producto' key={producto.idproducto}>
                                <div>
                                    {producto.promocion ? 
                                        <p style={{ color: 'green' }}><strong>GRAN DESCUENTO</strong></p> : null }
                                    <p><strong>Nombre:</strong> {producto.nombreproducto}</p>
                                    <p><strong>Tipo:</strong> {producto.tipoproducto}</p>
                                    {producto.promocion ? 
                                        <p><strong>Precio por Libra (Antes):</strong> {producto.precioxlibra}</p> : 
                                        <p><strong>Precio por Libra:</strong> {producto.precioxlibra}</p>}
                                    {producto.promocion ? 
                                        <p><strong>Precio por Libra (Ahora):</strong> {producto.precioxlibra - (producto.precioxlibra * 0.5)}</p> : null }
                                    <p><strong>Libras Restantes:</strong> {producto.cantidadxlibra}</p>
                                </div>

                                <div className='editables'>
                                    <input 
                                        min={1}
                                        type='number'
                                        className='libras'
                                        placeholder='Libras' 
                                        value={cantidades[producto.idproducto] || ''}
                                        disabled={!seleccionados.includes(producto.idproducto)}
                                        onChange={(e) => setCantidades({ ...cantidades, [producto.idproducto]: e.target.value })} />

                                    <button 
                                        className={`boton ${seleccionados.includes(producto.idproducto) ? "seleccionado" : ""}`}
                                        onClick={() => {añadir(producto.idproducto)}} >
                                        {seleccionados.includes(producto.idproducto) ? "Desagregar" : "Agregar"}
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </section>
                
            </main>

            <footer className='contenedor-boton'>
                <button 
                    className={`boton-e ${seleccionados.length >= 1 ? "activado" : ""}`}
                    onClick={reservar}>
                    {seleccionados.length >= 1 ? (seleccionados.length >= 2 ? `Reservar ${seleccionados.length} Productos` : 'Reservar Producto') : 'Reservar'}
                </button>
            </footer>

            {modal && <div className='modal'>
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
                            value={infoUser.cor}
                            placeholder='Correo Electronico' 
                            onChange={(e) => setInfoUser((prev) => ({ ...prev, cor: e.target.value }))} />
                        
                        <input 
                            type='text' 
                            value={infoUser.nom}
                            placeholder='Nombre del Cliente' 
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
                            value={infoUser.dir} 
                            placeholder='Direccion' 
                            onChange={(e) => setInfoUser((prev) => ({ ...prev, dir: e.target.value }))} />

                        <input 
                            type='text' 
                            value={infoUser.tel} 
                            placeholder='Numero Telefono' 
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
                        <button onClick={() => finalizarReserva()}>
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