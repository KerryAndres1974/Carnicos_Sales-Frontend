import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../estilos/Compras.css';

function Compras() {
    const goTo = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [filas, setFilas] = useState([
        {cantidadxlibra: 1, precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: '', boton: false}
    ]);

    useEffect(() => {
        setFilas((prevFilas) => {
            const actualizadas = prevFilas.map((fila) => {
                const boton = Object.values(fila).every((valor) => valor !== "");
                if (fila.boton !== boton) {
                    return { ...fila, boton: boton };
                }
                return fila; // No hacer cambios si ya está correcto
            });
    
            // Evitar actualizar el estado si no hay cambios
            if (JSON.stringify(actualizadas) !== JSON.stringify(prevFilas)) {
                return actualizadas;
            }
            return prevFilas;
        });

        const cargarProveedores = async () => {
            // logica para traer los proovedores desde el backend
            try {
                const respuesta = await fetch('http://localhost:8000/proveedores');

                if (respuesta.ok) {
                    const datos = await respuesta.json();
                    setProveedores(datos.map((proveedor) => proveedor.idproveedor));
                } else {
                    alert('Error al obtener los proveedores');
                }
            } catch(error) {
                console.error('Error al realizar la petición:', error);
            }
        }
        cargarProveedores();
    }, [filas])

    const valorCasilla = (e, fila, campo) => {
        const nuevasFilas = [...filas];
        nuevasFilas[fila][campo] = e.target.value;
        setFilas(nuevasFilas);
    }

    const quitarFila = (i) => {
        const viejasFilas = [...filas];
        if (i === 0) {
            Object.keys(viejasFilas[i]).forEach((key) => {
                viejasFilas[i][key] = key === "cantidadxlibra" ? 1 : "";
            });
        } else {
            viejasFilas.splice(i, 1);
        }

        setFilas(viejasFilas);
    }

    const agregarFila = (fila) => {
        const filaActual = filas[filas.length - 1];
        
        if (filaActual.tipoproducto && filaActual.idproveedor && filaActual.nombreproducto &&
            filaActual.precioxlibra && filaActual.preciocompra){
                // logica para guardar la info de una fila y pasar a la siguiente
                const nuevasFilas = [...filas];
                setFilas(nuevasFilas);
                // enfoque a los inputs de la siguiente fila si existe
            if (fila + 1 < filas.length) {
                document.getElementById(`nombreproducto-${fila + 1}`).focus();
                document.getElementById(`tipoproducto-${fila + 1}`).focus();
                document.getElementById(`preciocompra-${fila + 1}`).focus();
                document.getElementById(`precioxlibra-${fila + 1}`).focus();
                document.getElementById(`idproveedor-${fila + 1}`).focus();
            } else {
                // añadir nueva fila
                setFilas([...nuevasFilas, { cantidadxlibra: 1, precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: '', boton: false}]);
                setTimeout(() => {
                    document.getElementById(`nombreproducto-${fila + 1}`).focus();
                    document.getElementById(`tipoproducto-${fila + 1}`).focus();
                    document.getElementById(`preciocompra-${fila + 1}`).focus();
                    document.getElementById(`precioxlibra-${fila + 1}`).focus();
                    document.getElementById(`idproveedor-${fila + 1}`).focus();
                }, 0);
            }
        }
    }

    async function enviarDatos(e) {
        e.preventDefault();

        // Filtro para traer todas las filas completas
        const filtro = filas
            .filter((fila, i) => {
                const camposVacios = Object.entries(fila)
                    .filter(([_, valor]) => valor === '') // Encontrar campos vacíos
                    .map(([clave]) => clave); // Obtener solo el nombre del campo
                    
                if (camposVacios.length > 0) {
                    Swal.fire({
                        icon: 'error',
                        text: `En la fila ${i + 1} faltan los campos: ${camposVacios.join(',\n')}`,
                        toast: true,
                        color: 'red',
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true
                    });
                    return false;
                }

                return true;
            });
           
        // Faltan campos por llenar
        const datosCompletos = filas.every(fila => 
            Object.values(fila).every(valor => valor !== '')
        );
        
        // funcion para enviar los datos de las compras al backend
        if (datosCompletos) {
            try {
                const response = await fetch('http://localhost:8000/productos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filtro)
                });
        
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Producto(s) añadido(s) con exito',
                        toast: true,
                        showConfirmButton: false,
                        timer: 4000,
                        timerProgressBar: true,
                        color: 'green'
                    }).then(() => {
                        // Reiniciar las filas si la solicitud fue exitosa
                        setFilas([{cantidadxlibra: 1, precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: ''}]);
                    })
                } else {
                    throw new Error('Error en la solicitud al backend');
                }
        
            } catch (error) {
                console.error(error);
            }
        }
    }

    return(
        <div className='principal-compras'>
            <header className='cabezera-compras'>
                <h1>COMPRAS</h1>
                <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
            </header>
            <main className='contenido-compras'>
                <div className='elementos'>
                    <table className='tabla-elementos'>
                        <thead>
                            <tr>
                                <th>Cantidad(lb)</th>
                                <th>Precio(lb)</th>
                                <th>Articulo</th>
                                <th>Tipo Producto</th>
                                <th>ID Proveedor</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, i) => (
                                <tr key={i}>
                                    <td>
                                        <input 
                                            type='number' min='1'
                                            value={fila.cantidadxlibra}
                                            onChange={(e) => valorCasilla(e, i, 'cantidadxlibra')}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`precioxlibra-${i}`}
                                            value={fila.precioxlibra}
                                            onChange={(e) => valorCasilla(e, i, 'precioxlibra')}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`nombreproducto-${i}`}
                                            value={fila.nombreproducto}
                                            onChange={(e) => valorCasilla(e, i, 'nombreproducto')}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`tipoproducto-${i}`}
                                            value={fila.tipoproducto}
                                            onChange={(e) => valorCasilla(e, i, 'tipoproducto')}
                                        />
                                    </td>
                                    <td>
                                        <select 
                                            id={`idproveedor-${i}`}
                                            value={fila.idproveedor}
                                            style={{ width: '90%', borderRadius: '8px', padding: '2px' }}
                                            onChange={(e) => valorCasilla(e, i, 'idproveedor')} >
                                            <option value='' disabled selected={false}>Proveedores</option>
                                            {proveedores.map((proveedor, i) => (
                                                <option key={i} value={proveedor} title={proveedor.tipoproducto}>
                                                    {proveedor}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`preciocompra-${i}`}
                                            value={fila.preciocompra}
                                            onChange={(e) => valorCasilla(e, i, 'preciocompra')}
                                        />
                                    </td>
                                    <td>
                                        {!fila.boton && <button onClick={() => quitarFila(i)}>
                                            Eliminar
                                        </button>}
                                        {fila.boton && <button onClick={() => agregarFila(i)}>
                                            Agregar
                                        </button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <footer className='piepagina-compras'>
                <button className='boton' onClick={enviarDatos}>
                    Confirmar
                </button>
            </footer>
        </div>
    );
}

export default Compras;