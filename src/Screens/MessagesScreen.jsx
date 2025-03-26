import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";
import { useForm } from "../hooks/useForm";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import "./css/MessagesScreen.css";

const MessagesScreen = () => {
    const { workspace_id, channel_id } = useParams(); // Obtener el ID del workspace y del canal de la URL
    const { responseApiState, postRequest } = useApiRequest();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener la lista de mensajes del canal
    const fetchMessages = async () => {
        try {
            const response = await fetch(`/api/channels/${channel_id}/messages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(data.messages);
            } else {
                throw new Error(data.message || "Error al cargar los mensajes");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar los mensajes al montar el componente
    useEffect(() => {
        fetchMessages();
    }, [channel_id]);

    // Manejar el envío de un nuevo mensaje
    const handleSendMessage = async (text) => {
        await postRequest(`/api/channels/${channel_id}/messages`, { text });
        if (responseApiState.data) {
            fetchMessages(); // Recargar la lista de mensajes
        }
    };

    return (
        <div className="messages-screen">
            <h1>Mensajes del Canal</h1>
            
            {/* Lista de mensajes */}
            {loading ? (
                <p>Cargando mensajes...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <MessageList messages={messages} />
            )}

            {/* Formulario para enviar mensajes */}
            <MessageInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default MessagesScreen;