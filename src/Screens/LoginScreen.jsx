import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import ENVIROMENT from "../config/enviroment";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = () => {
    const navigate = useNavigate();
    const { responseApiState, postRequest } = useApiRequest(ENVIROMENT.URL_API);
    const { login, isAuthenticated } = useContext(AuthContext);
    const [formState, setFormState] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/workspaces"); // Redirigir si el usuario está autenticado
        }
    }, [isAuthenticated, navigate]); // Solo redirigir cuando `isAuthenticated` cambie

    useEffect(() => {
        if (responseApiState.data && responseApiState.data.ok) {
            const token = responseApiState.data.data?.authorization_token;

            if (token) {
                login(token); // Guardar el token y marcar como autenticado
            } else {
                setErrorMessage("Token de autenticación no recibido.");
            }
        }

        if (responseApiState.error) {
            setErrorMessage(responseApiState.error);
        }
    }, [responseApiState, navigate, login]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await postRequest("/auth/login", formState);
        } catch (error) {
            setErrorMessage("Hubo un error inesperado. Intenta de nuevo.");
        }
    };

    return (
        <div>
            <h1>Inicia sesión</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formState.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {responseApiState.loading ? (
                    <span>Cargando...</span>
                ) : (
                    <button type="submit">Iniciar sesión</button>
                )}

                {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
            </form>

            <div>
                <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
                <p><a href="/reset-password">Olvidé mi contraseña</a></p>
            </div>
        </div>
    );
};

export default LoginScreen;
