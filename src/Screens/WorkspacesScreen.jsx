import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApiRequest } from "../hooks/useApiRequest";
import ENVIROMENT from "../config/enviroment";

const WorkspacesScreen = () => {
    const navigate = useNavigate();
    const { authorization_token, logout } = useContext(AuthContext);
    const { responseApiState, getRequest } = useApiRequest(ENVIROMENT.URL_API);
    const [workspaces, setWorkspaces] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        console.log("authorization_token:", authorization_token); // Debug
        if (authorization_token && !hasFetched) {
            console.log("Llamando a getRequest para obtener los workspaces"); // Debug
            getRequest("/workspaces");
            setHasFetched(true);
        } else if (!authorization_token) {
            console.error("No se encontró authorization_token"); // Debug
        }
    }, [authorization_token, getRequest, hasFetched]);

    useEffect(() => {
        console.log("Estado de responseApiState:", responseApiState); // Debug
        if (responseApiState.data) {
            console.log("Workspaces obtenidos:", responseApiState.data.data.workspaces); // Debug
            setWorkspaces(responseApiState.data.data.workspaces);
        } else if (responseApiState.error) {
            console.error("Error al obtener los workspaces:", responseApiState.error); // Debug
        }
    }, [responseApiState]);

    const handleWorkspaceClick = (workspaceId) => {
        if (!workspaceId) {
            console.error("El workspace no tiene un ID válido:", workspaceId); // Debug
            return;
        }
        navigate(`/workspace/${workspaceId}`);
    };

    const handleCreateWorkspaceClick = () => {
        navigate("/create-workspace");
    };

    const handleLogoutClick = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>Workspaces</h1>

            <button onClick={handleLogoutClick} style={{ marginBottom: "20px" }}>
                Cerrar sesión
            </button>

            {responseApiState.loading ? (
                <span>Cargando workspaces...</span>
            ) : (
                <>
                    <button onClick={handleCreateWorkspaceClick}>Crear nuevo Workspace</button>
                    <ul>
                        {Array.isArray(workspaces) && workspaces.length > 0 ? (
                            workspaces.map((workspace) => (
                                <li key={workspace._id}>
                                    <button onClick={() => handleWorkspaceClick(workspace._id)}>
                                        {workspace.name}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <span>No tienes workspaces. ¡Crea uno nuevo!</span>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default WorkspacesScreen;