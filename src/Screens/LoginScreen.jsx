"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { useForm } from "../hooks/useForm"
import "../styles/Auth.css"

/**
 * Pantalla de inicio de sesión
 * @returns {JSX.Element} - Componente
 */
const LoginScreen = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState(null)

  /**
   * Valida el formulario de inicio de sesión
   * @param {Object} values - Valores del formulario
   * @returns {Object} - Errores de validación
   */
  const validateForm = (values) => {
    const errors = {}

    if (!values.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }

    if (!values.password) {
      errors.password = "La contraseña es obligatoria"
    }

    return errors
  }

  /**
   * Maneja el envío del formulario
   * @param {Object} values - Valores del formulario
   */
  const handleSubmit = async (values) => {
    try {
      await login(values.email, values.password)
      navigate("/workspaces")
    } catch (error) {
      setLoginError("Credenciales inválidas")
    }
  }

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
  } = useForm({ email: "", password: "" }, handleSubmit, validateForm)

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-logo">
          <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
        </div>

        <h1 className="auth-title">Inicia sesión en tu espacio de trabajo</h1>
        <p className="auth-subtitle">Continúa con tu cuenta de Slack</p>

        {loginError && <div className="auth-error">{loginError}</div>}

        <form onSubmit={submitForm}>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="auth-form-input"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && <div className="auth-form-error">{errors.email}</div>}
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-form-input"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autocomplete="current-password"
            />
            {touched.password && errors.password && <div className="auth-form-error">{errors.password}</div>}
          </div>

          <button type="submit" className="auth-form-button" disabled={isSubmitting}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <div className="auth-form-footer">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
            <p>
              <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginScreen

