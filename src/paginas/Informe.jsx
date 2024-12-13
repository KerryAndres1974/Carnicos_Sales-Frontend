import '../estilos/Informe.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Informe() {
    const goTo = useNavigate();
    const [ventas, setVentas] = useState([]);
    const [compras, setCompras] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [vendidos, setVendidos] = useState([]);

    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [comprasFiltradas, setComprasFiltradas] = useState([]);
    const [informe, setInforme] = useState("Total");

    const [infoVentas, setInfoVentas] = useState(true);
    const [infoCompras, setInfoCompras] = useState(false);
    const [infoClientes, setInfoClientes] = useState(false);
    const [infoProductos, setInfoProductos] = useState(false);

    useEffect(() => {
        const cargarElementos = async () => {
            try {
                const venta = await fetch('http://localhost:8000/ventas');
                const compra = await fetch('http://localhost:8000/productos');
                const cliente = await fetch('http://localhost:8000/ventas/clientes');
                const empleado = await fetch('http://localhost:8000/empleados');
                const vendidos = await fetch('http://localhost:8000/productos/vendidos');

                if (venta.ok) {
                    const datos = await venta.json();
                    setVentas(datos);
                } else {
                    throw new Error('Error al obtener las ventas');
                }

                if (compra.ok) {
                    const datos = await compra.json();
                    setCompras(datos);
                } else {
                    throw new Error('Error al obtener las compras');
                }

                if (cliente.ok) {
                    const datos = await cliente.json();
                    setClientes(datos);
                } else {
                    throw new Error('Error al obtener las compras');
                }

                if (empleado.ok) {
                    const datos = await empleado.json();
                    setEmpleados(datos);
                } else {
                    throw new Error('Error al obtener las compras');
                }

                if (vendidos.ok) {
                    const datos = await vendidos.json();
                    setVendidos(datos);
                } else {
                    throw new Error('Error al obtener los productos vendidos');
                }

            } catch (err) {
                console.error('Error al realizar la petición:', err);
            }
        };

        cargarElementos();
    }, []);

    // Filtrar elementos según el período seleccionado
    useEffect(() => {
        if (informe !== "Total") {
            const hoy = new Date();
            const inicioFiltro = new Date(hoy); // Clonamos la fecha de hoy

            if (informe === "Diario") {
                inicioFiltro.setHours(0, 0, 0, 0); // Comienzo del día
            } else if (informe === "Semanal") {
                inicioFiltro.setDate(hoy.getDate() - hoy.getDay()); // Inicio de la semana (domingo)
                inicioFiltro.setHours(0, 0, 0, 0);
            } else if (informe === "Mensual") {
                inicioFiltro.setDate(1); // Primer día del mes
                inicioFiltro.setHours(0, 0, 0, 0);
            }

            const ventasFiltradas = ventas.filter((venta) => {
                const fechaVenta = convertirFecha(venta.fecha);
                return fechaVenta >= inicioFiltro;
            });

            const comprasFiltradas = compras.filter((compra) => {
                const fechaCompra = convertirFecha(compra.fechacompra);
                return fechaCompra >= inicioFiltro;
            });

            setVentasFiltradas(ventasFiltradas);
            setComprasFiltradas(comprasFiltradas);
        } else {
            setVentasFiltradas(ventas);
            setComprasFiltradas(compras);
        }
    }, [informe, ventas, compras]);

    // Función para convertir la fecha del formato '29/11/2024, 10:28:28 p. m.' a objeto Date
    const convertirFecha = (fechaStr) => {
        // Si la fecha ya es un formato válido de Date, simplemente conviértela
        if (isNaN(Date.parse(fechaStr))) {
            // Si es del formato `29/11/2024, 10:28:28 p. m.`
            const [fecha, tiempo] = fechaStr.includes(", ") ? fechaStr.split(", ") : [fechaStr];
            const [dia, mes, año] = fecha.split("/").map(Number);

            if (tiempo) {
                const [hora, minutos, segundos] = tiempo
                    .replace(" p. m.", "")
                    .replace(" a. m.", "")
                    .split(":")
                    .map(Number);

                const hora24 = tiempo.includes("p. m.") && hora < 12 ? hora + 12 : hora % 24;

                return new Date(año, mes - 1, dia, hora24, minutos, segundos || 0);
            }
            
            return new Date(año, mes - 1, dia);
        }
    };

    async function contratar(idempleado, contrato) {
        
        Swal.fire({
            icon: 'question',
            text: contrato ? '¿Seguro de despedir empleado?' : '¿Seguro de contratar empleado?',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',

        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const response = await fetch(`http://localhost:8000/empleados/${idempleado}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contrato: !contrato }),
                    });

                    if (response.ok) {
                        await Swal.fire({
                            icon: 'success',
                            text: 'Proceso exitoso',
                            toast: true,
                            color: 'green',
                            showConfirmButton: false,
                            timer: 3000,
                            position: 'top',
                            timerProgressBar: true,
                        }).then(() => window.location.reload());
                    } else {
                        throw new Error('Error en la solicitud al backend');
                    }

                } catch (err) {
                    console.error('Error al realizar la petición:', err);
                }

            }
        });

    }

    async function promocion(idproducto, promo) {
        
        try {
            const response = await fetch(`http://localhost:8000/productos/${idproducto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promocion: !promo }),
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    text: 'Producto con descuento',
                    toast: true,
                    color: 'green',
                    showConfirmButton: false,
                    timer: 3000,
                    position: 'top',
                    timerProgressBar: true,
                }).then(() => window.location.reload());
            } else {
                throw new Error('Error en la solicitud al backend');
            }

        } catch (err) {
            console.error('Error al realizar la petición:', err);
        }
    }

    return (
        <div className="principal-informe">
            <header className="cabezera-informe">
                <h1>INFORME</h1>
                <button onClick={() => goTo('/Gerencia')}>Regresar</button>
            </header>            
            
            <main className="cuerpo-informe">

                <div className='secciones'>
                    <h1 onClick={() => {
                            setInfoVentas(true)
                            setInfoCompras(false)
                            setInfoClientes(false)
                            setInfoProductos(false)}}
                        className={ infoVentas ? 'hover' : '' }
                    >Informe de Ventas</h1>

                    <h1 onClick={() => {
                            setInfoCompras(true)
                            setInfoVentas(false)
                            setInfoClientes(false)
                            setInfoProductos(false)}}
                        className={ infoCompras ? 'hover' : '' }
                    >Informe de Compras</h1>

                    <h1 onClick={() => {
                            setInfoClientes(true)
                            setInfoVentas(false)
                            setInfoCompras(false)
                            setInfoProductos(false)}}
                        className={ infoClientes ? 'hover' : '' }
                    >Clientes y Empleados</h1>

                    <h1 onClick={() => {
                            setInfoProductos(true)
                            setInfoVentas(false)
                            setInfoCompras(false)
                            setInfoClientes(false)}}
                        className={ infoProductos ? 'hover' : '' }
                    >Productos</h1>

                </div>

                {infoVentas && <section className='contenedor-ventas'>
                    <div className='primera-seccion'>
                        <h2>Generar Informe</h2>
                        <select 
                            value={informe} 
                            className='buscadorT'
                            style={{ height: '50%' }}
                            onChange={(e) => setInforme(e.target.value)}
                        >
                            <option>Total</option>
                            <option>Diario</option>
                            <option>Semanal</option>
                            <option>Mensual</option>
                        </select>
                    </div>

                    {ventasFiltradas.length > 0 ? 
                        <div className='elementos'>
                            {ventasFiltradas.map((venta) => (
                                <div key={venta.id} className="elemento-card">
                                    <p><strong>ID Venta:</strong> {venta.id}</p>
                                    {venta.idvendedor ? <p>
                                        <strong>ID Vendedor:</strong> {venta.idvendedor}
                                    </p> : <strong>Hecho en reservas</strong>}
                                    <p><strong>Fecha:</strong> {venta.fecha}</p>
                                    <p><strong>Total Venta:</strong> ${venta.valor_compra}</p>
                                    <h4>Productos:</h4>
                                    <ul>
                                        {venta.producto.map((prod, index) => (
                                            <li key={index}>
                                                {prod.cantidad} {prod.cantidad > 1 ? 'Libras' : 'Libra'} de {prod.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        : <p>No hay ventas en el período seleccionado.</p>
                    }

                </section>}
                
                {infoCompras && <section className='contenedor-compras'>
                    <div className='primera-seccion'>
                        <h2>Generar Informe</h2>
                        <select 
                            value={informe} 
                            className='buscadorT'
                            style={{ height: '50%' }}
                            onChange={(e) => setInforme(e.target.value)}
                        >
                            <option>Total</option>
                            <option>Diario</option>
                            <option>Semanal</option>
                            <option>Mensual</option>
                        </select>
                    </div>
                    
                    {comprasFiltradas.length > 0 ? 
                        <div className='elementos'>
                            {Object.entries(
                                comprasFiltradas.reduce((acumulador, compra) => {
                                    const { fechacompra, idproducto, nombreproducto, cantidadxlibra, preciocompra } = compra;
                                    
                                    if (!acumulador[fechacompra]) {
                                        acumulador[fechacompra] = { total: 0, productos: [] };
                                    }
                                    
                                    acumulador[fechacompra].productos.push({ idproducto, nombreproducto, cantidadxlibra });
                                    acumulador[fechacompra].total += preciocompra;
                                    return acumulador;
                                }, {})
                            ).map(([fecha, data], index) => (
                                <div key={index} className="elemento-card">
                                <p><strong>Fecha:</strong> {fecha}</p>
                                <p><strong>Total Venta:</strong> ${data.total}</p>
                                <h4>Productos:</h4>
                                <ul>
                                    {data.productos.map((producto, idx) => (
                                        <li key={producto.idproducto || idx}>
                                            {producto.cantidadxlibra} Libras de {producto.nombreproducto}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            ))}
                        </div>
                        : <p>No hay compras en el período seleccionado.</p>
                    }

                </section>}

                {infoClientes && <section className='contenedor-clientes'>
                    
                    <h2>Clientes</h2>
                    <div className='cabeza'>
                        <p className='casilla'>Nombre</p>
                        <p className='casilla'>Correo</p>
                        <p className='casilla'>Telefono</p>
                        <p className='casilla'>Dirección</p>
                    </div>
                    {clientes.filter((cliente) => cliente.id !== 7).map((cliente) => (
                        <div className='fila' key={cliente.id}>
                            <p className='casilla'>{cliente.nombre}</p>
                            <p className='casilla'>{cliente.correo}</p>
                            <p className='casilla'>{cliente.telefono ? cliente.telefono : 'No tiene'}</p>
                            <p className='casilla'>{cliente.direccion ? cliente.direccion : 'No tiene'}</p>
                        </div>
                    ))}

                    <h2>Empleados</h2>
                    <div className='cabeza'>
                        <p className='casilla'>Nombre</p>
                        <p className='casilla'>Correo</p>
                        <p className='casilla'>Telefono</p>
                        <p className='casilla'>Acción de Contrato</p>
                    </div>
                    {empleados
                        .filter((empleado) => empleado.cargo !== 'gerente')
                        .map((empleado) => (
                        <div className='fila' key={empleado.id}>
                            <p className='casilla'>{empleado.nombre}</p>
                            <p className='casilla'>{empleado.correo}</p>
                            <p className='casilla'>{empleado.telefono ? empleado.telefono : 'No tiene'}</p>
                            <p className='casilla'>
                                <button onClick={() => contratar(empleado.id, empleado.contrato)}>{empleado.contrato ? 'Despedir' : 'Contratar'}</button>
                            </p>
                        </div>
                    ))}

                </section>}
                
                {infoProductos && <section className='contenedor-productos'>
                    <h2>Productos Vendidos</h2>
                    <div className='cabeza'>
                        <p className='casilla'>ID</p>
                        <p className='casilla'>Nombre</p>
                        <p className='casilla'>Cantidad (Lbr)</p>
                        <p className='casilla'>Inversión</p>
                        <p className='casilla'>Recuperado</p>
                    </div>
                    {Object.values(
                        vendidos.reduce((acc, vendido) => {
                            if (acc[vendido.id]) {
                                acc[vendido.id].cantidad += parseInt(vendido.cantidad, 10);
                            } else {
                                acc[vendido.id] = { ...vendido, cantidad: parseInt(vendido.cantidad, 10) };
                            }
                            return acc;
                        }, {}))
                        .sort((a, b) => b.cantidad - a.cantidad)
                        .map((vendido) => (
                        <div key={vendido.id} className='fila'>
                            <p className='casilla'>{vendido.id}</p>
                            <p className='casilla'>{vendido.nombre}</p>
                            <p className='casilla'>{vendido.cantidad}</p>
                            <p className='casilla'>{vendido.preciocompra}</p>
                            <p className='casilla'>{vendido.preciocompra - (vendido.precioxlibra * vendido.cantidad)}</p>
                        </div>
                    ))}

                    <h2>Productos por Agotarse</h2>
                    <div className='cabeza'>
                        <p className='casilla'>ID</p>
                        <p className='casilla'>Nombre</p>
                        <p className='casilla'>Tipo</p>
                        <p className='casilla'>Cantidad (Lbr)</p>
                        <p className='casilla'>No. Proveedor</p>
                    </div>
                    {compras
                        .filter((producto) => producto.cantidadxlibra <= 10)
                        .map((producto) => (
                        <div key={producto.idproducto} className='fila'>
                            <p className='casilla'>{producto.idproducto}</p>
                            <p className='casilla'>{producto.nombreproducto}</p>
                            <p className='casilla'>{producto.tipoproducto}</p>
                            <p className='casilla'>{producto.cantidadxlibra}</p>
                            <p className='casilla'>{producto.telefono}</p>
                        </div>
                    ))}
                    {compras.every((producto) => producto.cantidadxlibra > 10) && (
                        <div className='fila'>
                            <p className='casilla'>Poductos Suficientes</p>
                        </div>
                    )}

                    <h2>Productos prontos a vencer</h2>
                    <div className='cabeza'>
                        <p className='casilla'>ID</p>
                        <p className='casilla'>Nombre</p>
                        <p className='casilla'>Cantidad (Lbr)</p>
                        <p className='casilla'>Fecha Vencimiento</p>
                        <p className='casilla'>Promosionar (dcto)</p>
                    </div>
                    {compras
                        .filter((producto) => {
                            const [dia, mes, año] = (producto.fechavencimiento).split('/');
                            const fechaV = new Date(`${año}-${mes}-${dia}`);
                            const hoy = new Date();
                            const semana = new Date();
                            semana.setDate(hoy.getDate() + 7);
                            return fechaV >= hoy && fechaV <= semana;
                        })
                        .map((producto) => (
                        <div key={producto.idproducto} className='fila'>
                            <p className='casilla'>{producto.idproducto}</p>
                            <p className='casilla'>{producto.nombreproducto}</p>
                            <p className='casilla'>{producto.cantidadxlibra}</p>
                            <p className='casilla'>{producto.fechavencimiento}</p>
                            <p className='casilla'>
                                <button
                                    className={producto.promocion ? 'hidden' : ''} 
                                    disabled={producto.promocion === true}
                                    onClick={() => promocion(producto.idproducto, producto.promocion)}
                                >
                                    Promocionar
                                </button>
                            </p>
                        </div>
                    ))}
                </section>}

            </main>
        </div>
    );
}

export default Informe;
