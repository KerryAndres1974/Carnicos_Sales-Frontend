import { Link } from 'react-router-dom';
import logo from '../multimedia/logoEmp.jpg';
import '../estilos/Recuperar.css';

function Recuperar() {

    return (
        <div className='principal-recuperar'>
            <div className='contenedor'>
                <div className='logo'>
                    <img src={logo} alt="" />
                </div>
                <div className='contenedor-formulario'>
                    <h1>Cárnicos Sales Recuperar.</h1>

                    <form className='formulario' /*onSubmit={Ingresar}*/>
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Ingresa tu correo electronico'
                            //value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='boton' 
                            type='submit' 
                            value='Enviar Correo' 
                        />
                    </form>
                    <li className='ruta'><Link to='/Ingreso' className='pestaña'>Inicia sesion</Link></li>
                </div>
            </div>
        </div>
    );
}

export default Recuperar;