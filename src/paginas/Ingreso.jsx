import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider.jsx';
import { useState } from 'react';
import logo from '../multimedia/logoEmp.jpg';
import '../estilos/Ingreso.css';

function Ingreso() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const goTo = useNavigate();
    const auth = useAuth();

    async function Ingresar(e) {
        e.preventDefault();

        try {
            if (username !== '' && password !== '') {
                let datos = { email: username, password: password };
                let datosjson = JSON.stringify(datos);
                const respuesta = await fetch('http://localhost:8000/login', {
                    method: 'POST',
                    body: datosjson,
                    headers: { 'Content-Type': 'application/json' },
                })

                if (respuesta.ok) {
                    const { token } = await respuesta.json();
                    
                    // decodificaion del token para obtener el cargo
                    const [, cargaUtil] = token.split('.');
                    const cargaUtilDeco = atob(cargaUtil);
                    const usuario = JSON.parse(cargaUtilDeco);

                    auth.saveUser({ body: { accessToken: "dummyRefreshToken", refreshToken: token, role: usuario.cargo } });
                    if (usuario.cargo === 'gerente'){
                        goTo('/Gerencia');
                    } else {
                        goTo('/Detalleventas');
                    }

                } else {
                    alert('Fallo sesion');
                }
            } else {
                alert('llena todos los campos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el inicio de sesión');
        }
    };

    return (
        <div className='principal-ingreso'>
            <div className='contenedor'>
                <div className='logo'>
                    <img src={logo} alt="" />
                </div>
                <div className='contenedor-formulario'>
                    <h1>Cárnicos Sales Ingreso.</h1>

                    <form className='formulario' onSubmit={Ingresar}>
                        <input 
                            className='input' 
                            type='text' 
                            placeholder='Usuario' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            className='input' 
                            type='password' 
                            placeholder='Contraseña'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input 
                            className='boton' 
                            type='submit' 
                            value='Ingresar' 
                        />
                    </form>
                    <div className='contenedor-rutas'>
                        <li><Link to='/Recuperar-contraseña' className='pestaña'>Recuperar contraseña</Link></li>
                        <li><Link to='/Registro-empleados' className='pestaña'>Registrar Empleado</Link></li>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ingreso;