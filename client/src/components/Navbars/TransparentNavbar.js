import { useNavigate } from 'react-router-dom';
import Symbol from '../z_others/Symbol.js';

const TransparentNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="transparent-navbar">
      <div className="nav-brand">
        <Symbol />
        RTC WEB
      </div>
      <div className="nav-links">
        <button 
          onClick={() => navigate('/login')} 
          className="nav-btn login-btn"
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/signup')} 
          className="nav-btn signup-btn"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default TransparentNavbar;