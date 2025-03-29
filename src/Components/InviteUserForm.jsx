"use client"

import { useState } from "react"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import "../styles/InviteUser.css"

/**
 * Componente para invitar usuarios a un workspace
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente
 */
const InviteUserForm = ({ workspaceId, onInviteSuccess, onCancel }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  /**
   * Maneja el cambio en el campo de email
   * @param {Event} e - Evento de cambio
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setError(null)
    setSelectedUser(null)

    // Si el campo está vacío, limpiar resultados de búsqueda
    if (!e.target.value.trim()) {
      setSearchResults([])
    }
  }

  /**
   * Busca usuarios por email
   */
  const handleSearchUser = async () => {
    if (!email.trim()) {
      setError("El email es obligatorio")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Email inválido")
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      // Buscar usuario por email
      const response = await get(ROUTES.USER.SEARCH_BY_EMAIL(email.trim()))

      console.log("Respuesta de búsqueda:", response)

      if (response && response.payload) {
        // Si la respuesta contiene un solo usuario
        const userData = response.payload
        setSearchResults([userData])
        setSelectedUser(userData)
      } else {
        setSearchResults([])
        setError("No se encontraron usuarios con ese email")
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error)
      setError("No se encontró ningún usuario con ese email")
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  /**
   * Selecciona un usuario de los resultados de búsqueda
   * @param {Object} user - Usuario seleccionado
   */
  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedUser) {
      setError("Primero debes buscar y seleccionar un usuario")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Invitar al usuario al workspace usando su ID
      console.log(`Invitando al usuario ${selectedUser._id} al workspace ${workspaceId}`)

      // Cambiamos la forma de enviar la invitación para que sea compatible con el backend
      const response = await post(ROUTES.WORKSPACES.INVITE_USER(workspaceId), {
        user_id: selectedUser._id,
      })

      console.log("Respuesta de invitación:", response)

      setSuccess(true)
      setEmail("")
      setSelectedUser(null)
      setSearchResults([])

      // Notificar al componente padre
      if (onInviteSuccess) {
        onInviteSuccess()
      }

      // Resetear el estado de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error al invitar usuario:", error)
      setError(
        "No se pudo enviar la invitación. Es posible que el usuario ya esté invitado o sea miembro del workspace.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="invite-user-form">
      <h2 className="invite-user-title">Invitar usuario al workspace</h2>

      {success && <div className="invite-user-success">Invitación enviada correctamente</div>}

      {error && <div className="invite-user-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="invite-user-form-group">
          <label htmlFor="email" className="invite-user-label">
            Email del usuario
          </label>
          <div className="invite-user-search">
            <input
              type="email"
              id="email"
              className="invite-user-input"
              value={email}
              onChange={handleEmailChange}
              placeholder="ejemplo@correo.com"
              disabled={loading || searchLoading}
            />
            <button
              type="button"
              className="invite-user-search-button"
              onClick={handleSearchUser}
              disabled={loading || searchLoading || !email.trim()}
            >
              {searchLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="invite-user-results">
            <h3 className="invite-user-results-title">Resultados de búsqueda:</h3>
            <ul className="invite-user-results-list">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className={`invite-user-result ${selectedUser && selectedUser._id === user._id ? "selected" : ""}`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="invite-user-result-avatar">
                    {user.username ? user.username.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="invite-user-result-info">
                    <div className="invite-user-result-name">{user.username || "Usuario"}</div>
                    <div className="invite-user-result-email">{user.email}</div>
                  </div>
                  {selectedUser && selectedUser._id === user._id && (
                    <div className="invite-user-result-selected">✓</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="invite-user-actions">
          <button type="button" className="invite-user-button cancel" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="invite-user-button submit" disabled={loading || !selectedUser}>
            {loading ? "Enviando..." : "Invitar"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default InviteUserForm

