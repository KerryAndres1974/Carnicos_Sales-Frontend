import { useNavigate } from 'react-router-dom'
import '../hojasEstilos/Inventario.css'

function Inventario() {

    const goTo = useNavigate()
    // logica para traer todo el inventario de la base de datos

    return(
        <div className='principal-inventario'>
            <header className='cabezera-inventario'>
                <h1>INVENTARIO</h1>
                <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
            </header>
            <main className='contenido-inventario'>
                <table className='tabla'>
                    <thead className='titulos'>
                        <tr>
                            <th>Id_Producto</th>
                            <th>Tipo Producto</th>
                            <th>Nombre</th>
                            <th>Cantidad(lbr)</th>
                            <th>Fecha Compra</th>
                            <th>Fecha vencimiento</th>
                            <th>Precio(lbr)</th>
                        </tr>
                    </thead>
                    <tbody className='elementos'>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Inventario