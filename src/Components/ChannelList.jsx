import React from "react";

const ChannelList = ({ channels, onSelectChannel }) => {
    return (
        <div className="channel-list">
            {channels.length === 0 ? (
                <p>No hay canales en este workspace. ¡Crea uno!</p>
            ) : (
                <ul>
                    {channels.map((channel) => (
                        <li 
                            key={channel._id} 
                            onClick={() => onSelectChannel(channel._id)}
                            className="channel-item"
                        >
                            <h3># {channel.name}</h3>
                            <p>Creado por: {channel.created_by.username}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ChannelList;