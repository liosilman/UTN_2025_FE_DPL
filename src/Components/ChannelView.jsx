import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { get } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import Header from "./Header"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import "../styles/ChannelView.css"

/**
 * Componente de vista de canal
 * @returns {JSX.Element} - Componente
 */
const ChannelView = () => {
  const { workspaceId, channelId } = useParams()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshMessages, setRefreshMessages] = useState(0)

  // Cargar información del canal
  useEffect(() => {
    const fetchChannelData = async () => {
      if (!workspaceId || !channelId) {
        setLoading(false)
        return
      }

      try {
        const response = await get(ROUTES.WORKSPACES.CHANNEL_BY_ID(workspaceId, channelId))
        console.log("Respuesta del canal:", response.data); // Para verificar la respuesta
        setChannel(response.data)
      } catch (error) {
        console.error("Error al cargar información del canal:", error)
        setError("Error al cargar información del canal")
      } finally {
        setLoading(false)
      }
    }

    fetchChannelData()
  }, [workspaceId, channelId])

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
        <p>Cargando canal...</p>
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
        channelName={channel?.name || "Canal"}
        channelInfo={channel?.description || ""}
        workspaceId={workspaceId}
        channelId={channelId}
      />

      <div className="channel-content">
        <MessageList
          workspaceId={workspaceId}
          channelId={channelId}
          key={refreshMessages} // Forzar recarga cuando se envía un mensaje
        />

        <MessageInput workspaceId={workspaceId} channelId={channelId} onMessageSent={handleMessageSent} />
      </div>
    </div>
  )
}

export default ChannelView
