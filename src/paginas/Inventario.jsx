import { useNavigate } from 'react-router-dom'
import '../estilos/Inventario.css'
import { useAuth } from '../auth/AuthProvider';
import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Inventario() {
    // Navegacion
    const auth = useAuth();
    const goTo = useNavigate();
    // Busqueda
    const [tipo, setTipo] = useState('');
    const [nombre, setNombre] = useState('');
    // Resultados
    const [productos, setProductos] = useState([]);
    const [allProve, setAllProve] = useState([]);
    const [allTipos, setAllTipos] = useState([]);
    // Edicion
    const [editar, setEditar] = useState(false);
    const [item, setItem] = useState({});
    const [empleado, setEmpleado] = useState([]);

    const deslogeado = () => {
        window.location.reload();
        auth.logout();
    }

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await fetch('http://localhost:8000/productos');

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setProductos(datos);

                    if (allTipos.length === 0) {
                        const tipos = [...new Set(datos.map((producto) => producto.tipoproducto))];
                        const prove = [...new Set(datos.map((producto) => producto.idproveedor))];
                        setAllTipos(tipos);
                        setAllProve(prove);
                    }
                } else {
                    alert('Error al obtener los productos');
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error);
            }
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Divide el token en sus partes: encabezado, carga útil y firma
                const [, cargaUtilBase64, ] = token.split('.');

                // Decodifica la carga útil (segunda parte del token)
                const cargaUtilDecodificada = atob(cargaUtilBase64);

                // Convierte la carga útil decodificada a un objeto JavaScript
                const usuario = JSON.parse(cargaUtilDecodificada);

                // Puedes establecer el usuario en el estado
                setEmpleado(usuario);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
            }
        }

        cargarProductos()
    }, [allTipos])

    async function editProducto(id, accion) {
        
        if (accion) {
            const result = await Swal.fire({
                icon: 'question',
                text: '¿Seguro de eliminar este producto de inventario?',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar',
                cancelButtonText: 'No, cancelar'
            });

            if (!result.isConfirmed) {
                return;
            }
        }
        
        try {

            const activoItem = await new Promise((resolve) => {
                setItem((prevItem) => {
                    const newItem = accion ? { ...prevItem, activo: false } : prevItem;
                    resolve(newItem);
                    return newItem;
                });
            });

            const filtroItem = Object.fromEntries(
                Object.entries(activoItem).filter(([_, valor]) => valor !== '')
            );

            const response = await fetch(`http://localhost:8000/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtroItem)
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    text: accion ? 'Producto eliminado del inventario' : 'Producto editado con exito!',
                    toast: true,
                    width: accion ? '30%': '', 
                    color: accion ? 'red' : 'green',
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

    return(
        <div className='principal-inventario'>

            <header className='cabezera-inventario'>
                <h1>INVENTARIO</h1>
                {empleado.cargo === 'vendedor' && <div>
                    <button onClick={() => {goTo('/Detalleventas')}}>ventas</button>
                    <button onClick={deslogeado}>salir</button>
                </div>}
                {empleado.cargo === 'gerente' && <div>
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
                        defaultValue="Tipo"
                        className='buscadorT' 
                        style={{ height: '80%' }}
                        onChange={(e) => {e.target.value === 'Tipo' ? setTipo('') : setTipo(e.target.value)}}
                    >
                        <option>Tipo</option>
                        {allTipos.map((tipo, i) => (
                            <option key={i} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                </section>

                <section className='seccion-tabla'>
                    <div className='cabeza-tabla'>
                        <div className='celda'>Id_Producto</div>
                        <div className='celda'>Id_Proveedor</div>
                        <div className='celda'>Tipo Producto</div>
                        <div className='celda'>Nombre</div>
                        <div className='celda'>Precio(lbr)</div>
                        <div className='celda'>Cantidad(lbr)</div>
                        <div className='celda'>Fecha Compra</div>
                        <div className='celda'>Fecha Vencimiento</div>
                        <div className='celda'>Precio de Compra</div>
                        {empleado.cargo === 'gerente' ? <div className='celda'></div> : null}
                    </div>

                    <div className='cuerpo-tabla'>
                        {productos
                            .filter((producto) => {
                                const selectNombre = nombre === '' || producto.nombreproducto.toLowerCase().includes(nombre.toLowerCase());
                                const selectTipo = tipo === '' || producto.tipoproducto === tipo;
                                return selectNombre && selectTipo;
                            })
                            .map((producto) => (
                            <div className='elementos' key={producto.idproducto}>
                                {editar !== producto.idproducto ?
                                <>
                                    <div className='celda'>{producto.idproducto}</div>
                                    <div className='celda'>{producto.idproveedor}</div>
                                    <div className='celda'>{producto.tipoproducto}</div>
                                    <div className='celda'>{producto.nombreproducto}</div>
                                    <div className='celda'>{producto.precioxlibra}</div>
                                    <div className='celda'>{producto.cantidadxlibra}</div>
                                    <div className='celda'>{producto.fechacompra}</div>
                                    <div className='celda'>{producto.fechavencimiento}</div>
                                    <div className='celda'>{producto.preciocompra}</div>
                                </>
                                :
                                <>
                                    <div className='celda'>{producto.idproducto}</div>
                                    <div className='celda'>
                                        <select 
                                            defaultValue="Proveedor"
                                            onChange={(e) => setItem({ ...item, idproveedor: e.target.value })}>
                                            {allProve.map((prov, i) => (
                                                <option key={i} value={prov}>
                                                    {prov}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='celda'><input 
                                        type='text' 
                                        value={item.tipo}
                                        placeholder={producto.tipoproducto}
                                        onChange={(e) => setItem({ ...item, tipoproducto: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='text'
                                        value={item.nombre}
                                        placeholder={producto.nombreproducto}
                                        onChange={(e) => setItem({ ...item, nombreproducto: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='number'
                                        value={item.preciol}
                                        placeholder={producto.precioxlibra}
                                        onChange={(e) => setItem({ ...item, precioxlibra: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='number'
                                        value={item.cantidad}
                                        placeholder={producto.cantidadxlibra}
                                        onChange={(e) => setItem({ ...item, cantidadxlibra: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='date'
                                        value={item.fechac}
                                        placeholder={producto.fechacompra}
                                        onChange={(e) => {
                                            const fechaISO = e.target.value;
                                            const [año, mes, dia] = fechaISO.split('-');
                                            const fecha = `${dia}/${mes}/${año}`;
                                            setItem({ ...item, fechacompra: fecha });
                                        }}/></div>
                                    <div className='celda'><input 
                                        type='date'
                                        value={item.fechav}
                                        placeholder={producto.fechavencimiento}
                                        onChange={(e) => {
                                            const fechaISO = e.target.value;
                                            const [año, mes, dia] = fechaISO.split('-');
                                            const fecha = `${dia}/${mes}/${año}`;
                                            setItem({ ...item, fechavencimiento: fecha });
                                        }}/></div>
                                    <div className='celda'><input 
                                        type='text'
                                        value={item.precioc}
                                        placeholder={producto.preciocompra}
                                        onChange={(e) => setItem({ ...item, preciocompra: e.target.value })}/></div>
                                </>}

                                {empleado.cargo === 'gerente' ? <div className='celda' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    {editar === producto.idproducto && <FaTrash 
                                        title='Eliminar'
                                        style={{ color: 'red', cursor: 'pointer' }}
                                        onClick={() => {
                                            setItem((prevItem) => ({ ...prevItem, activo: false }));
                                            editProducto(producto.idproducto, true);
                                        }}/>}

                                    <FaEdit
                                        title='Editar'
                                        style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => setEditar((prev) => (prev === producto.idproducto ? null : producto.idproducto))} />

                                    {editar === producto.idproducto && <FaCheck 
                                        title='Confirmar'
                                        style={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => editProducto(producto.idproducto, false)}/>}
                                </div> : null}
                            </div>
                        ))}
                    </div>
                </section>
                
            </main>
        </div>
    );
}

export default Inventario