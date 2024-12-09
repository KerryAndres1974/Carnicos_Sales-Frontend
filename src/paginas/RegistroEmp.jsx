import { Link } from 'react-router-dom';
import logo from '../multimedia/logoEmp.jpg';
import '../estilos/RegistroEmp.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registro() {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [tel, setTel] = useState('');
    const goTo = useNavigate();

    async function registrar(e) {
        e.preventDefault();

        if (pass1 !== pass2) {
            alert('Las constraseñas deben coincidir');
            return;
        }

        if (nombre !== '' && correo !== '' && pass1 !== '' && pass2 !== ''){

            const datosJSON = JSON.stringify({ nombre: nombre, correo: correo, pass: pass1, tel: tel });
            
            try {
                const response = await fetch('http://localhost:8000/empleados', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: datosJSON
                });

                if (response.ok) {
                    alert('Se ha registrado al empleado con exito');
                    goTo('/Ingreso');
                } else {
                    throw new Error('Error en la solicitud al backend');
                }
                
            } catch (err) {
                console.error(err);
            }

        } else {
            alert('Debes por lo menos llenar los campos requeridos');
        }
    }

    return (
        <div className='principal-registro'>
            <div className='contenedor-registro'>

                <div style={{ width: '50%' }}>
                    <img src={logo} alt="logo" />
                </div>

                <div className='contenedor-formulario-usuarios'>
                    <h1 style={{ color: 'grey', fontStyle: 'italic' }}>
                        Cárnicos Sales Registro
                    </h1>

                    <form className='formulario-usuarios' onSubmit={registrar} >
                        <input 
                            className='input-usuarios' 
                            type='text' 
                            placeholder='nombre*' 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        <input 
                            className='input-usuarios' 
                            type='text' 
                            placeholder='correo electronico*'
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                        <input 
                            className='input-usuarios' 
                            type='password' 
                            placeholder='contraseña*'
                            value={pass1}
                            onChange={(e) => setPass1(e.target.value)}
                        />
                        <input 
                            className='input-usuarios' 
                            type='password' 
                            placeholder='repetir contraseña*'
                            value={pass2}
                            onChange={(e) => setPass2(e.target.value)}
                        />
                        <input 
                            className='input-usuarios' 
                            type='text' 
                            placeholder='telefono'
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                        />
                        <input 
                            className='boton-usuarios' 
                            type='submit' 
                            value='Registrar' 
                        />
                        <li style={{ listStyle: 'none' }}>
                            <Link to='/Ingreso'>Iniciar Sesion</Link>
                        </li>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Registro;