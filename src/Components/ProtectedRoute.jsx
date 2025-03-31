
import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} - Componente
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  // Redirigir a la página de login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Renderizar los hijos si está autenticado
  return children
}

export default ProtectedRoute

