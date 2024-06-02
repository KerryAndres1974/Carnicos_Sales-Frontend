import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext({
    saveUser: () => {},
    logout: () => {},
    login: () => {},
    role: ''
});

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken ? JSON.parse(storedToken) : "";
    });

    const [, setRefreshToken] = useState("");
    const [role, setRole] = useState(() => {
        const storedRole = localStorage.getItem("role");
        return storedRole || "";
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setAccessToken(JSON.parse(storedToken));
        }

        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole)
        }
    }, []);

    function login() {
        return { accessToken, role };
    }

    function logout() {
        setAccessToken("");
        setRefreshToken("");
        setRole("");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    function saveUser(userData) {
        setAccessToken(userData.body.accessToken);
        setRefreshToken(userData.body.refreshToken);
        setRole(userData.body.role);

        localStorage.setItem("token", JSON.stringify(userData.body.refreshToken));
        localStorage.setItem("role", userData.body.role);
    }

    return (
        <AuthContext.Provider value={{ saveUser, logout, login, role }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);