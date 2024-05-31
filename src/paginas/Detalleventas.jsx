import '../hojasEstilos/Detalleventas.css'
import { useState } from 'react'

function Detalleventas() {

    const [filas, setFilas] = useState([
        {cantidad: '1', idProducto: '', articulo: '', costoSinIVA: '', iva: '', total: ''},
    ])

    const validarFila = (e, fila) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            // logica para guardar la info de una fila y pasar a la siguiente
            const nuevasFilas = [...filas]
            nuevasFilas[fila].idProducto = e.target.value
            setFilas(nuevasFilas);

            // enfoque al input idProducto de la siguiente fila si existe
            if (fila + 1 < filas.length) {
                document.getElementById(`idProducto-${fila + 1}`).focus()
            } else {
                // añadir una nueva fila si quieres seguir añadiendo
                setFilas([...nuevasFilas, {cantidad: '1', idProducto: '', articulo: '', costoSinIVA: '', iva: '', total: ''}])
                setTimeout(() => {
                    document.getElementById(`idProducto-${fila + 1}`).focus()
                }, 0)
            }
        }
    }

    const valorColumna = (e, fila, campo) => {
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

    return (
        <div className='principal-ventas'>
            <header className='cabezera'>
                <h1>DETALLE DE VENTA</h1>
            </header>
            <main className='contenido'>
                <div className='elementos'>
                    <table className='tabla-elementos'>
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Id_Producto</th>
                                <th>Articulo</th>
                                <th>Costo sin IVA</th>
                                <th>IVA</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((fila, i) => (
                                <tr key={i}>
                                    <td>
                                        <input 
                                            type='number'
                                            min='1'
                                            value={fila.cantidad}
                                            onChange={(e) => valorColumna(e, i, 'cantidad')}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type='text'
                                            id={`idProducto-${i}`}
                                            placeholder='Id_Producto'
                                            value={fila.idProducto}
                                            onChange={(e) => valorColumna(e, i, 'idProducto')}
                                            onKeyPress={(e) => validarFila(e, i)}
                                        />
                                    </td>
                                    <td><label className="Larticulo">{fila.articulo}</label></td>
                                    <td><label className="Lcosto">{fila.costoSinIVA}</label></td>
                                    <td><label className="Liva">{fila.iva}</label></td>
                                    <td><label className="Ltotal">{fila.total}</label></td>
                                    <td>
                                        <button className='boton-ventas' onClick={() => quitarFila(i)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='detalles-ventas'>
                    <div className='titulos'>
                        <h2>Carniceria Carmol.</h2>
                        <label>CAJA</label>
                    </div>
                    <div className='detalles'>
                        <div className='linea'>
                            <span className='descripcion'>Sub Total:</span>
                            <span className='monto'>$4.000</span>
                        </div>
                        <div className='linea'>
                            <span className='descripcion'>IVA:</span>
                            <span className='monto'>$500</span>
                        </div>
                        <div className='linea'>
                            <span className='descripcion'>Total:</span>
                            <span className='monto'>$4.500</span>
                        </div>
                    </div>
                </div>
            </main>
            <footer className='piepagina'>
                <div className='botones'>
                    <button className='boton-ventas'>Cancelar Venta</button>
                    <button className='boton-ventas'>Facturar</button>
                </div>
            </footer>
        </div>
    )
}

export default Detalleventas