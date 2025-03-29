"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { get } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import "../styles/WorkspaceNav.css"

/**
 * Componente de navegación de workspaces (barra lateral izquierda)
 * @returns {JSX.Element} - Componente
 */
const WorkspaceNav = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await get(ROUTES.WORKSPACES.BASE)
        setWorkspaces(response.data.workspaces || [])
      } catch (error) {
        console.error("Error al cargar workspaces:", error)
        setError("Error al cargar workspaces")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaces()
  }, [])

  /**
   * Maneja la navegación a un workspace
   * @param {string} id - ID del workspace
   */
  const handleWorkspaceClick = (id) => {
    navigate(`/workspaces/${id}`)
  }

  /**
   * Maneja la navegación a la lista de workspaces
   */
  const handleAllWorkspacesClick = () => {
    navigate("/workspaces")
  }

  /**
   * Maneja la navegación al perfil
   */
  const handleProfileClick = () => {
    navigate("/profile")
  }

  /**
   * Obtiene las iniciales del nombre del workspace
   * @param {string} name - Nombre del workspace
   * @returns {string} - Iniciales del nombre del workspace
   */
  const getWorkspaceInitials = (name) => {
    if (!name) return "W"
    return name.charAt(0).toUpperCase()
  }

  /**
   * Obtiene las iniciales del nombre de usuario
   * @returns {string} - Iniciales del nombre de usuario
   */
  const getUserInitials = () => {
    if (!user || !user.username) return "?"
    return user.username.charAt(0).toUpperCase()
  }

  return (
    <div className="workspace-nav">
      <div className="workspace-nav-header">
        <div className="workspace-nav-item home" onClick={handleAllWorkspacesClick} title="Todos los workspaces">
          <div className="workspace-nav-icon home-icon">🏠</div>
        </div>
      </div>

      <div className="workspace-nav-list">
        {loading ? (
          <div className="workspace-nav-loading">
            <div className="loading-spinner-small"></div>
          </div>
        ) : error ? (
          <div className="workspace-nav-error" title={error}>
            ❌
          </div>
        ) : (
          workspaces.map((workspace) => (
            <div
              key={workspace._id}
              className={`workspace-nav-item ${workspace._id === workspaceId ? "active" : ""}`}
              onClick={() => handleWorkspaceClick(workspace._id)}
              title={workspace.name}
            >
              <div className="workspace-nav-icon">{getWorkspaceInitials(workspace.name)}</div>
            </div>
          ))
        )}

        <div className="workspace-nav-item add" onClick={handleAllWorkspacesClick} title="Añadir workspace">
          <div className="workspace-nav-icon add-icon">+</div>
        </div>
      </div>

      <div className="workspace-nav-footer">
        <div className="workspace-nav-item profile" onClick={handleProfileClick} title="Perfil">
          <div className="workspace-nav-icon user">{getUserInitials()}</div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceNav

