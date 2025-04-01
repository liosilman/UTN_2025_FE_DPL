import axios from "axios"
import { ENVIROMENT } from "../../config/enviroment.config.js"

// Configuración de axios con la URL base
const api = axios.create({
  baseURL: ENVIROMENT.URL_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para añadir el token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Función para depurar las solicitudes
const logRequest = (method, url, data = null) => {
  console.log(`[API ${method}] ${url}`, data ? { data } : "")
}

// Función para depurar las respuestas
const logResponse = (method, url, response) => {
  console.log(`[API ${method} Response] ${url}`, response)
}

// Función para depurar los errores
const logError = (method, url, error) => {
  console.error(`[API ${method} Error] ${url}`, error.response || error)
}

/**
 * Realiza una petición a la API con depuración mejorada
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

    // Mejorar el logging para depuración
    const requestBody = options.body ? JSON.parse(options.body) : undefined
    console.log(`[API REQUEST] ${options.method || "GET"} ${url}`, {
      headers: { ...defaultHeaders, ...options.headers },
      body: requestBody ? (requestBody.password ? { ...requestBody, password: "[REDACTED]" } : requestBody) : undefined,
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

      // Log de la respuesta para depuración
      console.log(`[API RESPONSE] ${options.method || "GET"} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      })

      if (!contentType || !contentType.includes("application/json")) {
        // Si no es JSON, intentar obtener el texto para mejor diagnóstico
        const text = await response.text()
        console.error("[API ERROR] Respuesta no JSON:", text)
        console.error("URL:", url)
        console.error("Método:", options.method)
        console.error(
          "Headers:",
          JSON.stringify({
            ...defaultHeaders,
            ...options.headers,
          }),
        )
        console.error("Body:", options.body ? JSON.parse(options.body) : undefined)

        // Intentar determinar el problema
        if (text.includes("Cannot POST") || text.includes("Cannot PUT")) {
          throw new Error(`La ruta ${endpoint} no existe en el servidor o no acepta el método ${options.method}`)
        } else {
          throw new Error("La respuesta del servidor no es JSON válido: " + text.substring(0, 100))
        }
      }

      const data = await response.json()

      console.log(`[API DATA] ${endpoint}:`, data)

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
    console.error("[API ERROR] Error en fetchApi:", error)

    // Mejorar los mensajes de error para el usuario
    if (error.message === "Failed to fetch") {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en funcionamiento.",
      )
    }

    throw error
  }
}

// El resto de las funciones (get, post, put, del) se mantienen igual
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "GET",
    ...options,
  })
}

export const post = (endpoint, body, options = {}) => {
  return fetchApi(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  })
}

export const put = (endpoint, body, options = {}) => {
  return fetchApi(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
    ...options,
  })
}

export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    method: "DELETE",
    ...options,
  })
}

