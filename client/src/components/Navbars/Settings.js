import { useState } from 'react';

const Settings = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const closeDialog = () => {
    setShowDialog(false);
    setMessage('');
  };
  const token = sessionStorage.getItem('token');

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_SOCKET_SERVER_URL}/api/auth/update-username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Username updated successfully!');
        setShowDialog(true);
        setUsername('');
      } else {
        setMessage(data.message || 'Failed to update username');
      setShowDialog(true);
      }
    } catch (error) {
      setMessage('Error updating username');
      setShowDialog(true);
      console.error('Error:', error);
    }
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match!');
      setShowDialog(true);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SOCKET_SERVER_URL}/api/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password updated successfully!');
        setShowDialog(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setMessage(data.message || 'Failed to update password');
      setShowDialog(true);
      }
    } catch (error) {
      setMessage('Error updating password');
      setShowDialog(true);
      console.error('Error:', error);
    }
  };


  return (
    <div className={`settings-drawer ${isOpen ? 'open' : ''}`}>
      <div className="settings-content">
        <h2>Settings

        <button className="close-btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="close-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </h2>
        
        <div className="settings-section">
          <h3>Change Username</h3>
          <form onSubmit={handleUsernameChange}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
              required
            />
            <button type="submit">Update</button>
          </form>
          {showDialog && (
            <div className="dialog-overlay">
              <div className="dialog-box">
                <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</p>
                <button onClick={closeDialog}>Close</button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;