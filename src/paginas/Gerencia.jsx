import '../estilos/Gerencia.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider'

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
                <button onClick={() => {goTo('/Inventario')}}>Inventario</button>
                <button onClick={() => {goTo('/Informe')}}>Informe</button>
                <button onClick={() => {goTo('/Detalleventas')}}>Ventas</button>
            </section>
                
            <section>
                <button onClick={() => {goTo('/Compras')}}>Compras</button>
                <button onClick={() => {goTo('/Proveedores')}}>Proveedores</button>
                <button onClick={deslogeado}>Salir</button>
            </section>
        </div>
    );
}

export default Gerencia