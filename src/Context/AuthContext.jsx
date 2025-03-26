import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [authorization_token, setAuthorizationToken] = useState(() => {
        return sessionStorage.getItem("authorization_token") || null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!authorization_token);

    useEffect(() => {
        const token = sessionStorage.getItem("authorization_token");
        if (token) {
            setAuthorizationToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        sessionStorage.setItem("authorization_token", token);
        setAuthorizationToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem("authorization_token");
        setAuthorizationToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authorization_token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;