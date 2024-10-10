import '../hojasEstilos/Proveedores.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Proveedores() {
    const goTo = useNavigate()
    const [proveedores, setProveedores] = useState([])
    const [inputs, setInputs] = useState(false)
    const [texto, setTexto] = useState('Añadir Proveedor')
    const [filas, setFilas] = useState([
        {Nit: '', nombre: '', telefono: '', direccion: '', tipo: ''}])
    
    useEffect(() => {
        
        const cargarProveedores = async () => {
            // logica para traer los proovedores desde el backend
            try {
                const respuesta = await fetch('http://localhost:8000/get-providers')

                if (respuesta.ok) {
                    const datos = await respuesta.json()
                    setProveedores(datos)
                } else {
                    alert('Error al obtener los proveedores')
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error)
            }
        }
        cargarProveedores()
    }, [])

    const habilitar = () => {
        setInputs(true)

        if (texto === 'Guardar') {
            const filaActual = filas[filas.length - 1]

            if (filaActual.Nit && filaActual.nombre && filaActual.telefono &&
                filaActual.direccion && filaActual.tipo) {
                
                const nuevasFilas = [...filas, { Nit: '', nombre: '', telefono: '', direccion: '', tipo: '' }];
                setFilas(nuevasFilas);

                let datosJSON = JSON.stringify({
                    nit: filaActual.Nit,
                    nombre: filaActual.nombre,
                    telefono: filaActual.telefono,
                    direccion: filaActual.direccion,
                    tipo: filaActual.tipo
                })

                fetch('http://localhost:8000/new-provider', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: datosJSON
                })
                .then(data => {
                    console.log('Respuesta del backend:', data);
                })
                .catch(error => {
                    console.error('Error al enviar los datos al backend:', error);
                })

                setTexto('Añadir Proveedor')

            } else alert('llena todos los campos')

        } else setTexto('Guardar')
    } 

    const handleInputChange = (e, index, campo) => {
        const nuevasFilas = [...filas];
        nuevasFilas[index][campo] = e.target.value;
        setFilas(nuevasFilas);
    };

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
                        </tr>
                    </thead>
                    <tbody className='elementos'>
                        {proveedores.map((proveedor) => (
                            <tr key={proveedor.idproveedor}>

                                <td>{proveedor.idproveedor}</td>
                                <td>{proveedor.nombreproveedor}</td>
                                <td>{proveedor.numerotelefono}</td>
                                <td>{proveedor.direccion}</td>
                                <td>{proveedor.tipoproducto}</td>
                                
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