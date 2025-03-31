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
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener el token de la URL
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get("token") || searchParams.get("reset_token")

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
      errors.password = "Mínimo 6 caracteres"
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
    setIsSubmitting(true)
    setResetError(null)

    try {
      await resetPassword(values.email)
      // Mostrar mensaje más claro sobre el enlace
      setResetSuccess(true)
      // Mostrar un mensaje más informativo
      setResetError(
        "IMPORTANTE: El enlace de restablecimiento se enviará a tu correo. Cuando lo recibas, copia el token de la URL y pégalo manualmente en esta página si te redirige a localhost.",
      )
    } catch (error) {
      console.error("Error al solicitar reseteo:", error)
      setResetError("Error al solicitar el reseteo de contraseña. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Maneja el envío del formulario de restablecimiento
   * @param {Object} values - Valores del formulario
   */
  const handleResetSubmit = async (values) => {
    setIsSubmitting(true)
    setResetError(null)

    try {
      if (!token) {
        throw new Error("Token no proporcionado")
      }

      console.log("Intentando restablecer contraseña con token:", token)

      // Intentar restablecer la contraseña directamente
      await rewritePassword(token, values.password)

      setResetSuccess(true)
      setTimeout(() => {
        navigate("/login", {
          state: {
            passwordReset: true,
            message: "Contraseña actualizada correctamente",
          },
        })
      }, 3000)
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)

      // Mensaje de error más descriptivo
      setResetError(
        "No se pudo actualizar la contraseña. El enlace puede haber expirado. Por favor, solicita un nuevo enlace.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const {
    values: requestValues,
    errors: requestErrors,
    touched: requestTouched,
    handleChange: handleRequestChange,
    handleBlur: handleRequestBlur,
    handleSubmit: submitRequestForm,
  } = useForm({ email: "" }, handleRequestSubmit, validateRequestForm)

  const {
    values: resetValues,
    errors: resetErrors,
    touched: resetTouched,
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

          <h1 className="auth-title">{!token ? "¡Solicitud enviada!" : "¡Contraseña actualizada!"}</h1>

          <p className="auth-subtitle">
            {!token
              ? "Revisa tu email para continuar con el proceso. Si el enlace te lleva a localhost, copia el token de la URL y pégalo manualmente en esta página."
              : "Redirigiendo a inicio de sesión..."}
          </p>

          <div className="auth-form-footer">
            <Link to="/login" className="auth-link">
              Volver a inicio de sesión
            </Link>
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

        <h1 className="auth-title">{!token ? "Restablecer contraseña" : "Crear nueva contraseña"}</h1>

        <p className="auth-subtitle">
          {!token ? "Ingresa tu email para recibir instrucciones" : "Crea una nueva contraseña segura"}
        </p>

        {resetError && (
          <div className="auth-error">
            <p>{resetError}</p>
          </div>
        )}

        {!token ? (
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
                disabled={isSubmitting}
              />
              {requestTouched.email && requestErrors.email && (
                <div className="auth-form-error">{requestErrors.email}</div>
              )}
            </div>

            <button type="submit" className="auth-form-button" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
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
                autoComplete="new-password"
                disabled={isSubmitting}
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
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              {resetTouched.confirmPassword && resetErrors.confirmPassword && (
                <div className="auth-form-error">{resetErrors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className="auth-form-button" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}

        {!token && resetSuccess && (
          <div className="auth-form-group" style={{ marginTop: "20px" }}>
            <label htmlFor="manualToken" className="auth-form-label">
              ¿Recibiste un enlace que te llevó a localhost? Pega el token aquí:
            </label>
            <input
              type="text"
              id="manualToken"
              className="auth-form-input"
              placeholder="Pega el token de la URL aquí"
              onChange={(e) => {
                if (e.target.value) {
                  window.location.href = `${window.location.origin}${window.location.pathname}?token=${e.target.value}`
                }
              }}
            />
            <small className="auth-form-help">
              El token suele estar después de "token=" o "reset_token=" en la URL
            </small>
          </div>
        )}

        <div className="auth-form-footer">
          <Link to="/login" className="auth-link">
            Volver a inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordScreen

