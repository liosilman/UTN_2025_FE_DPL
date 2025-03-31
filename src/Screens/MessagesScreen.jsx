import { useParams } from "react-router-dom"
import ChannelView from "../Components/ChannelView"
import DirectMessageView from "../Components/DirectMessageView"

/**
 * Pantalla de mensajes
 * @returns {JSX.Element} - Componente
 */
const MessagesScreen = () => {
  const { workspaceId, channelId, userId } = useParams()

  return (
    <>
      {channelId ? (
        <ChannelView />
      ) : userId ? (
        <DirectMessageView />
      ) : (
        <div className="empty-messages-screen">
          <div className="empty-messages-icon">💬</div>
          <h2>Selecciona un canal o usuario para comenzar</h2>
        </div>
      )}
    </>
  )
}

export default MessagesScreen

