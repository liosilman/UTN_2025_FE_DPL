"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { useForm } from "../hooks/useForm"
import "../styles/Auth.css"

/**
 * Pantalla de restablecimiento de contraseña
 * @returns {JSX.Element} - Componente
 */
const ResetPasswordScreen = () => {
  const { resetPassword, rewritePassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [resetError, setResetError] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Obtener el token de restablecimiento de la URL
  const searchParams = new URLSearchParams(location.search)
  const resetToken = searchParams.get("reset_token")

  // Determinar si estamos en la pantalla de solicitud o de restablecimiento
  const isResetRequest = !resetToken

  /**
   * Valida el formulario de solicitud de restablecimiento
   * @param {Object} values - Valores del formulario
   * @returns {Object} - Errores de validación
   */
  const validateRequestForm = (values) => {
    const errors = {}

    if (!values.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }

    return errors
  }

  /**
   * Valida el formulario de restablecimiento de contraseña
   * @param {Object} values - Valores del formulario
   * @returns {Object} - Errores de validación
   */
  const validateResetForm = (values) => {
    const errors = {}

    if (!values.password) {
      errors.password = "La contraseña es obligatoria"
    } else if (values.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    return errors
  }

  /**
   * Maneja el envío del formulario de solicitud
   * @param {Object} values - Valores del formulario
   */
  const handleRequestSubmit = async (values) => {
    try {
      await resetPassword(values.email)
      setResetSuccess(true)
    } catch (error) {
      setResetError("Error al solicitar restablecimiento de contraseña")
    }
  }

  /**
   * Maneja el envío del formulario de restablecimiento
   * @param {Object} values - Valores del formulario
   */
  const handleResetSubmit = async (values) => {
    try {
      // Asegurarse de que el token se está enviando correctamente
      if (!resetToken) {
        setResetError("Token de restablecimiento no válido o expirado")
        return
      }

      await rewritePassword(values.password, resetToken)
      setResetSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
      setResetError("Error al restablecer contraseña. El token puede haber expirado.")
    }
  }

  const {
    values: requestValues,
    errors: requestErrors,
    touched: requestTouched,
    isSubmitting: requestSubmitting,
    handleChange: handleRequestChange,
    handleBlur: handleRequestBlur,
    handleSubmit: submitRequestForm,
  } = useForm({ email: "" }, handleRequestSubmit, validateRequestForm)

  const {
    values: resetValues,
    errors: resetErrors,
    touched: resetTouched,
    isSubmitting: resetSubmitting,
    handleChange: handleResetChange,
    handleBlur: handleResetBlur,
    handleSubmit: submitResetForm,
  } = useForm({ password: "", confirmPassword: "" }, handleResetSubmit, validateResetForm)

  if (resetSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-logo">
            <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
          </div>

          <h1 className="auth-title">{isResetRequest ? "¡Solicitud enviada!" : "¡Contraseña restablecida!"}</h1>
          <p className="auth-subtitle">
            {isResetRequest
              ? "Te hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña."
              : "Tu contraseña ha sido restablecida correctamente. Serás redirigido a la página de inicio de sesión en unos segundos."}
          </p>

          <div className="auth-form-footer">
            <p>
              <Link to="/login">Ir a inicio de sesión</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-logo">
          <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
        </div>

        <h1 className="auth-title">{isResetRequest ? "Restablecer contraseña" : "Crear nueva contraseña"}</h1>
        <p className="auth-subtitle">
          {isResetRequest ? "Ingresa tu email para recibir instrucciones" : "Ingresa tu nueva contraseña"}
        </p>

        {resetError && <div className="auth-error">{resetError}</div>}

        {isResetRequest ? (
          <form onSubmit={submitRequestForm}>
            <div className="auth-form-group">
              <label htmlFor="email" className="auth-form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="auth-form-input"
                value={requestValues.email}
                onChange={handleRequestChange}
                onBlur={handleRequestBlur}
              />
              {requestTouched.email && requestErrors.email && (
                <div className="auth-form-error">{requestErrors.email}</div>
              )}
            </div>

            <button type="submit" className="auth-form-button" disabled={requestSubmitting}>
              {requestSubmitting ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitResetForm}>
            <div className="auth-form-group">
              <label htmlFor="password" className="auth-form-label">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="auth-form-input"
                value={resetValues.password}
                onChange={handleResetChange}
                onBlur={handleResetBlur}
                autocomplete="new-password"
              />
              {resetTouched.password && resetErrors.password && (
                <div className="auth-form-error">{resetErrors.password}</div>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="confirmPassword" className="auth-form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="auth-form-input"
                value={resetValues.confirmPassword}
                onChange={handleResetChange}
                onBlur={handleResetBlur}
                autocomplete="new-password"
              />
              {resetTouched.confirmPassword && resetErrors.confirmPassword && (
                <div className="auth-form-error">{resetErrors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="auth-form-button" disabled={resetSubmitting}>
              {resetSubmitting ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
          </form>
        )}

        <div className="auth-form-footer">
          <p>
            <Link to="/login">Volver a inicio de sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordScreen

