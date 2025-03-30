"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { useForm } from "../hooks/useForm"
import "../styles/Auth.css"

/**
 * Pantalla de registro
 * @returns {JSX.Element} - Componente
 */
const RegisterScreen = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [registerError, setRegisterError] = useState(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  /**
   * Valida el formulario de registro
   * @param {Object} values - Valores del formulario
   * @returns {Object} - Errores de validación
   */
  const validateForm = (values) => {
    const errors = {}

    if (!values.username) {
      errors.username = "El nombre de usuario es obligatorio"
    } else if (values.username.length < 3) {
      errors.username = "El nombre de usuario debe tener al menos 3 caracteres"
    }

    if (!values.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }

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
   * Maneja el envío del formulario
   * @param {Object} values - Valores del formulario
   */
  const handleSubmit = async (values) => {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      })

      setRegisterSuccess(true)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setRegisterError("Error al registrar usuario")
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
  } = useForm({ username: "", email: "", password: "", confirmPassword: "" }, handleSubmit, validateForm)

  if (registerSuccess) {
    return (
      <div className="auth-container register-container">
        <div className="auth-form">
          <div className="auth-logo">
            <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
          </div>

          <h1 className="auth-title">¡Registro exitoso!</h1>
          <p className="auth-subtitle">
            Te hemos enviado un correo electrónico para verificar tu cuenta. Serás redirigido a la página de inicio de
            sesión en unos segundos.
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
    <div className="auth-container register-container">
      <div className="auth-form">
        <div className="auth-logo">
          <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
        </div>

        <h1 className="auth-title">Crea tu cuenta de Slack</h1>
        <p className="auth-subtitle">Regístrate para comenzar</p>

        {registerError && <div className="auth-error">{registerError}</div>}

        <form onSubmit={submitForm}>
          <div className="auth-form-group">
            <label htmlFor="username" className="auth-form-label">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="auth-form-input"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.username && errors.username && <div className="auth-form-error">{errors.username}</div>}
          </div>

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
              autoComplete="new-password"
            />
            {touched.password && errors.password && <div className="auth-form-error">{errors.password}</div>}
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
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="auth-form-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="auth-form-button" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>

          <div className="auth-form-footer">
            <p>
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterScreen

