"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"

// Crear el contexto
const AuthContext = createContext()

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente proveedor
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await get(ROUTES.USER.ME)
        setUser(response.data)
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<void>}
   */
  const login = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await post(ROUTES.AUTH.LOGIN, { email, password })

      if (response.data && response.data.authorization_token) {
        localStorage.setItem("token", response.data.authorization_token)

        // Obtener información del usuario
        const userResponse = await get(ROUTES.USER.ME)
        setUser(userResponse.data)
      } else {
        throw new Error("No se recibió el token de autorización")
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError(error.message || "Error al iniciar sesión")
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<void>}
   */
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      await post(ROUTES.AUTH.REGISTER, userData)
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      setError(error.message || "Error al registrar usuario")
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  /**
   * Solicita un restablecimiento de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<void>}
   */
  const resetPassword = async (email) => {
    setLoading(true)
    setError(null)

    try {
      await post(ROUTES.AUTH.RESET_PASSWORD, { email })
    } catch (error) {
      console.error("Error al solicitar restablecimiento de contraseña:", error)
      setError(error.message || "Error al solicitar restablecimiento de contraseña")
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Restablece la contraseña con un token
   * @param {string} password - Nueva contraseña
   * @param {string} reset_token - Token de restablecimiento
   * @returns {Promise<void>}
   */
  const rewritePassword = async (password, reset_token) => {
    setLoading(true)
    setError(null)

    try {
      console.log("Enviando solicitud de restablecimiento con token:", reset_token)
      const response = await post(ROUTES.AUTH.REWRITE_PASSWORD, {
        password,
        reset_token,
      })

      console.log("Respuesta de restablecimiento:", response)

      if (!response || response.error) {
        throw new Error(response?.error || "Error al restablecer contraseña")
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
      setError(error.message || "Error al restablecer contraseña")
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Valor del contexto
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

/**
 * Hook para usar el contexto de autenticación
 * @returns {Object} - Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }

  return context
}

