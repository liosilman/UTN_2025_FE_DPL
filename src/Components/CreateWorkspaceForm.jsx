import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import ENVIROMENT from "../config/enviroment";

const CreateWorkspaceForm = () => {
    const navigate = useNavigate();
    const { responseApiState, postRequest } = useApiRequest(ENVIROMENT.URL_API);
    const [formState, setFormState] = useState({
        name: "",
        description: "",
    });
    const [errorMessage, setErrorMessage] = useState(null);

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
            await postRequest("/workspaces", formState); // Enviamos la solicitud POST

            if (responseApiState.data && responseApiState.data.ok) {
                // Si la creación fue exitosa, redirigimos a la pantalla de workspaces
                navigate("/workspaces");
            }
        } catch (error) {
            if (error instanceof ServerError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Hubo un error inesperado. Intenta de nuevo.");
            }
        }
    };

    return (
        <div>
            <h1>Crear Nuevo Workspace</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre del Workspace</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {responseApiState.loading ? (
                    <span>Cargando...</span>
                ) : (
                    <button type="submit">Crear Workspace</button>
                )}

                {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
            </form>
        </div>
    );
};

export default CreateWorkspaceForm;
