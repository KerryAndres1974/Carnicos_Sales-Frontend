import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider.jsx';
import RutaProtegida from './rutasProtegidas.js';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';

import Detalleventas from './paginas/Detalleventas.jsx';
import Proveedores from './paginas/Proveedores.jsx';
import Inventario from './paginas/Inventario.jsx';
import Gerencia from './paginas/Gerencia.jsx';
import Compras from './paginas/Compras.jsx';
import Informe from './paginas/Informe.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/',
    element: <RutaProtegida />,
    children: [
      {
        path: '/Detalleventas',
        element: <Detalleventas />,
      },
      {
        path: '/Inventario',
        element: <Inventario />,
      },
      {
        path: '/Gerencia',
        element: <Gerencia />,
      },
      {
        path: '/Proveedores',
        element: <Proveedores />,
      },
      {
        path: '/Compras',
        element: <Compras />,
      },
      {
        path: '/Informe',
        element: <Informe />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);