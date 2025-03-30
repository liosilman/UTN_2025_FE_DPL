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

    const url = `${ENVIROMENT.URL_API}${endpoint}`
    console.log(`Realizando petición a ${url}`, {
      method: options.method || "GET",
      body: options.body ? JSON.parse(options.body) : undefined,
    })

    // Añadir timeout para evitar que la petición se quede colgada indefinidamente
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId) // Limpiar el timeout si la petición se completa

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        // Si no es JSON, intentar obtener el texto para mejor diagnóstico
        const text = await response.text()
        console.error("Respuesta no JSON:", text)
        console.error("URL:", url)
        console.error("Método:", options.method)
        console.error(
          "Headers:",
          JSON.stringify({
            ...defaultHeaders,
            ...options.headers,
          }),
        )
        console.error("Body:", options.body)

        // Intentar determinar el problema
        if (text.includes("Cannot POST") || text.includes("Cannot PUT")) {
          throw new Error(`La ruta ${endpoint} no existe en el servidor o no acepta el método ${options.method}`)
        } else {
          throw new Error("La respuesta del servidor no es JSON válido: " + text.substring(0, 100))
        }
      }

      const data = await response.json()

      console.log(`Respuesta de ${endpoint}:`, data)

      if (!response.ok) {
        throw new Error(data.message || "Ha ocurrido un error")
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId) // Asegurarse de limpiar el timeout en caso de error

      if (error.name === "AbortError") {
        throw new Error(
          "La petición ha excedido el tiempo de espera. Verifica tu conexión a internet o inténtalo más tarde.",
        )
      }

      throw error
    }
  } catch (error) {
    console.error("Error en fetchApi:", error)

    // Mejorar los mensajes de error para el usuario
    if (error.message === "Failed to fetch") {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.",
      )
    }

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

