// Asegurarse de que la URL de la API sea correcta
const ENVIROMENT = {
  // Usar una URL de fallback más robusta
  URL_API: import.meta.env.VITE_URL_API || "https://localhost:3000/api",
}

export const ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    VERIFY_EMAIL: "/auth/verify-email",
    RESET_PASSWORD: "/auth/reset-password",
    REWRITE_PASSWORD: "/auth/rewrite-password", // Esta es la ruta correcta según el backend
    VERIFY_TOKEN: "/auth/verify-reset-token", // Añadida para verificar tokens
  },
  USER: {
    ME: "/users/me",
    SEARCH_BY_EMAIL: (email) => `/users/search?email=${encodeURIComponent(email)}`,
  },
  WORKSPACES: {
    BASE: "/workspaces",
    CREATE: "/workspaces/create-workspace",
    INVITE: (workspaceId, userId) => `/workspaces/${workspaceId}/invite/${userId}`,
    INVITE_USER: (workspaceId) => `/workspaces/${workspaceId}/invite-user`,
    GET_BY_ID: (id) => `/workspaces/${id}`,
    CHANNELS: (workspaceId) => `/workspaces/${workspaceId}/channels`,
    CREATE_CHANNEL: (workspaceId) => `/workspaces/${workspaceId}/channels`, // Ruta para crear un canal
    CHANNEL_BY_ID: (workspaceId, channelId) => `/workspaces/${workspaceId}/channels/${channelId}`,
    CHANNEL_MESSAGES: (workspaceId, channelId) => `/workspaces/${workspaceId}/channels/${channelId}/messages`,
  },
}

export default ENVIROMENT

