"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import "../styles/Sidebar.css"

/**
 * Componente de barra lateral
 * @returns {JSX.Element} - Componente
 */
const Sidebar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { workspaceId, channelId } = useParams()

  const [isOpen, setIsOpen] = useState(true)
  const [workspace, setWorkspace] = useState(null)
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newChannelName, setNewChannelName] = useState("") // Estado para el nombre del canal
  const [showChannelForm, setShowChannelForm] = useState(false)

  // Cargar el workspace y los canales
  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId) {
        setLoading(false)
        return
      }

      try {
        // Obtener información del workspace
        const workspaceResponse = await get(ROUTES.WORKSPACES.GET_BY_ID(workspaceId))
        setWorkspace(workspaceResponse.data)

        // Obtener canales del workspace
        const channelsResponse = await get(ROUTES.WORKSPACES.CHANNELS(workspaceId))
        setChannels(channelsResponse.data || [])
      } catch (error) {
        console.error("Error al cargar datos del workspace:", error)
        setError("Error al cargar datos del workspace")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaceData()
  }, [workspaceId])

  /**
   * Maneja la navegación a un canal
   * @param {string} channelId - ID del canal
   */
  const handleChannelClick = (channelId) => {
    navigate(`/workspaces/${workspaceId}/channels/${channelId}`)
  }

  /**
   * Maneja la navegación a la lista de workspaces
   */
  const handleWorkspacesClick = () => {
    navigate("/workspaces")
  }

  /**
   * Maneja la apertura/cierre de la barra lateral en móvil
   */
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  /**
   * Función para manejar la creación de un nuevo canal
   */
  const handleAddChannelClick = async () => {
    if (!newChannelName.trim()) {
      alert("El nombre del canal no puede estar vacío.")
      return
    }

    const newChannel = {
      name: newChannelName,
    }

    try {
      // Enviar una solicitud POST para crear el canal
      const response = await post(ROUTES.WORKSPACES.CREATE_CHANNEL(workspaceId), newChannel)

      // Si la creación del canal fue exitosa, redirigir al canal recién creado
      if (response && response.data) {
        const createdChannel = response.data
        setNewChannelName("")
        setShowChannelForm(false)
        // Actualizar la lista de canales
        setChannels([...channels, createdChannel])
        navigate(`/workspaces/${workspaceId}/channels/${createdChannel._id}`)
      }
    } catch (error) {
      console.error("Error al crear el canal:", error)
      setError("Error al crear el canal")
    }
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-workspace" onClick={handleWorkspacesClick}>
            {workspace ? workspace.name : "Cargando..."}
          </div>
          <div className="sidebar-user">
            <div className="sidebar-user-status"></div>
            <span>{user?.username || "Usuario"}</span>
          </div>
        </div>

        <div className="sidebar-sections">
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">CANALES</span>
              <span
                className="sidebar-section-icon"
                onClick={() => setShowChannelForm(!showChannelForm)}
                title="Añadir canal"
              >
                +
              </span>
            </div>

            {loading ? (
              <div className="sidebar-loading">Cargando canales...</div>
            ) : error ? (
              <div className="sidebar-error">{error}</div>
            ) : (
              <ul className="sidebar-list">
                {channels.length > 0 ? (
                  channels.map((channel) => (
                    <li
                      key={channel._id}
                      className={`sidebar-list-item ${channel._id === channelId ? "active" : ""}`}
                      onClick={() => handleChannelClick(channel._id)}
                    >
                      <span className="sidebar-list-item-icon">#</span>
                      <span className="sidebar-list-item-text">{channel.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="sidebar-list-empty">No hay canales</li>
                )}
              </ul>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">MENSAJES DIRECTOS</span>
              <span className="sidebar-section-icon">+</span>
            </div>

            <ul className="sidebar-list">
              <li className="sidebar-list-empty">No hay mensajes directos</li>
            </ul>
          </div>
        </div>

        <div className="sidebar-footer">
          {showChannelForm && (
            <div className="sidebar-form">
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Nombre del nuevo canal"
                className="sidebar-form-input"
              />
              <div className="sidebar-form-actions">
                <button
                  className="sidebar-form-button cancel"
                  onClick={() => {
                    setShowChannelForm(false)
                    setNewChannelName("")
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="sidebar-form-button create"
                  onClick={handleAddChannelClick}
                  disabled={!newChannelName.trim()}
                >
                  Crear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? "X" : "☰"}
      </button>
    </>
  )
}

export default Sidebar

