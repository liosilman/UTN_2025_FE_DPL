import React from "react";

const MessageList = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.length === 0 ? (
                <p>No hay mensajes en este canal. ¡Envía uno!</p>
            ) : (
                <ul>
                    {messages.map((message) => (
                        <li key={message._id} className="message-item">
                            <p><strong>{message.sender.username}</strong>: {message.text}</p>
                            <small>{new Date(message.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MessageList;