import '../estilos/Informe.css'
import { useNavigate } from 'react-router-dom';

function Informe() {

    const goTo = useNavigate()

    return(
        <div className='principal-informe'>
            <header className='cabezera-informe'>
                <h1>INFORME</h1>
                <button onClick={() => {goTo('/Gerencia')}}>regresar</button>
            </header>
        </div>
    );
}

export default Informe