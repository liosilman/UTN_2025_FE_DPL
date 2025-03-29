import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./Context/AuthContext"
import ProtectedRoute from "./Components/ProtectedRoute"
import LoginScreen from "./Screens/LoginScreen"
import RegisterScreen from "./Screens/RegisterScreen"
import ResetPasswordScreen from "./Screens/ResetPasswordScreen"
import WorkspacesScreen from "./Screens/WorkspacesScreen"
import ChannelsScreen from "./Screens/ChannelsScreen"
import ChannelView from "./Components/ChannelView"
import DirectMessageView from "./Components/DirectMessageView"
import ProfileScreen from "./Screens/ProfileScreen"
import MainLayout from "./Components/MainLayout"
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

          {/* Ruta de perfil */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileScreen />} />
          </Route>

          {/* Rutas de workspace con MainLayout */}
          <Route
            path="/workspaces/:workspaceId"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Ruta principal del workspace muestra los canales */}
            <Route index element={<ChannelsScreen />} />

            {/* Ruta de canal específico */}
            <Route path="channels/:channelId" element={<ChannelView />} />

            {/* Ruta de mensajes directos */}
            <Route path="dm/:userId" element={<DirectMessageView />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

