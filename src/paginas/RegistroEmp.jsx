import { Link } from 'react-router-dom';
import logo from '../multimedia/logoEmp.jpg';
import '../estilos/RegistroEmp.css';

function Registro() {

    return (
        <div className='principal-registro'>
            <div className='contenedor'>
                <div className='logo'>
                    <img src={logo} alt="" />
                </div>
                <div className='contenedor-formulario'>
                    <h1>Cárnicos Sales Registro.</h1>

                    <form className='formulario' /*onSubmit={Ingresar}*/>
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Nombre' 
                            //value={username}
                            //onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Apellido' 
                            //value={username}
                            //onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='password' 
                            placeholder='Contraseña'
                            //value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='password' 
                            placeholder='Repetir contraseña'
                            //value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Telefono'
                            //value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Correo electronico'
                            //value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='boton' 
                            type='submit' 
                            value='Registrar' 
                        />
                    </form>
                    <li className='ruta'><Link to='/Ingreso' className='pestaña'>Iniciar Sesion</Link></li>
                </div>
            </div>
        </div>
    );
}

export default Registro;