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

  const verifyTokenValidity = async (token) => {
    try {
      if (!token) throw new Error("Token no proporcionado")
      
      const response = await fetch(`/api/auth/verify-reset-token?token=${token}`)
      const data = await response.json()
      
      if (!data.ok) {
        throw new Error("Token inválido o expirado")
      }
    } catch (error) {
      setResetError("El token de restablecimiento es inválido o ha expirado.")
    }
  }

  useEffect(() => {
    if (token) {
      verifyTokenValidity(token)
    }
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
          state: {
            passwordReset: true,
            message: "Contraseña actualizada correctamente",
          },
        })
      }, 3000)
    } catch (error) {
      setResetError(
        "No se pudo actualizar la contraseña. El enlace puede haber expirado. Por favor, solicita un nuevo enlace."
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

  if (resetSuccess && !token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h1 className="auth-title">¡Solicitud enviada!</h1>
          <p className="auth-subtitle">Revisa tu email para continuar con el proceso.</p>
          <Link to="/login" className="auth-link">Volver a inicio de sesión</Link>
        </div>
      </div>
    )
  }

  if (resetSuccess && token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h1 className="auth-title">¡Contraseña actualizada!</h1>
          <p className="auth-subtitle">Serás redirigido a la página de inicio de sesión.</p>
          <Link to="/login" className="auth-link">Ir a inicio de sesión</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1 className="auth-title">{!token ? "Restablecer contraseña" : "Crear nueva contraseña"}</h1>
        <p className="auth-subtitle">{!token ? "Ingresa tu email" : "Crea una nueva contraseña segura"}</p>

        {resetError && <div className="auth-error"><p>{resetError}</p></div>}

        {!token ? (
          <form onSubmit={submitRequestForm}>
            <input type="email" name="email" value={requestValues.email} onChange={handleRequestChange} onBlur={handleRequestBlur} disabled={isSubmitting} />
            {requestTouched.email && requestErrors.email && <p>{requestErrors.email}</p>}
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enviando..." : "Enviar"}</button>
          </form>
        ) : (
          <form onSubmit={submitResetForm}>
            <input type="password" name="password" value={resetValues.password} onChange={handleResetChange} onBlur={handleResetBlur} disabled={isSubmitting} />
            {resetTouched.password && resetErrors.password && <p>{resetErrors.password}</p>}
            <input type="password" name="confirmPassword" value={resetValues.confirmPassword} onChange={handleResetChange} onBlur={handleResetBlur} disabled={isSubmitting} />
            {resetTouched.confirmPassword && resetErrors.confirmPassword && <p>{resetErrors.confirmPassword}</p>}
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Actualizando..." : "Actualizar"}</button>
          </form>
        )}

        <Link to="/login" className="auth-link">Volver a inicio de sesión</Link>
      </div>
    </div>
  )
}

export default ResetPasswordScreen
