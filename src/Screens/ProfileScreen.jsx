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

    /**
     * Maneja el cierre de sesión
     */
    const handleLogout = () => {
        logout()
        navigate("/login")
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

    return (
        <div className="profile-container">
            <div className="profile-header">
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

                <form className="profile-form">
                    <div className="profile-form-group">
                        <label htmlFor="currentPassword" className="profile-form-label">
                            Contraseña actual
                        </label>
                        <input type="password" id="currentPassword" className="profile-form-input" />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="newPassword" className="profile-form-label">
                            Nueva contraseña
                        </label>
                        <input type="password" id="newPassword" className="profile-form-input" />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="confirmPassword" className="profile-form-label">
                            Confirmar contraseña
                        </label>
                        <input type="password" id="confirmPassword" className="profile-form-input" />
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

