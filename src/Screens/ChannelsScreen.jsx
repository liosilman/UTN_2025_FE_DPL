"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import { useForm } from "../hooks/useForm"
import MainLayout from "../Components/MainLayout"
import "../styles/Workspaces.css"

/**
 * Pantalla de canales
 * @returns {JSX.Element} - Componente
 */
const ChannelsScreen = () => {
    const { workspaceId } = useParams()
    const navigate = useNavigate()
    const [workspace, setWorkspace] = useState(null)
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showCreateForm, setShowCreateForm] = useState(false)

    // Cargar workspace y canales
    useEffect(() => {
        const fetchData = async () => {
            if (!workspaceId) {
                setLoading(false)
                return
            }

            try {
                // Obtener información del workspace
                const workspaceResponse = await get(ROUTES.WORKSPACES.GET_BY_ID(workspaceId))
                setWorkspace(workspaceResponse.data)

                // Obtener canales del workspace
                const channelsResponse = await get(ROUTES.WORKSPACES.CHANNELS(workspaceId))
                setChannels(channelsResponse.data || [])
            } catch (error) {
                console.error("Error al cargar datos:", error)
                setError("Error al cargar datos")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [workspaceId])

    /**
     * Valida el formulario de creación de canal
     * @param {Object} values - Valores del formulario
     * @returns {Object} - Errores de validación
     */
    const validateForm = (values) => {
        const errors = {}

        if (!values.name) {
            errors.name = "El nombre es obligatorio"
        } else if (values.name.length < 2) {
            errors.name = "El nombre debe tener al menos 2 caracteres"
        }

        return errors
    }

    /**
     * Maneja el envío del formulario de creación
     * @param {Object} values - Valores del formulario
     */
    const handleCreateSubmit = async (values) => {
        try {
            const response = await post(ROUTES.WORKSPACES.CHANNELS(workspaceId), {
                name: values.name,
            })

            // Añadir el nuevo canal a la lista
            setChannels([...channels, response.data])

            // Ocultar el formulario
            setShowCreateForm(false)

            // Navegar al nuevo canal
            navigate(`/workspaces/${workspaceId}/channels/${response.data._id}`)
        } catch (error) {
            console.error("Error al crear canal:", error)
            setError("Error al crear canal")
        }
    }

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useForm(
        { name: "" },
        handleCreateSubmit,
        validateForm,
    )

    /**
     * Maneja el clic en un canal
     * @param {string} id - ID del canal
     */
    const handleChannelClick = (id) => {
        navigate(`/workspaces/${workspaceId}/channels/${id}`)
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
            <MainLayout>
                <div className="channels-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando canales...</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="workspaces-container">
                <div className="workspaces-header">
                    <h1 className="workspaces-title">Canales en {workspace?.name || "Workspace"}</h1>

                    <div className="workspaces-actions">
                        <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                            Crear canal
                        </button>
                    </div>
                </div>

                {error && <div className="workspaces-error">{error}</div>}

                {showCreateForm && (
                    <div className="workspaces-create-form">
                        <h2>Crear nuevo canal</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre del canal</label>
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
                                    {isSubmitting ? "Creando..." : "Crear canal"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {channels.length === 0 ? (
                    <div className="workspace-empty">
                        <div className="workspace-empty-icon">#</div>
                        <h2 className="workspace-empty-title">No hay canales</h2>
                        <p className="workspace-empty-text">Crea tu primer canal para comenzar a colaborar con tu equipo.</p>
                        <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                            Crear canal
                        </button>
                    </div>
                ) : (
                    <div className="workspaces-grid">
                        {channels.map((channel) => (
                            <div key={channel._id} className="workspace-card" onClick={() => handleChannelClick(channel._id)}>
                                <div className="workspace-card-header">
                                    <h2 className="workspace-card-name">#{channel.name}</h2>
                                    <p className="workspace-card-owner">Creado por: {channel.created_by?.username || "Usuario"}</p>
                                </div>

                                <div className="workspace-card-content">
                                    <p>{channel.description || "Sin descripción"}</p>
                                </div>

                                <div className="workspace-card-footer">
                                    <button className="btn btn-secondary">Ver canal</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    )
}

export default ChannelsScreen

