"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Header from "./Header"
import MessageInput from "./MessageInput"
import "../styles/ChannelView.css" // Reutilizamos los estilos de ChannelView

/**
 * Componente de vista de mensajes directos
 * @returns {JSX.Element} - Componente
 */
const DirectMessageView = () => {
  const { workspaceId, userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshMessages, setRefreshMessages] = useState(0)

  // Simular carga de información del usuario
  useEffect(() => {
    // En una implementación real, aquí cargaríamos la información del usuario
    setUser({
      username: "Usuario",
      status: "online",
    })
    setLoading(false)
  }, [userId])

  /**
   * Maneja el evento de mensaje enviado
   */
  const handleMessageSent = () => {
    // Incrementar el contador para forzar la recarga de mensajes
    setRefreshMessages((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="channel-view-loading">
        <div className="loading-spinner"></div>
        <p>Cargando conversación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="channel-view-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  return (
    <div className="channel-view">
      <Header
        channelName={user?.username || "Usuario"}
        channelInfo={user?.status || ""}
        workspaceId={workspaceId}
        userId={userId}
      />

      <div className="channel-content">
        <div className="message-list-empty">
          <div className="message-list-empty-icon">💬</div>
          <h3 className="message-list-empty-title">No hay mensajes aún</h3>
          <p className="message-list-empty-text">Esta funcionalidad no está implementada aún.</p>
        </div>

        <MessageInput workspaceId={workspaceId} userId={userId} onMessageSent={handleMessageSent} disabled={true} />
      </div>
    </div>
  )
}

export default DirectMessageView

