import '../estilos/Proveedores.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

function Proveedores() {
    const goTo = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [inputs, setInputs] = useState(false);
    const [texto, setTexto] = useState('Añadir Proveedor');
    const [filas, setFilas] = useState([
        {Nit: '', nombre: '', telefono: '', direccion: '', tipo: ''}]);
    const [editar, setEditar] = useState(false);
    const [item, setItem] = useState({});
    
    useEffect(() => {
        
        const cargarProveedores = async () => {
            // logica para traer los proovedores desde el backend
            try {
                const respuesta = await fetch('http://localhost:8000/proveedores');

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setProveedores(datos);
                } else {
                    alert('Error al obtener los proveedores');
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error);
            }
        }
        cargarProveedores();
    }, []);

    async function habilitar(e) {
        e.preventDefault();
        setInputs(true);

        if (texto === 'Guardar') {
            const filaActual = filas[filas.length - 1]

            if (filaActual.Nit && filaActual.nombre && filaActual.telefono &&
                filaActual.direccion && filaActual.tipo) {

                const datosJSON = JSON.stringify({
                    nit: filaActual.Nit,
                    nombre: filaActual.nombre,
                    telefono: filaActual.telefono,
                    direccion: filaActual.direccion,
                    tipo: filaActual.tipo
                })

                try {
                    const response = await fetch('http://localhost:8000/proveedores', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', },
                        body: datosJSON
                    });

                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            text: 'Se agregó al proveedor con exito',
                            toast: true,
                            showConfirmButton: false,
                            timer: 4000,
                            width: '30%',
                            timerProgressBar: true,
                            color: 'green'
                        }).then(() => window.location.reload());
                    } else {
                        throw new Error('Error en la solicitud al backend');
                    }

                } catch (err) {
                    console.error(err);
                }

                setTexto('Añadir Proveedor');

            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'No se ha añadido ningun elemento',
                    toast: true,
                    color: 'red',
                    width: '30%',
                    showConfirmButton: false,
                    timer: 4000,
                    timerProgressBar: true
                });
            }

        } else setTexto('Guardar');
    } 

    const handleInputChange = (e, index, campo) => {
        const nuevasFilas = [...filas];
        nuevasFilas[index][campo] = e.target.value;
        setFilas(nuevasFilas);
    };

    async function editProveedor(id, accion) {
        
    }

    return(
        <div className='principal-proveedores'>
            <header className='cabezera-proveedores'>
                <h1>PROVEEDORES</h1>
                <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
            </header>
            <main className='contenido-proveedores'>
                <table className='tabla'>
                    <thead className='titulos'>
                        <tr>
                            <th>NIT</th>
                            <th>Nombre</th>
                            <th>Telefono</th>
                            <th>Direccion</th>
                            <th>Tipo Producto</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className='elementos'>
                        {proveedores.map((proveedor) => (
                            <tr key={proveedor.idproveedor}>

                                <td>{proveedor.idproveedor}</td>
                                <td>{proveedor.nombre}</td>
                                <td>{proveedor.telefono}</td>
                                <td>{proveedor.direccion}</td>
                                <td>{proveedor.tipoproducto}</td>
                                <td style={{ display: 'flex', justifyContent: 'space-around' }}>

                                    {editar === proveedor.idproveedor && <FaTrash 
                                        title='Eliminar'
                                        style={{ color: 'red', cursor: 'pointer' }}
                                        onClick={() => {
                                            setItem((prevItem) => ({ ...prevItem, activo: false }));
                                            editProveedor(proveedor.idproveedor, true);
                                        }}/>}

                                    <FaEdit
                                        title='Editar'
                                        style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => setEditar((prev) => (prev === proveedor.idproveedor ? null : proveedor.idproveedor))} />

                                    {editar === proveedor.idproveedor && <FaCheck 
                                        title='Confirmar'
                                        style={{ color: 'green', cursor: 'pointer' }}
                                        onClick={() => editProveedor(proveedor.idproveedor, false)}/>}

                                </td>
                                
                            </tr>
                            
                        ))}
                        {inputs &&
                            filas.map((fila, i) => (
                            <tr key={i}>
                                <td>
                                    <input 
                                        id={`nit-${i}`}
                                        type='text'
                                        placeholder='Nit'
                                        value={fila.Nit}
                                        onChange={(e) => handleInputChange(e, i, 'Nit')} />
                                </td>
                                <td>
                                    <input 
                                        id={`nom-${i}`}
                                        type='text'
                                        placeholder='Nombre Proveedor'
                                        value={fila.nombre}
                                        onChange={(e) => handleInputChange(e, i, 'nombre')} />
                                </td>
                                <td>
                                    <input 
                                        id={`tel-${i}`}
                                        type='text'
                                        placeholder='Telefono'
                                        value={fila.telefono}
                                        onChange={(e) => handleInputChange(e, i, 'telefono')} />
                                </td>
                                <td>
                                    <input 
                                        id={`dir-${i}`}
                                        type='text'
                                        placeholder='Dirección'
                                        value={fila.direccion} 
                                        onChange={(e) => handleInputChange(e, i, 'direccion')}/>
                                </td>
                                <td>
                                    <input 
                                        id={`tip-${i}`}
                                        type='text'
                                        placeholder='Tipo Producto'
                                        value={fila.tipo} 
                                        onChange={(e) => handleInputChange(e, i, 'tipo')} />
                                </td>
                            </tr>
                            ))}
                    </tbody>
                </table>
            </main>
            <footer className='piepagina-proveedor'>
                <button className='boton' onClick={habilitar} >
                    {texto}
                </button>
            </footer>
        </div>
    );
}

export default Proveedores