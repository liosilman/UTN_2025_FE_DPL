import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import "../styles/MainLayout.css"

/**
 * Componente de layout principal
 * @returns {JSX.Element} - Componente
 */
const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout

