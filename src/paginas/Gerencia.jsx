import '../estilos/Gerencia.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider'

function Gerencia() {
    const auth = useAuth()
    const goTo = useNavigate();

    const deslogeado = () => {
        window.location.reload()
        auth.logout()
    }

    return(
        <div className='principal-gerencia'>
            <section>
                <button className='botonG' onClick={() => {goTo('/Inventario')}}>Inventario</button>
                <button className='botonG' onClick={() => {goTo('/Informe')}}>Informe</button>
                <button className='botonG' onClick={() => {goTo('/Detalleventas')}}>Ventas</button>
            </section>
                
            <section>
                <button className='botonG' onClick={() => {goTo('/Compras')}}>Compras</button>
                <button className='botonG' onClick={() => {goTo('/Proveedores')}}>Proveedores</button>
                <button className='botonG' onClick={deslogeado}>Salir</button>
            </section>
        </div>
    );
}

export default Gerencia