import { Link } from 'react-router-dom';
import '../../App.css';
import logo from '../../components/public_img/404.png';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <img src={logo} alt="Logo" width={750}/>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">Go to Home</Link>
    </div>
  );
};

export default NotFound;