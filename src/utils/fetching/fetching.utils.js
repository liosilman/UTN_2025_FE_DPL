import ENVIROMENT from "../../config/enviroment"

/**
 * Realiza una petición a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("token")

    const defaultHeaders = {
      "Content-Type": "application/json",
    }

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${ENVIROMENT.URL_API}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Ha ocurrido un error")
    }

    return data
  } catch (error) {
    console.error("Error en fetchApi:", error)
    throw error
  }
}

/**
 * Realiza una petición GET a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "GET",
    ...options,
  })
}

/**
 * Realiza una petición POST a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} body - Cuerpo de la petición
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const post = (endpoint, body, options = {}) => {
  return fetchApi(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * Realiza una petición PUT a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} body - Cuerpo de la petición
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const put = (endpoint, body, options = {}) => {
  return fetchApi(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * Realiza una petición DELETE a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "DELETE",
    ...options,
  })
}

