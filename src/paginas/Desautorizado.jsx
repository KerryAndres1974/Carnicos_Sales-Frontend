import React from 'react';
import { useNavigate } from 'react-router-dom';

function Desautorizado() {
    const goTo = useNavigate();

    return (
        <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
            <h1>No tienes permisos para esta página</h1>
            <button onClick={() => goTo('/Detalleventas')}>Regresar</button>
        </div>
    );
}

export default Desautorizado;
