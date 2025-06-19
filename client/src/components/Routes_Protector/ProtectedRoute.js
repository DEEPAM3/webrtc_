import { Navigate } from 'react-router-dom';
import { useEffect,useState } from 'react';

const ProtectedRoute = ({children}) => {
    const [isAuthenticated,setIsAuthenticated] = useState(null);
    
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);
    },[]);
 
    if(isAuthenticated === null){
        return <div>Loading...</div>;
    }

    if(!isAuthenticated){
        return <Navigate to="/" repalce/>;
    }

    return children;
};

export default ProtectedRoute;