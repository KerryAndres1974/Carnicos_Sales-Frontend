import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthProvider.jsx";

function RutaProtegida({ allowedRoles }) {
    const auth = useAuth();

    if (!auth.login().accessToken) {
        return <Navigate to="/" />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.login().role)) {
        return <Navigate to="/Desautorizado" />;
    }

    return <Outlet />;
}

export default RutaProtegida;