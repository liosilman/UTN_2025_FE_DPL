

import { useState, useCallback } from "react"
import { formatError } from "../utils/error.utils"

/**
 * Hook personalizado para realizar peticiones a la API
 * @param {Function} requestFn - Función que realiza la petición
 * @returns {Array} - Array con la función para realizar la petición, loading, error y data
 */
export const useApiRequest = (requestFn) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  /**
   * Realiza la petición a la API
   * @param {...any} args - Argumentos para la función de petición
   * @returns {Promise<any>} - Respuesta de la API
   */
  const request = useCallback(
    async (...args) => {
      setLoading(true)
      setError(null)

      try {
        const response = await requestFn(...args)
        setData(response)
        return response
      } catch (err) {
        const formattedError = formatError(err)
        setError(formattedError)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [requestFn],
  )

  return [request, { loading, error, data }]
}

