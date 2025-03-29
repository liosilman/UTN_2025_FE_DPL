"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import "../styles/Header.css"

/**
 * Componente de cabecera
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente
 */
const Header = ({ channelName = "", channelInfo = "", workspaceId = "", channelId = "" }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  /**
   * Maneja el clic en el botón de usuario
   */
  const handleUserClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  /**
   * Maneja la navegación al perfil
   */
  const handleProfileClick = () => {
    navigate("/profile")
    setShowUserMenu(false)
  }

  /**
   * Maneja la navegación a workspaces
   */
  const handleWorkspacesClick = () => {
    navigate("/workspaces")
    setShowUserMenu(false)
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
    <header className="header">
      <div className="header-channel">
        {channelName && (
          <>
            <span className="header-channel-icon">#</span>
            <h2 className="header-channel-name">{channelName}</h2>
            {channelInfo && (
              <span className="header-channel-info" title={channelInfo}>
                ℹ️
              </span>
            )}
          </>
        )}
      </div>

      <div className="header-actions">
        <div className="header-search">
          <span className="header-search-icon">🔍</span>
          <input type="text" className="header-search-input" placeholder="Buscar en el canal" />
        </div>

        <div className="header-user" onClick={handleUserClick}>
          <div className="header-user-avatar">{getUserInitials()}</div>
          <span className="header-user-name">{user?.username || "Usuario"}</span>

          {showUserMenu && (
            <div className="header-user-menu">
              <div className="header-user-menu-item" onClick={handleProfileClick}>
                Perfil
              </div>
              <div className="header-user-menu-item" onClick={handleWorkspacesClick}>
                Workspaces
              </div>
              <div className="header-user-menu-item" onClick={handleLogout}>
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

