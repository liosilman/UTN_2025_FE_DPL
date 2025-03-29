/**
 * Clase para manejar errores personalizados
 */
export class AppError extends Error {
    constructor(message, status) {
      super(message)
      this.status = status
      this.name = "AppError"
    }
  }
  
  /**
   * Formatea un error para mostrarlo al usuario
   * @param {Error} error - Error a formatear
   * @returns {string} - Mensaje de error formateado
   */
  export const formatError = (error) => {
    if (error instanceof AppError) {
      return error.message
    }
  
    if (error.message) {
      return error.message
    }
  
    return "Ha ocurrido un error inesperado"
  }
  
  /**
   * Maneja un error de forma genérica
   * @param {Error} error - Error a manejar
   * @param {Function} setError - Función para establecer el error
   */
  export const handleError = (error, setError) => {
    console.error("Error:", error)
    setError(formatError(error))
  }
  
  