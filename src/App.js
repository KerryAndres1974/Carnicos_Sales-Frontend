import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
    const goTo = useNavigate();

    return (
        <div className='principal'>
            <header className='cabezera-principal'>
                <h1>Carniceria Integral</h1>
                <button onClick={() => {goTo('/Ingreso')}}>Ingreso Empleados</button>
            </header>
        </div>
    );
}

export default App;