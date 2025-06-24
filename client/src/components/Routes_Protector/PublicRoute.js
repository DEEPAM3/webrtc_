import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PublicRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/video_or_voice" replace />;
    }

    return children;
};

export default PublicRoute;