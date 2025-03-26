import React from "react";
import { useForm } from "../hooks/useForm";

const MessageInput = ({ onSendMessage }) => {
    const { formState, handleChangeInput } = useForm({ text: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formState.text.trim()) {
            onSendMessage(formState.text.trim());
            // Limpiar el campo después de enviar
            handleChangeInput({ target: { name: "text", value: "" } });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="message-input">
            <input
                type="text"
                name="text"
                placeholder="Escribe un mensaje..."
                value={formState.text}
                onChange={handleChangeInput}
                required
            />
            <button type="submit">Enviar</button>
        </form>
    );
};

export default MessageInput;