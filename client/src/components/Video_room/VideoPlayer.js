import { useRef, useEffect } from 'react';

const VideoPlayer = ({ stream, muted, isSingleUser}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`video-player ${isSingleUser ? 'single-user' : ''}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
      />
    </div>
  );
};

export default VideoPlayer;