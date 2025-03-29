import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import WorkspaceNav from "./WorkspaceNav"
import "../styles/MainLayout.css"

/**
 * Componente de layout principal
 * @returns {JSX.Element} - Componente
 */
const MainLayout = () => {
  return (
    <div className="main-layout">
      <WorkspaceNav />
      <div className="main-content-wrapper">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout

