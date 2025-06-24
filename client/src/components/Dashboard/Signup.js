import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    username:'',
    email:'',
    password:''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_SOCKET_SERVER_URL}/api/auth/signup`, formData,{withCredentials: true});
      sessionStorage.setItem('token', response.data.token);
      navigate('/video_or_voice'); 
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <div className="auth-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              />
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-group email-input">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group password-input">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <div className="loading-spinner-small"></div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
      </div>
   
  );
};

export default Signup;