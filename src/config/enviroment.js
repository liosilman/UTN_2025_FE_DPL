const ENVIROMENT = {
    URL_API: import.meta.env.VITE_URL_API || "http://localhost:3000/api",
}

export const ROUTES = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        VERIFY_EMAIL: "/auth/verify-email",
        RESET_PASSWORD: "/auth/reset-password",
        REWRITE_PASSWORD: "/auth/rewrite-password",
    },
    USER: {
        ME: "/users/me",
    },
    WORKSPACES: {
        BASE: "/workspaces",
        CREATE: "/workspaces/create-workspace",
        INVITE: (workspaceId, userId) => `/workspaces/${workspaceId}/invite/${userId}`,
        GET_BY_ID: (id) => `/workspaces/${id}`,
        CHANNELS: (workspaceId) => `/workspaces/${workspaceId}/channels`,
        CREATE_CHANNEL: (workspaceId) => `/workspaces/${workspaceId}/channels`,  // Ruta para crear un canal
        CHANNEL_BY_ID: (workspaceId, channelId) => `/workspaces/${workspaceId}/channels/${channelId}`,
        CHANNEL_MESSAGES: (workspaceId, channelId) => `/workspaces/${workspaceId}/channels/${channelId}/messages`,
    },
}

export default ENVIROMENT
