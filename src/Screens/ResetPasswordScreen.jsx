import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import { useForm } from "../hooks/useForm"
import "../styles/Auth.css"

const ResetPasswordScreen = () => {
  const { resetPassword, rewritePassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [resetError, setResetError] = useState(null)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get("token") || searchParams.get("reset_token")
  
  useEffect(() => {
    if (!token) return
    const verifyTokenValidity = async () => {
      try {
        const response = await fetch(`/api/auth/verify-reset-token?token=${token}`)
        const data = await response.json()
        if (!data.ok) {
          throw new Error("Token inválido o expirado")
        }
      } catch (error) {
        setResetError("El token de restablecimiento es inválido o ha expirado.")
      }
    }
    verifyTokenValidity()
  }, [token])
  
  const validateRequestForm = (values) => {
    const errors = {}
    if (!values.email) {
      errors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email inválido"
    }
    return errors
  }
  
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
  
  const handleRequestSubmit = async (values) => {
    setIsSubmitting(true)
    setResetError(null)
    try {
      await resetPassword(values.email)
      setResetSuccess(true)
    } catch (error) {
      setResetError("Error al solicitar el reseteo de contraseña. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleResetSubmit = async (values) => {
    setIsSubmitting(true)
    setResetError(null)
    try {
      if (!token) {
        throw new Error("Token no proporcionado")
      }
      await rewritePassword(token, values.password)
      setResetSuccess(true)
      setTimeout(() => {
        navigate("/login", {
          state: { passwordReset: true, message: "Contraseña actualizada correctamente" },
        })
      }, 3000)
    } catch (error) {
      setResetError("No se pudo actualizar la contraseña. El enlace puede haber expirado. Por favor, solicita un nuevo enlace.")
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
  } = useForm({ password: "", confirmPassword: "", manualToken: "" }, handleResetSubmit, validateResetForm)
  
  if (resetSuccess && !token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <div className="auth-logo">
            <img src="https://a.slack-edge.com/bv1-10/slack_logo-ebd02d1.svg" alt="Slack" />
          </div>
          <h1 className="auth-title">¡Solicitud enviada!</h1>
          <p className="auth-subtitle">Revisa tu email para continuar con el proceso de restablecimiento de contraseña.</p>
          <div className="auth-form-footer">
            <Link to="/login" className="auth-link">Volver a inicio de sesión</Link>
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
        <p className="auth-subtitle">{!token ? "Ingresa tu email para recibir instrucciones" : "Crea una nueva contraseña segura"}</p>
        {resetError && <div className="auth-error"><p>{resetError}</p></div>}
      </div>
    </div>
  )
}

export default ResetPasswordScreen
