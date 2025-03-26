import React, { useState } from "react";
import { useApiRequest } from "../hooks/useApiRequest"; // Importa el hook

const InviteUserForm = ({ workspaceId }) => {
    const [invitedId, setInvitedId] = useState("");
    const { responseApiState, postRequest } = useApiRequest();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await postRequest(`/api/workspaces/${workspaceId}/invite/${invitedId}`); // Usa el endpoint correcto
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="User ID to invite"
                value={invitedId}
                onChange={(e) => setInvitedId(e.target.value)}
                required
            />
            <button type="submit" disabled={responseApiState.loading}>
                {responseApiState.loading ? "Inviting..." : "Invite User"}
            </button>
            {responseApiState.error && <p style={{ color: "red" }}>{responseApiState.error}</p>}
            {responseApiState.data && (
                <p style={{ color: "green" }}>User invited successfully!</p>
            )}
        </form>
    );
};

export default InviteUserForm;