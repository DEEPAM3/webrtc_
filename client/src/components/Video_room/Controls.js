import { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const Controls = ({ roomId, webrtcService, toggleChat, isChatOpen }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  const toggleAudio = () => {
    if (webrtcService.localStream) {
      const audioTrack = webrtcService.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (webrtcService.localStream) {
      const videoTrack = webrtcService.localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const leaveRoom = () => {
    webrtcService.closeAllConnections();
    socket.emit('leave-room', roomId);
    navigate('/video_or_voice');
  };

  return (
    <div className="controls">
      <button onClick={toggleAudio}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <button onClick={toggleVideo}>
        {isVideoOff ? 'Start Video' : 'Stop Video'}
      </button>
      <button onClick={toggleChat}>
        {isChatOpen ? 'Hide Chat' : 'Show Chat'}
      </button>
      <button onClick={leaveRoom}>Leave Room</button>
      <div className="room-id">Room: {roomId}</div>
        <button onClick={() => navigator.clipboard.writeText(roomId)}>
          Copy Room ID
        </button>
    </div>
  );
};

export default Controls;
