"use client"

import { useState } from "react"

/**
 * Hook personalizado para manejar formularios
 * @param {Object} initialState - Estado inicial del formulario
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} validate - Función para validar el formulario
 * @returns {Object} - Objeto con los valores, errores, funciones para manejar cambios y envío
 */
export const useForm = (initialState = {}, onSubmit = () => { }, validate = () => ({})) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

  /**
   * Maneja el cambio de un campo del formulario
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  /**
   * Maneja el enfoque de un campo del formulario
   * @param {Event} e - Evento de enfoque
   */
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched({
      ...touched,
      [name]: true,
    })

    // Validar el campo al perder el foco
    const validationErrors = validate(values)
    setErrors(validationErrors)
  }

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate(values)
    setErrors(validationErrors)

    // Si no hay errores, enviar el formulario
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } catch (error) {
        console.error("Error al enviar el formulario:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = () => {
    setValues(initialState)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  }
}

