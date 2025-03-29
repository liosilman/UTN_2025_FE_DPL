"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import "../styles/Profile.css"

/**
 * Pantalla de perfil
 * @returns {JSX.Element} - Componente
 */
const ProfileScreen = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({})

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  /**
   * Maneja la navegación de regreso
   */
  const handleGoBack = () => {
    // Intentar volver a la página anterior
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      // Si no hay historial, ir a workspaces
      navigate("/workspaces")
    }
  }

  /**
   * Obtiene las iniciales del nombre de usuario
   * @returns {string} - Iniciales del nombre de usuario
   */
  const getUserInitials = () => {
    if (!user || !user.username) return "?"
    return user.username.charAt(0).toUpperCase()
  }

  /**
   * Formatea la fecha
   * @param {string} dateString - Fecha en formato string
   * @returns {string} - Fecha formateada
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  /**
   * Valida el formulario de cambio de contraseña
   */
  const validateForm = () => {
    const errors = {}

    if (!formData.currentPassword) {
      errors.currentPassword = "La contraseña actual es obligatoria"
    }

    if (!formData.newPassword) {
      errors.newPassword = "La nueva contraseña es obligatoria"
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    return errors
  }

  /**
   * Maneja el envío del formulario de cambio de contraseña
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      // Aquí iría la lógica para cambiar la contraseña
      alert("Funcionalidad de cambio de contraseña no implementada")
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="profile-back-button" onClick={handleGoBack}>
          ← Volver
        </button>

        <div className="profile-avatar">{getUserInitials()}</div>

        <div className="profile-info">
          <h1 className="profile-name">{user?.username || "Usuario"}</h1>
          <p className="profile-email">{user?.email || "email@example.com"}</p>

          <div className="profile-status">
            <span className="profile-status-indicator"></span>
            <span>Activo</span>
          </div>

          <div className="profile-actions">
            <button className="btn btn-secondary">Editar perfil</button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Información de la cuenta</h2>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Nombre de usuario</span>
            <span className="profile-info-value">{user?.username || "N/A"}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{user?.email || "N/A"}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Cuenta creada</span>
            <span className="profile-info-value">{formatDate(user?.created_at)}</span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">Última actualización</span>
            <span className="profile-info-value">{formatDate(user?.modified_at)}</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h2 className="profile-section-title">Cambiar contraseña</h2>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-group">
            <label htmlFor="currentPassword" className="profile-form-label">
              Contraseña actual
            </label>
            <input
              type="password"
              id="currentPassword"
              className="profile-form-input"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            {formErrors.currentPassword && <div className="profile-form-error">{formErrors.currentPassword}</div>}
          </div>

          <div className="profile-form-group">
            <label htmlFor="newPassword" className="profile-form-label">
              Nueva contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              className="profile-form-input"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {formErrors.newPassword && <div className="profile-form-error">{formErrors.newPassword}</div>}
          </div>

          <div className="profile-form-group">
            <label htmlFor="confirmPassword" className="profile-form-label">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="profile-form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {formErrors.confirmPassword && <div className="profile-form-error">{formErrors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileScreen

