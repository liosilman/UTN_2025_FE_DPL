import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import ENVIROMENT from "../config/enviroment";
import ServerError from "../utils/error.utils";
import { AuthContext } from "../context/AuthContext";  // Importamos el contexto

const RegisterScreen = () => {
    const navigate = useNavigate();
    const { responseApiState, postRequest } = useApiRequest(ENVIROMENT.URL_API);
    const { login } = useContext(AuthContext);  // Accedemos a la función login del contexto
    const [formState, setFormState] = useState({
        email: "",
        username: "",
        password: "",
        profile_img_base64: "", // Puedes manejarlo como un archivo o una cadena base64
    });
    const [errorMessage, setErrorMessage] = useState(null); // Para mostrar errores en la UI

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null); // Limpiar mensaje de error previo

        try {
            await postRequest('/auth/register', formState); // Llamamos al postRequest con los datos del formulario

            // Si la respuesta es correcta y tenemos un token
            if (responseApiState.data && responseApiState.data.ok) {
                const token = responseApiState.data.data?.authorization_token;
                if (token) {
                    login(token); // Guardamos el token en el contexto
                    navigate("/workspaces"); // Redirige a la página de workspaces
                } else {
                    setErrorMessage("Token de autenticación no recibido.");
                }
            }
        } catch (error) {
            // Manejo de errores
            if (error instanceof ServerError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Hubo un error inesperado. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <div>
            <h1>Registro de Usuario</h1>
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formState.username}
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

                <div>
                    <label htmlFor="profile_img_base64">Profile Image</label>
                    <input
                        type="file"
                        id="profile_img_base64"
                        name="profile_img_base64"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setFormState((prevState) => ({
                                    ...prevState,
                                    profile_img_base64: reader.result,
                                }));
                            };
                            reader.readAsDataURL(file);
                        }}
                    />
                </div>

                {responseApiState.loading ? (
                    <span>Registrando...</span>
                ) : (
                    <button type="submit">Registrar</button>
                )}

                {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
            </form>

            <div>
                <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
            </div>
        </div>
    );
};

export default RegisterScreen;
