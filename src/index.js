import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './Auth/AuthProvider.jsx';
import RutaProtegida from './rutasProtegidas.js';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import './index.css';

import Detalleventas from "./paginas/Detalleventas.jsx";
import Ejemplo from './paginas/ejemplo.jsx';

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
        path: '/ejemplo',
        element: <Ejemplo />,
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