import '../estilos/Gerencia.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import logo from '../multimedia/logoEmp.jpg';

function Gerencia() {
    const auth = useAuth()
    const goTo = useNavigate();

    const deslogeado = () => {
        window.location.reload()
        auth.logout()
    }

    return(
        <div className='principal-gerencia'>

            <section className='logos'>
                <h1>Administracion Cárnicos Sales</h1>
                <img src={logo} alt="" />
            </section>

            <section className='botones'>
                <button className='botonG' onClick={() => {goTo('/Inventario')}}>Inventario</button>
                <button className='botonG' onClick={() => {goTo('/Informe')}}>Informe</button>
                <button className='botonG' onClick={() => {goTo('/Detalleventas')}}>Ventas</button>
                
                <button className='botonG' onClick={() => {goTo('/Compras')}}>Compras</button>
                <button className='botonG' onClick={() => {goTo('/Proveedores')}}>Proveedores</button>
                <button className='botonG' onClick={deslogeado}>Salir</button>
            </section>
        </div>
    );
}

export default Gerencia