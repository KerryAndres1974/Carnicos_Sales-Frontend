import { useNavigate } from 'react-router-dom'
import '../estilos/Inventario.css'
import { useAuth } from '../Auth/AuthProvider';
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
    const [allTipos, setAllTipos] = useState([]);
    const [allProve, setAllProve] = useState([]);
    // Edicion
    const [editar, setEditar] = useState(false);
    const [item, setItem] = useState(
        { tipo: '', nombre: '', idprovee: '', preciol: '', cantidad: '', fechac: '', fechav: '', precioc: '', activo: true });

    const logeado = () => {
        const access = auth.login();
        return access;
    }

    const deslogeado = () => {
        window.location.reload();
        auth.logout();
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
        cargarProductos()
    }, [tipo, nombre, allTipos])

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

            const updatedItem = await new Promise((resolve) => {
                setItem((prevItem) => {
                    const newItem = accion ? { ...prevItem, activo: false } : prevItem;
                    resolve(newItem);
                    return newItem;
                });
            });

            const response = await fetch(`http://localhost:8000/edit-product/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    text: 'Producto editado con exito!',
                    toast: true,
                    color: 'green',
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
                {logeado().role === 'vendedor' && <div>
                    <button onClick={() => {goTo('/Detalleventas')}}>ventas</button>
                    <button onClick={deslogeado}>salir</button>
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
                        defaultValue="Tipo"
                        className='select' 
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
                        <div className='celda'></div>
                    </div>

                    <div className='cuerpo-tabla'>
                        {productos.map((producto) => (
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
                                            onChange={(e) => setItem({ ...item, idprovee: e.target.value })}>
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
                                        onChange={(e) => setItem({ ...item, tipo: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='text'
                                        value={item.nombre}
                                        placeholder={producto.nombreproducto}
                                        onChange={(e) => setItem({ ...item, nombre: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='number'
                                        value={item.preciol}
                                        placeholder={producto.precioxlibra}
                                        onChange={(e) => setItem({ ...item, preciol: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='number'
                                        value={item.cantidad}
                                        placeholder={producto.cantidadxlibra}
                                        onChange={(e) => setItem({ ...item, cantidad: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='date'
                                        value={item.fechac}
                                        placeholder={producto.fechacompra}
                                        onChange={(e) => setItem({ ...item, fechac: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='date'
                                        value={item.fechav}
                                        placeholder={producto.fechavencimiento}
                                        onChange={(e) => setItem({ ...item, fechav: e.target.value })}/></div>
                                    <div className='celda'><input 
                                        type='text'
                                        value={item.precioc}
                                        placeholder={producto.preciocompra}
                                        onChange={(e) => setItem({ ...item, precioc: e.target.value })}/></div>
                                </>}

                                <div className='celda' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
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
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
            </main>
        </div>
    );
}

export default Inventario