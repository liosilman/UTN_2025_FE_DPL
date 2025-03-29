"use client"

import { useParams } from "react-router-dom"
import MainLayout from "../Components/MainLayout"
import ChannelView from "../Components/ChannelView"

/**
 * Pantalla de mensajes
 * @returns {JSX.Element} - Componente
 */
const MessagesScreen = () => {
    const { workspaceId, channelId } = useParams()

    return (
        <MainLayout>
            <ChannelView />
        </MainLayout>
    )
}

export default MessagesScreen

