"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { get, post } from "../utils/fetching/fetching.utils"
import { ROUTES } from "../config/enviroment"
import { useForm } from "../hooks/useForm"
import { useAuth } from "../Context/AuthContext"
import InviteUserForm from "../Components/InviteUserForm"
import "../styles/Workspaces.css"

/**
 * Pantalla de workspaces
 * @returns {JSX.Element} - Componente
 */
const WorkspacesScreen = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [workspaceDetails, setWorkspaceDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null)

  // Cargar workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await get(ROUTES.WORKSPACES.BASE)
        const workspacesData = response.data.workspaces || []
        setWorkspaces(workspacesData)

        // Cargar detalles de cada workspace para obtener el conteo de canales
        const detailsPromises = workspacesData.map(async (workspace) => {
          try {
            // Obtener canales del workspace
            const channelsResponse = await get(ROUTES.WORKSPACES.CHANNELS(workspace._id))
            return {
              id: workspace._id,
              channels: channelsResponse.data || [],
              members: workspace.members || [],
            }
          } catch (error) {
            console.error(`Error al cargar canales del workspace ${workspace._id}:`, error)
            return { id: workspace._id, channels: [], members: workspace.members || [] }
          }
        })

        const details = await Promise.all(detailsPromises)
        const detailsMap = {}
        details.forEach((item) => {
          detailsMap[item.id] = {
            channels: item.channels,
            members: item.members,
          }
        })

        setWorkspaceDetails(detailsMap)
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
    setShowInviteForm(false)
  }

  /**
   * Maneja el cierre del formulario de creación
   */
  const handleCloseCreateForm = () => {
    setShowCreateForm(false)
    resetForm()
  }

  /**
   * Maneja la apertura del formulario de invitación
   * @param {string} workspaceId - ID del workspace
   * @param {Event} e - Evento de clic
   */
  const handleOpenInviteForm = (workspaceId, e) => {
    e.stopPropagation() // Evitar que se propague al contenedor del workspace
    setSelectedWorkspaceId(workspaceId)
    setShowInviteForm(true)
    setShowCreateForm(false)
  }

  /**
   * Maneja el cierre del formulario de invitación
   */
  const handleCloseInviteForm = () => {
    setShowInviteForm(false)
    setSelectedWorkspaceId(null)
  }

  /**
   * Maneja el éxito de la invitación
   */
  const handleInviteSuccess = () => {
    // Recargar los datos del workspace para actualizar la lista de miembros
    const fetchWorkspaces = async () => {
      try {
        const response = await get(ROUTES.WORKSPACES.BASE)
        const workspacesData = response.data.workspaces || []
        setWorkspaces(workspacesData)

        // Actualizar detalles
        const detailsPromises = workspacesData.map(async (workspace) => {
          try {
            const channelsResponse = await get(ROUTES.WORKSPACES.CHANNELS(workspace._id))
            return {
              id: workspace._id,
              channels: channelsResponse.data || [],
              members: workspace.members || [],
            }
          } catch (error) {
            return { id: workspace._id, channels: [], members: workspace.members || [] }
          }
        })

        const details = await Promise.all(detailsPromises)
        const detailsMap = {}
        details.forEach((item) => {
          detailsMap[item.id] = {
            channels: item.channels,
            members: item.members,
          }
        })

        setWorkspaceDetails(detailsMap)

        // Cerrar el formulario de invitación después de una invitación exitosa
        setShowInviteForm(false)
        setSelectedWorkspaceId(null)
      } catch (error) {
        console.error("Error al recargar workspaces:", error)
      }
    }

    fetchWorkspaces()
  }

  /**
   * Obtiene el número de canales de un workspace
   * @param {string} workspaceId - ID del workspace
   * @returns {number} - Número de canales
   */
  const getChannelCount = (workspaceId) => {
    const details = workspaceDetails[workspaceId]
    return details && details.channels ? details.channels.length : 0
  }

  /**
   * Obtiene el número de miembros de un workspace
   * @param {string} workspaceId - ID del workspace
   * @returns {number} - Número de miembros
   */
  const getMemberCount = (workspaceId) => {
    const details = workspaceDetails[workspaceId]
    return details && details.members ? details.members.length : 0
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

      {showInviteForm && selectedWorkspaceId && (
        <InviteUserForm
          workspaceId={selectedWorkspaceId}
          onInviteSuccess={handleInviteSuccess}
          onCancel={handleCloseInviteForm}
        />
      )}

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
                    <div className="workspace-card-stat-value">{getChannelCount(workspace._id)}</div>
                    <div className="workspace-card-stat-label">Canales</div>
                  </div>

                  <div className="workspace-card-stat">
                    <div className="workspace-card-stat-value">{getMemberCount(workspace._id)}</div>
                    <div className="workspace-card-stat-label">Miembros</div>
                  </div>
                </div>
              </div>

              <div className="workspace-card-footer">
                <button className="btn btn-secondary" onClick={(e) => handleOpenInviteForm(workspace._id, e)}>
                  Invitar usuario
                </button>
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

