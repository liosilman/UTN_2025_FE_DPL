import { useState } from "react";
import ServerError from "../utils/error.utils";

export const useApiRequest = (baseUrl) => {
    const initialResponseApiState = {
        loading: false,
        error: null,
        data: null,
    };
    const [responseApiState, setResponseApiState] = useState(initialResponseApiState);

    // Función para construir la URL completa
    const getFullUrl = (endpoint) => {
        return baseUrl + endpoint;
    };

    // Obtener el token de authorization desde sessionStorage
    const getAuthHeaders = () => {
        const token = sessionStorage.getItem("authorization_token");
        console.log("Token obtenido de sessionStorage:", token); // Debug
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Solicitud POST
    const postRequest = async (endpoint, body) => {
        try {
            setResponseApiState({ ...initialResponseApiState, loading: true });

            const url = getFullUrl(endpoint);
            const headers = {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            };

            console.log("POST Request URL:", url); // Debug
            console.log("POST Request Headers:", headers); // Debug

            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("POST Response Data:", data); // Debug
                setResponseApiState({ loading: false, error: null, data: data });
            } else {
                throw new ServerError(data.message, response.status);
            }
        } catch (error) {
            console.error("POST Request Error:", error); // Debug
            setResponseApiState({
                loading: false,
                error: error.message || "No se pudo enviar la información al servidor",
                data: null,
            });
        }
    };

    // Solicitud PUT
    const putRequest = async (endpoint, body) => {
        try {
            setResponseApiState({ ...initialResponseApiState, loading: true });

            const url = getFullUrl(endpoint);
            const headers = {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            };

            console.log("PUT Request URL:", url); // Debug
            console.log("PUT Request Headers:", headers); // Debug

            const response = await fetch(url, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("PUT Response Data:", data); // Debug
                setResponseApiState({ loading: false, error: null, data: data });
            } else {
                throw new ServerError(data.message, response.status);
            }
        } catch (error) {
            console.error("PUT Request Error:", error); // Debug
            setResponseApiState({
                loading: false,
                error: error.message || "No se pudo enviar la información al servidor",
                data: null,
            });
        }
    };

    // Solicitud GET
    const getRequest = async (endpoint) => {
        try {
            setResponseApiState({ ...initialResponseApiState, loading: true });

            const url = getFullUrl(endpoint);
            const headers = {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
            };

            console.log("GET Request URL:", url); // Debug
            console.log("GET Request Headers:", headers); // Debug

            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            const data = await response.json();

            if (response.ok) {
                console.log("GET Response Data:", data); // Debug
                setResponseApiState({ loading: false, error: null, data: data });
            } else {
                throw new ServerError(data.message, response.status);
            }
        } catch (error) {
            console.error("GET Request Error:", error); // Debug
            setResponseApiState({
                loading: false,
                error: error.message || "No se pudo obtener la información del servidor",
                data: null,
            });
        }
    };

    return { responseApiState, postRequest, putRequest, getRequest };
};