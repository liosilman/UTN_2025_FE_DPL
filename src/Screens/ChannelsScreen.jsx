import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import CreateChannelForm from "../Components/CreateChannelForm";
import ChannelList from "../Components/ChannelList";
import "./css/ChannelsScreen.css";
const ChannelsScreen = () => {
    const { workspace_id } = useParams(); // Obtener el ID del workspace de la URL
    const navigate = useNavigate();
    const { responseApiState, postRequest } = useApiRequest();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener la lista de canales del workspace
    const fetchChannels = async () => {
        try {
            const response = await fetch(`/api/workspaces/${workspace_id}/channels`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setChannels(data.channels);
            } else {
                throw new Error(data.message || "Error al cargar los canales");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar los canales al montar el componente
    useEffect(() => {
        fetchChannels();
    }, [workspace_id]);

    // Manejar la creación de un nuevo canal
    const handleCreateChannel = async (name) => {
        await postRequest(`/api/workspaces/${workspace_id}/channels`, { name });
        if (responseApiState.data) {
            fetchChannels(); // Recargar la lista de canales
        }
    };

    // Navegar a la pantalla de mensajes de un canal
    const handleSelectChannel = (channel_id) => {
        navigate(`/workspaces/${workspace_id}/channels/${channel_id}/messages`);
    };

    return (
        <div className="channels-screen">
            <h1>Canales del Workspace</h1>
            
            {/* Formulario para crear un canal */}
            <CreateChannelForm onCreateChannel={handleCreateChannel} />
            
            {/* Mensajes de error o éxito */}
            {responseApiState.error && (
                <p style={{ color: "red" }}>{responseApiState.error}</p>
            )}
            {responseApiState.data && (
                <p style={{ color: "green" }}>Canal creado exitosamente!</p>
            )}

            {/* Lista de canales */}
            {loading ? (
                <p>Cargando canales...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <ChannelList 
                    channels={channels} 
                    onSelectChannel={handleSelectChannel} 
                />
            )}
        </div>
    );
};

export default ChannelsScreen;