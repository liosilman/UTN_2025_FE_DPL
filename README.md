# Slack Clone - Frontend

## Descripción del Proyecto

Este proyecto es un clon de Slack desarrollado con la finalidad de ser el trabajo final de Fullstack. La aplicación permite a los usuarios crear espacios de trabajo (workspaces), canales de comunicación, y enviar mensajes dentro de los canales, replicando las funcionalidades principales de Slack.

## Dificultades y aprendizajes


La conexion con el backend me dio mas de un dolor de cabeza pero diria que eso me ayudo a entender muchisimo mas como funciona, para la parte final ya estaba muchisimo mas canchero y pude solucionar los problemas que iba teniendo mucho mas rapido que las primeras veces asi que diria que fue una buena experiencia, me quedaron funciones que no llegue a implementar por falta de tiempo pero que a futuro voy a agregar, algunas quedaron ya implementadas con los estilos pero falta la conexion al Backend para la funcionalidad, a comparacion del primer TP de Frontend me senti mucho mas comodo con las interfaces y creo que pude lograr un mejor trabajo en general.


## Características Principales

- Autenticación de usuarios (registro, inicio de sesión, restablecimiento de contraseña)
- Creación y gestión de workspaces
- Creación y gestión de canales dentro de los workspaces
- Creación de mensajes dentro de los canales
- Invitación de usuarios a workspaces
- Interfaz de usuario responsive que se adapta a diferentes tamaños de pantalla

## Tecnologías y Librerías Utilizadas

- **React**: Biblioteca principal para construir la interfaz de usuario
- **React Router**: Para la navegación entre diferentes vistas de la aplicación
- **Vite**: Como herramienta de construcción y desarrollo
- **CSS puro**: Para los estilos, organizados en módulos por componente
- **Context API**: Para la gestión del estado global (autenticación, workspaces)
- **Fetch API**: Para las comunicaciones con el backend

## Estructura del Proyecto

📦src
 ┣ 📂assets
 ┃ ┗ 📜react.svg
 ┣ 📂Components
 ┃ ┣ 📜ChannelView.jsx
 ┃ ┣ 📜Header.jsx
 ┃ ┣ 📜InviteUserForm.jsx
 ┃ ┣ 📜MainLayout.jsx
 ┃ ┣ 📜MessageInput.jsx
 ┃ ┣ 📜MessageList.jsx
 ┃ ┣ 📜ProtectedRoute.jsx
 ┃ ┣ 📜Sidebar.jsx
 ┃ ┗ 📜WorkspaceNav.jsx
 ┣ 📂config
 ┃ ┗ 📜enviroment.js
 ┣ 📂Context
 ┃ ┣ 📜AuthContext.jsx
 ┃ ┣ 📜ThemeContext.jsx
 ┃ ┗ 📜WorkspaceContext.jsx
 ┣ 📂hooks
 ┃ ┣ 📜useApiRequest.jsx
 ┃ ┗ 📜useForm.jsx
 ┣ 📂Screens
 ┃ ┣ 📜ChannelsScreen.jsx
 ┃ ┣ 📜LoginScreen.jsx
 ┃ ┣ 📜MessagesScreen.jsx
 ┃ ┣ 📜ProfileScreen.jsx
 ┃ ┣ 📜RegisterScreen.jsx
 ┃ ┣ 📜ResetPasswordScreen.jsx
 ┃ ┗ 📜WorkspacesScreen.jsx
 ┣ 📂styles
 ┃ ┣ 📜App.css
 ┃ ┣ 📜Auth.css
 ┃ ┣ 📜ChannelView.css
 ┃ ┣ 📜Header.css
 ┃ ┣ 📜InviteUser.css
 ┃ ┣ 📜MainLayout.css
 ┃ ┣ 📜MessageInput.css
 ┃ ┣ 📜MessageList.css
 ┃ ┣ 📜Profile.css
 ┃ ┣ 📜Sidebar.css
 ┃ ┣ 📜WorkspaceNav.css
 ┃ ┗ 📜Workspaces.css
 ┣ 📂utils
 ┃ ┣ 📂fetching
 ┃ ┃ ┗ 📜fetching.utils.js
 ┃ ┗ 📜error.utils.js
 ┣ 📜App.jsx
 ┗ 📜main.jsx