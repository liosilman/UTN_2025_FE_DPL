import React from "react";
import { useForm } from "../hooks/useForm";

const CreateChannelForm = ({ onCreateChannel }) => {
    // Usamos el hook useForm para manejar el estado del nombre del canal
    const { formState, handleChangeInput } = useForm({ name: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formState.name.trim()) {
            onCreateChannel(formState.name.trim());
            // Limpiar el campo después de enviar (opcional)
            handleChangeInput({ target: { name: "name", value: "" } });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-channel-form">
            <input
                type="text"
                name="name" // El atributo "name" debe coincidir con la clave en formState
                placeholder="Nombre del canal"
                value={formState.name}
                onChange={handleChangeInput}
                required
            />
            <button type="submit">Crear Canal</button>
        </form>
    );
};

export default CreateChannelForm;