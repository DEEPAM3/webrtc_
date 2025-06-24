import React, { useState } from 'react';
import Room from './components/Video_room/VideoRoom';
import VoiceRoom from './components/Voice_room/VoiceRoom';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Dashboard/Login';
import Signup from './components/Dashboard/Signup';
import VideoOrVoice from './components/Video_or_Voice/Video_or_Voice';
import Home from './components/Dashboard/Home';
import ProtectedRoute from './components/Routes_Protector/ProtectedRoute';
import PublicRoute from './components/Routes_Protector/PublicRoute';
import Navbar from './components/Navbars/Navbar';
import Settings from './components/Navbars/Settings';
import NotFound from './components/z_others/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Router>
      <div className="app">
        <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
          <Route path='/signup' element={<PublicRoute><Signup/></PublicRoute>}/>
          <Route path='/video_or_voice' element={
              <ProtectedRoute>
                <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
                <VideoOrVoice/>
              </ProtectedRoute>
            }/>
          <Route path='/video-room' element={
            <ProtectedRoute>
              <SocketProvider>
                <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
                <Room/>
              </SocketProvider>
            </ProtectedRoute>
          }/>
          <Route path='/voice-room' element={
            <ProtectedRoute>
              <SocketProvider>
                <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
                <VoiceRoom/>
              </SocketProvider>
            </ProtectedRoute>
          }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
