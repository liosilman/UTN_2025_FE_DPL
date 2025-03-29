"use client"

import { useState } from "react"
import { post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import { useAuth } from "../Context/AuthContext"
import "../styles/MessageInput.css"

/**
 * Componente de entrada de mensajes
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente
 */
const MessageInput = ({ workspaceId, channelId, onMessageSent }) => {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  /**
   * Maneja el cambio en el input de mensaje
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  /**
   * Maneja el envío del mensaje
   * @param {Event} e - Evento de envío
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) return

    setSending(true)
    setError(null)

    try {
      await post(ROUTES.WORKSPACES.CHANNEL_MESSAGES(workspaceId, channelId), {
        content: message.trim(),
        user_id: user._id,
      })

      setMessage("")

      // Notificar que se ha enviado un mensaje
      if (onMessageSent) {
        onMessageSent()
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error)
      setError("Error al enviar mensaje")
    } finally {
      setSending(false)
    }
  }

  /**
   * Maneja el evento de presionar una tecla
   * @param {Event} e - Evento de tecla
   */
  const handleKeyDown = (e) => {
    // Enviar mensaje con Enter (sin Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="message-input">
      {error && <div className="message-input-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="message-input-container">
          <textarea
            className="message-input-field"
            placeholder={`Enviar mensaje a #${channelId ? "canal" : "canal"}`}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />

          <div className="message-input-actions">
            <button type="submit" className="message-input-button" disabled={!message.trim() || sending}>
              📤
            </button>
          </div>
        </div>
      </form>

      <div className="message-input-formatting">
        <button className="message-input-formatting-button" title="Negrita">
          B
        </button>
        <button className="message-input-formatting-button" title="Cursiva">
          I
        </button>
        <button className="message-input-formatting-button" title="Tachado">
          S
        </button>
        <button className="message-input-formatting-button" title="Código">
          {"</>"}
        </button>
      </div>
    </div>
  )
}

export default MessageInput

