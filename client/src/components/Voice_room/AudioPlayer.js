import { useRef, useEffect } from 'react';
import './css/AudioPlayer.css';

const AudioPlayer = ({ stream, muted, isSingleUser, username}) => {

  const audioRef = useRef();



  useEffect(() => {
    
    if (audioRef.current && stream) {
      audioRef.current.srcObject = stream;
    }
  }, [stream]);
 
  return (
    <div className='center'>
      <div className={`audio-player ${isSingleUser ? 'single-user' : ''}`}>
        <h4>{username || 'Anonymous'}</h4>
        <audio
          ref={audioRef}
          autoPlay
          muted={muted}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;