"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import { useForm } from "../hooks/useForm"
import { useAuth } from "../Context/AuthContext"
import "../styles/Workspaces.css"

/**
 * Pantalla de workspaces
 * @returns {JSX.Element} - Componente
 */
const WorkspacesScreen = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [workspaces, setWorkspaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    // Cargar workspaces
    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await get(ROUTES.WORKSPACES.BASE)
                setWorkspaces(response.data.workspaces || [])
            } catch (error) {
                console.error("Error al cargar workspaces:", error)
                setError("Error al cargar workspaces")
            } finally {
                setLoading(false)
            }
        }

        fetchWorkspaces()
    }, [])

    /**
     * Valida el formulario de creación de workspace
     * @param {Object} values - Valores del formulario
     * @returns {Object} - Errores de validación
     */
    const validateForm = (values) => {
        const errors = {}

        if (!values.name) {
            errors.name = "El nombre es obligatorio"
        } else if (values.name.length < 3) {
            errors.name = "El nombre debe tener al menos 3 caracteres"
        }

        return errors
    }

    /**
     * Maneja el envío del formulario de creación
     * @param {Object} values - Valores del formulario
     */
    const handleCreateSubmit = async (values) => {
        try {
            const response = await post(ROUTES.WORKSPACES.CREATE, { name: values.name })

            // Añadir el nuevo workspace a la lista
            setWorkspaces([...workspaces, response.data.new_workspace])

            // Ocultar el formulario
            setShowCreateForm(false)

            // Navegar al nuevo workspace
            navigate(`/workspaces/${response.data.new_workspace._id}`)
        } catch (error) {
            console.error("Error al crear workspace:", error)
            setError("Error al crear workspace")
        }
    }

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
        { name: "" },
        handleCreateSubmit,
        validateForm,
    )

    /**
     * Maneja el clic en un workspace
     * @param {string} id - ID del workspace
     */
    const handleWorkspaceClick = (id) => {
        navigate(`/workspaces/${id}`)
    }

    /**
     * Maneja la apertura del formulario de creación
     */
    const handleOpenCreateForm = () => {
        setShowCreateForm(true)
    }

    /**
     * Maneja el cierre del formulario de creación
     */
    const handleCloseCreateForm = () => {
        setShowCreateForm(false)
        resetForm()
    }

    if (loading) {
        return (
            <div className="workspaces-loading">
                <div className="loading-spinner"></div>
                <p>Cargando workspaces...</p>
            </div>
        )
    }

    return (
        <div className="workspaces-container">
            <div className="workspaces-header">
                <h1 className="workspaces-title">Tus espacios de trabajo</h1>

                <div className="workspaces-actions">
                    <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                        Crear workspace
                    </button>
                </div>
            </div>

            {error && <div className="workspaces-error">{error}</div>}

            {showCreateForm && (
                <div className="workspaces-create-form">
                    <h2>Crear nuevo workspace</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre del workspace</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {touched.name && errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="workspaces-form-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseCreateForm}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? "Creando..." : "Crear workspace"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {workspaces.length === 0 ? (
                <div className="workspace-empty">
                    <div className="workspace-empty-icon">🏢</div>
                    <h2 className="workspace-empty-title">No tienes workspaces</h2>
                    <p className="workspace-empty-text">Crea tu primer workspace para comenzar a colaborar con tu equipo.</p>
                    <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                        Crear workspace
                    </button>
                </div>
            ) : (
                <div className="workspaces-grid">
                    {workspaces.map((workspace) => (
                        <div key={workspace._id} className="workspace-card" onClick={() => handleWorkspaceClick(workspace._id)}>
                            <div className="workspace-card-header">
                                <h2 className="workspace-card-name">{workspace.name}</h2>
                                <p className="workspace-card-owner">{workspace.owner === user?._id ? "Propietario: Tú" : "Miembro"}</p>
                            </div>

                            <div className="workspace-card-content">
                                <div className="workspace-card-stats">
                                    <div className="workspace-card-stat">
                                        <div className="workspace-card-stat-value">{workspace.channels?.length || 0}</div>
                                        <div className="workspace-card-stat-label">Canales</div>
                                    </div>

                                    <div className="workspace-card-stat">
                                        <div className="workspace-card-stat-value">{workspace.members?.length || 0}</div>
                                        <div className="workspace-card-stat-label">Miembros</div>
                                    </div>
                                </div>
                            </div>

                            <div className="workspace-card-footer">
                                <button className="btn btn-secondary">Ver detalles</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkspacesScreen

