import '../hojasEstilos/Proveedores.css'
import { useNavigate } from 'react-router-dom';

function Proveedores() {

    const goTo = useNavigate()
    // logica para traer todos los proveedores de la base de datos

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
                        <tr>
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
                        </tr>
                        <tr>
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

export default Proveedores