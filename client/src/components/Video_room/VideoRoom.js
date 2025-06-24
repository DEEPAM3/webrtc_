import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import VideoPlayer from './VideoPlayer';
import Controls from './Controls';
import Chat from '../z_others/Chat';
import WebRTCService from '../../services/webrtc';
import ScreenShare from './ScreenShare';


const Room = () => {
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [showRoomIdDialog, setShowRoomIdDialog] = useState(false);
  const socket = useSocket();
  const webrtcRef = useRef(null);
  const [streams, setStreams] = useState(new Map());


  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const toggleControls = () => {
    setIsControlsOpen(prev => !prev);
  };

  useEffect(() => {
    if (!socket) return;

    if (!webrtcRef.current) {
      webrtcRef.current = new WebRTCService(socket);
      webrtcRef.current.onTrack = (stream, userId) => {
        setStreams(prev => new Map(prev).set(userId, stream));
      };
    }

    socket.on('user-joined', async ({ userId, username }) => {
      console.log('User joined:', userId,username);
      if (webrtcRef.current) {
        await webrtcRef.current.initiateCall(userId);
      }
    });

    socket.on('user-left', (userId) => {
      console.log('User left:', userId);
      setStreams(prev => {
        const newStreams = new Map(prev);
        newStreams.delete(userId);
        return newStreams;
      });
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      if (webrtcRef.current) {
        webrtcRef.current.closeAllConnections();
      }
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    try {
      // Generate a random room ID
      const newRoomId = Math.random().toString(36).substring(7);
      setRoomId(newRoomId);
      setIsCreatingRoom(true);
      await handleJoinRoom();
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId || !socket) return;

    try {
      console.log('Joining room:', roomId);
      const localStream = await webrtcRef.current.getLocalStream({ audio: true, video: true });
      setStreams(new Map().set('local', localStream));
      
      socket.emit('join-room', roomId);
      setJoined(true);
      setShowRoomIdDialog(true);
      setTimeout(() => setShowRoomIdDialog(false), 4000);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please check your camera and microphone permissions.');
    }
  };

  return (
    <div>
      {!joined ? (
        <div className='room'>

          <div className="join-room">
            <div className='header1'>
              <h1>Peer-to-peer,</h1> 
              <h1>heart-to-heart</h1>
              <h1> powered by WebRTC</h1>
            </div>
            <div className="room-actions">
              <h4 className="header4">Video call</h4>
              <button 
                onClick={handleCreateRoom}
                disabled={!socket || isCreatingRoom}
                className="create-room-btn"
              >
                {isCreatingRoom ? 'Creating Room...' : 'Create New Room'}
              </button>
              <div className="room-divider">or</div>
              <div className="join-existing-room">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button 
                  onClick={handleJoinRoom} 
                  disabled={!roomId || !socket}
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='room2'>
          <div className="room-container">
            {showRoomIdDialog && (
              <div className="room-id-dialog">
                <p>Copy the roomId to connect</p>
              </div>
            )}
            <div className="main-content">
              <div className="video-section">
                <div className="video-grid">
                  {Array.from(streams).map(([userId, stream]) => (
                    <VideoPlayer
                      key={userId}
                      stream={stream}
                      muted={userId === 'local'}
                      isSingleUser={streams.size === 1}
                    />
                  ))}
                </div>
                <div className={`controls-drawer ${isControlsOpen ? 'open' : ''}`}>
                  <button className="toggle-controls-btn" onClick={toggleControls}>
                  <span className="arrow">⇅</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {isControlsOpen ? (
                        <path d="M18 15l-6-6-6 6"/>
                      ) : (
                        <path d="M6 9l6 6 6-6"/>
                      )}
                    </svg>
                  </button>
                  <div className="controls-container">
                    <Controls
                      roomId={roomId}
                      webrtcService={webrtcRef.current}
                      toggleChat={toggleChat}
                      isChatOpen={isChatOpen}
                    />
                    <div className='controls'>
                      <ScreenShare webrtcService={webrtcRef.current} />
                    </div>
                  </div>
                </div>
              </div>
              <Chat roomId={roomId} isChatOpen={isChatOpen} />
            </div>         
          </div>
        </div>
      )}
    </div>
  );
};


export default Room;