import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./Context/AuthContext"
import ProtectedRoute from "./Components/ProtectedRoute"
import LoginScreen from "./Screens/LoginScreen"
import RegisterScreen from "./Screens/RegisterScreen"
import ResetPasswordScreen from "./Screens/ResetPasswordScreen"
import WorkspacesScreen from "./Screens/WorkspacesScreen"
import ChannelsScreen from "./Screens/ChannelsScreen"
import ChannelView from "./Components/ChannelView"  // Asegúrate de importar ChannelView
import ProfileScreen from "./Screens/ProfileScreen"
import MainLayout from "./Components/MainLayout"  // Importar MainLayout
import "./styles/App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />

          {/* Rutas protegidas */}
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <WorkspacesScreen />
              </ProtectedRoute>
            }
          />

          <Route
            path="/workspaces/:workspaceId"
            element={
              <ProtectedRoute>
                <MainLayout /> {/* Agregar MainLayout aquí */}
              </ProtectedRoute>
            }
          >
            <Route path="/workspaces/:workspaceId" element={<ChannelsScreen />} />
            <Route path="/workspaces/:workspaceId/channels/:channelId" element={<ChannelView />} />
          </Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
