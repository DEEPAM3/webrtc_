import { useNavigate } from 'react-router-dom';
import TransparentNavbar from '../Navbars/TransparentNavbar';
import Symbol from '../z_others/Symbol';

const Home = () => {
    
    const navigate = useNavigate();

    return(
        <div className='home'>
            <TransparentNavbar/>
            <div className='home-logo'>
                <Symbol/>
            </div>
            <div className='home-content'>
                <h1>RTC WEB</h1>
                <p className='subtitle2'>Welcome,</p>
                <p className='subtitle1'>Your friends are waiting for you</p>
                <p className='subtitle1'>Let's Join</p>
                <button 
                    className='get-started-btn'
                    onClick={() => navigate('/Signup')}
                >
                    Get Started
                    <span className='arrow'>➔</span>
                </button>
            </div>
            <div className='home-overlay'></div>
        </div>
    );
};

export default Home;