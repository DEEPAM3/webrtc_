import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
            transports: ['websocket'], // Changed to only websocket
            secure: true, // Explicitly set secure to true for WSS
            // rejectUnauthorized: false // Only for development, do not use in production
        });
          setSocket(socket);

        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        if (userId) {
            socket.emit('set-username', userId);
        }


        return () => socket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
