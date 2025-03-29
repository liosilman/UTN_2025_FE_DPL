"use client"

import { useState, useEffect, useRef } from "react"
import { get } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import "../styles/MessageList.css"

/**
 * Componente de lista de mensajes
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente
 */
const MessageList = ({ workspaceId, channelId }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Cargar mensajes del canal
  useEffect(() => {
    const fetchMessages = async () => {
      if (!workspaceId || !channelId) {
        setLoading(false)
        return
      }

      try {
        const response = await get(ROUTES.WORKSPACES.CHANNEL_MESSAGES(workspaceId, channelId))
        // Ordenar mensajes por fecha (más antiguos primero)
        const sortedMessages = (response.data.messages || []).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
        setMessages(sortedMessages)
      } catch (error) {
        console.error("Error al cargar mensajes:", error)
        setError("Error al cargar mensajes")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Simular actualización periódica de mensajes (en producción usaríamos WebSockets)
    const interval = setInterval(fetchMessages, 10000)

    return () => clearInterval(interval)
  }, [workspaceId, channelId])

  // Desplazar al final de la lista de mensajes cuando se cargan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  /**
   * Formatea la fecha de un mensaje
   * @param {string} dateString - Fecha en formato string
   * @returns {string} - Fecha formateada
   */
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  /**
   * Obtiene las iniciales del nombre de usuario
   * @param {string} username - Nombre de usuario
   * @returns {string} - Iniciales del nombre de usuario
   */
  const getUserInitials = (username) => {
    if (!username) return "?"
    return username.charAt(0).toUpperCase()
  }

  /**
   * Agrupa mensajes por día
   * @param {Array} messages - Lista de mensajes
   * @returns {Array} - Lista de mensajes agrupados por día
   */
  const groupMessagesByDay = (messages) => {
    const groups = {}

    messages.forEach((message) => {
      const date = new Date(message.created_at)
      const day = date.toLocaleDateString()

      if (!groups[day]) {
        groups[day] = []
      }

      groups[day].push(message)
    })

    return Object.entries(groups).map(([day, messages]) => ({
      day,
      messages,
    }))
  }

  if (loading) {
    return (
      <div className="message-list-loading">
        <div className="loading-spinner"></div>
        <p>Cargando mensajes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="message-list-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="message-list-empty">
        <div className="message-list-empty-icon">💬</div>
        <h3 className="message-list-empty-title">No hay mensajes aún</h3>
        <p className="message-list-empty-text">Sé el primero en enviar un mensaje a este canal.</p>
      </div>
    )
  }

  const messageGroups = groupMessagesByDay(messages)

  return (
    <div className="message-list">
      {messageGroups.map((group) => (
        <div key={group.day}>
          <div className="message-day-divider">
            <span className="message-day-divider-text">{group.day}</span>
          </div>

          {group.messages.map((message) => (
            <div key={message._id} className="message">
              <div className="message-avatar">{getUserInitials(message.sender?.username)}</div>

              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">{message.sender?.username || "Usuario"}</span>
                  <span className="message-time">{formatMessageDate(message.created_at)}</span>
                </div>

                <div className="message-text">{message.content}</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList

