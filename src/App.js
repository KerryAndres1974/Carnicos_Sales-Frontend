import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthProvider.jsx';
import { useState } from 'react';
import logo from './multimedia/logoEmp.jpg'
import './App.css';

function App() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const goTo = useNavigate();
    const auth = useAuth();

    if(!!auth.login()){
        return <Navigate to='/detalleVentas' />
    };

    async function Ingresar(e) {
        e.preventDefault();

        try {
            if (username !== '' && password !== '') {
                const respuesta = await fetch('http://localhost:8000/login', {
                    method: 'POST',
                    body: JSON.stringify({ email: username, password: password }),
                    headers: { 'Content-Type': 'application/json' },
                })

                if (respuesta.ok) {
                    const { token } = await respuesta.json()
                    auth.saveUser({ body: { accessToken: "dummyRefreshToken", refreshToken: token } });
                    alert('Inicio sesion')
                    goTo('/ejemplo')
                } else {
                    alert('Fallo sesion')
                }
            } else {
                alert('llena todos los campos')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error en el inicio de sesión')
        }
    };

    return (
        <div className='principal'>
            <div className='contenedor'>
                <div className='logo'>
                    <img src={logo} alt="" />
                </div>
                <div className='contenedor-formulario'>
                    <h1>Carniceria Carmol.</h1>

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
                </div>
            </div>
        </div>
    );
}

export default App;
