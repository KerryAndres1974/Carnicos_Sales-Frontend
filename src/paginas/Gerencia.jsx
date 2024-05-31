import '../hojasEstilos/Gerencia.css'
import { useNavigate } from 'react-router-dom';

function Gerencia() {

    const goTo = useNavigate();

    return(
        <div className='principal-gerencia'>
            <section>
                <button onClick={() => {goTo('/Inventario')}}>Inventario</button>
                <button onClick={() => {goTo('/Informe')}}>Informe</button>
                <button onClick={() => {goTo('/Detalleventas')}}>Ventas</button>
            </section>
                
            <section>
                <button onClick={() => {goTo('/Compras')}}>Compras</button>
                <button onClick={() => {goTo('/Proveedores')}}>Proveedores</button>
            </section>
        </div>
    );
}

export default Gerencia