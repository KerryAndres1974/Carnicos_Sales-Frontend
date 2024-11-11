import { useState } from 'react';
import '../estilos/Compras.css'
import { useNavigate } from 'react-router-dom';

function Compras() {
    const goTo = useNavigate();
    const [filas, setFilas] = useState([
        {cantidadxlibra: '1', precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: '', boton: true}
    ])

    const valorCasilla = (e, fila, campo) => {
        const nuevasFilas = [...filas]
        nuevasFilas[fila][campo] = e.target.value
        setFilas(nuevasFilas)
    }

    const quitarFila = (i) => {
        if (filas.length <= 1){
            const reinicio = [...filas]
            reinicio[0].idProducto = ''
            setFilas(reinicio)
        } else {
            const nuevasFilas = filas.filter((_, fila) => fila !== i)
            setFilas(nuevasFilas)
        }
    }

    const agregarFila = (fila) => {
            
        const filaActual = filas[filas.length - 1]
        
        if (filaActual.tipoproducto && filaActual.idproveedor && filaActual.nombreproducto &&
            filaActual.precioxlibra && filaActual.preciocompra){
            filaActual.boton = false
                // logica para guardar la info de una fila y pasar a la siguiente
                const nuevasFilas = [...filas]
                setFilas(nuevasFilas)
                // enfoque a los inputs de la siguiente fila si existe
            if (fila + 1 < filas.length) {
                document.getElementById(`tipoproducto-${fila + 1}`).focus()
                document.getElementById(`preciocompra-${fila + 1}`).focus()
                document.getElementById(`nombreproducto-${fila + 1}`).focus()
                document.getElementById(`precioxlibra-${fila + 1}`).focus()
                document.getElementById(`idproveedor-${fila + 1}`).focus()
            } else {
                // añadir nueva fila
                setFilas([...nuevasFilas, { cantidadxlibra: '1', precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: '', boton: true}])
                setTimeout(() => {
                    document.getElementById(`tipoproducto-${fila + 1}`).focus()
                    document.getElementById(`preciocompra-${fila + 1}`).focus()
                    document.getElementById(`nombreproducto-${fila + 1}`).focus()
                    document.getElementById(`precioxlibra-${fila + 1}`).focus()
                    document.getElementById(`idproveedor-${fila + 1}`).focus()
                }, 0)
            }

        } else alert('Debes llenar todas las casillas') 
    }

    async function enviarDatos(e) {
        e.preventDefault()
        // funcion para enviar los datos de las compras al backend        
        try {
            const response = await fetch('http://localhost:8000/new-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filas)
            });
    
            if (!response.ok) {
                throw new Error('Error en la solicitud al backend');
            }
    
            // Reiniciar las filas si la solicitud fue exitosa
            setFilas([{cantidadxlibra: '1', precioxlibra: '', nombreproducto: '', tipoproducto: '', idproveedor: '', preciocompra: ''}]);
    
        } catch (error) {
            console.error('Error al enviar los datos al backend:', error);
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
                                        <input 
                                            type='text'
                                            id={`idproveedor-${i}`}
                                            value={fila.idproveedor}
                                            onChange={(e) => valorCasilla(e, i, 'idproveedor')}
                                        />
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