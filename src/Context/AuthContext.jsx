import { createContext, useState, useEffect, useContext } from "react"
import { get, post } from "../utils/fetching/fetching.utils"
import ENVIROMENT from "../config/enviroment"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await get(ENVIROMENT.ROUTES.USER.ME)
        setUser(response.data)
      } catch (error) {
        console.error("Error verifying auth:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await post(ENVIROMENT.ROUTES.AUTH.LOGIN, { email, password })

      if (!response.data?.authorization_token) {
        throw new Error("Authorization token missing")
      }

      localStorage.setItem("token", response.data.authorization_token)
      const userResponse = await get(ENVIROMENT.ROUTES.USER.ME)
      setUser(userResponse.data)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      await post(ENVIROMENT.ROUTES.AUTH.REGISTER, userData)
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const resetPassword = async (email) => {
    setLoading(true)
    setError(null)

    try {
      // Incluir la URL base actual para que el backend genere enlaces correctos
      const currentUrl = window.location.origin
      await post(ENVIROMENT.ROUTES.AUTH.RESET_PASSWORD, {
        email,
        redirect_url: `${currentUrl}/reset-password`,
      })
    } catch (error) {
      setError(error.response?.data?.message || "Password reset request failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const rewritePassword = async (token, newPassword) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Intentando reescribir contraseña con token:", token)
      console.log("URL del endpoint:", ENVIROMENT.ROUTES.AUTH.REWRITE_PASSWORD)

      // Depuración adicional
      console.log("Datos a enviar:", {
        token: token,
        password: newPassword ? "[REDACTED]" : undefined,
      })

      // Enviar la solicitud con el formato correcto
      const response = await post(ENVIROMENT.ROUTES.AUTH.REWRITE_PASSWORD, {
        token,
        password: newPassword,
      })

      console.log("Respuesta del servidor:", response)
      return response
    } catch (error) {
      console.error("Error al reescribir contraseña:", error)

      // Intentar con un formato alternativo como último recurso
      try {
        console.log("Intentando con formato alternativo...")
        const response = await post(ENVIROMENT.ROUTES.AUTH.REWRITE_PASSWORD, {
          reset_token: token,
          password: newPassword,
        })
        console.log("Respuesta con formato alternativo:", response)
        return response
      } catch (secondError) {
        console.error("Error con formato alternativo:", secondError)
        setError(error.message || "Password update failed")
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    rewritePassword,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

