import { useState, useRef, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

const Chat = ({ roomId, isChatOpen }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('chat-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('room-messages', (roomMessages) => {
            setMessages(roomMessages || []);
        });

        socket.emit('get-room-messages', roomId);

        return () => {
            socket.off('chat-message');
            socket.off('room-messages');
        };
    }, [socket, roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userId = localStorage.getItem('userId');
        const messageData = {
            roomId,
            text: newMessage,
            userId,
            timestamp: new Date().toISOString()
        };

        socket.emit('send-message', messageData);
        setMessages(prev => [...prev, { ...messageData, sender: 'me' }]);
        setNewMessage('');
    };

    return (
        <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
            <div className="messages-container">
                {messages && messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            <p className="message-sender">{message.sender === 'me' ? 'You' : message.sender}</p>
                            <p className='msg-sender-text'>{message.text}</p>
                            <span className="timestamp">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className='submit' type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;