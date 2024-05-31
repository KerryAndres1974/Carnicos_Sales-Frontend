import '../hojasEstilos/Compras.css'
import { useNavigate } from 'react-router-dom';

function Compras() {
    
    const goTo = useNavigate();

    return(
        <div className='principal-compras'>
            <header className='cabezera-compras'>
                <h1>COMPRAS</h1>
                <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
            </header>
            <main className='contenido-compras'>
                <table>
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </main>
        </div>
    );
}

export default Compras