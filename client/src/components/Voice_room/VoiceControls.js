import { useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const VoiceControls = ({ roomId, webrtcService, toggleChat, isChatOpen }) => {
  const [isMuted, setIsMuted] = useState(false);
  const socket = useSocket();

  const toggleAudio = () => {
    if (webrtcService.localStream) {
      const audioTrack = webrtcService.localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    } 
  };

  const leaveRoom = () => {
    webrtcService.closeAllConnections();
    socket.emit('leave-room', roomId);
    window.location.reload();
  };

  return (
    <div className="controls">
      <button onClick={toggleAudio}>
        {isMuted ? 'Unmute' : 'Mute'}
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

export default VoiceControls;