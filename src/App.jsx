import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import RewritePasswordScreen from './Screens/RewritePasswordScreen';
import WorkspacesScreen from './Screens/WorkspacesScreen';
import ChannelsScreen from './Screens/ChannelsScreen';
import MessagesScreen from './Screens/MessagesScreen';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <div>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route path="/rewrite-password" element={<RewritePasswordScreen />} />
        <Route path="/" element={<LoginScreen />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/workspaces" element={<WorkspacesScreen />} />
          <Route path="/workspaces/:workspace_id/channels" element={<ChannelsScreen />} />
          <Route path="/workspaces/:workspace_id/channels/:channel_id/messages" element={<MessagesScreen />} />
        </Route>

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </div>
  );
}

export default App;
