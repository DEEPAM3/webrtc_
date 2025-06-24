import { useState } from 'react';

const ScreenShare = ({ webrtcService }) => {
    const [isSharing, setIsSharing] = useState(false);

    const handleScreenShare = async () => {
        try {
            if (!isSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });
                
                // Get the video track from screen capture
                const screenTrack = screenStream.getVideoTracks()[0];
                
                // Replace the video track in all peer connections
                await webrtcService.replaceVideoTrack(screenTrack);
                
                // Handle when user stops sharing
                screenTrack.onended = async () => {
                    const videoTrack = webrtcService.localStream.getVideoTracks()[0];
                    await webrtcService.replaceVideoTrack(videoTrack);
                    setIsSharing(false);
                };
                
                setIsSharing(true);
            } else {
                // Stop screen sharing
                const videoTrack = webrtcService.localStream.getVideoTracks()[0];
                await webrtcService.replaceVideoTrack(videoTrack);
                setIsSharing(false);
            }
        } catch (error) {
            console.error('Error sharing screen:', error);
            setIsSharing(false);
        }
    };

    return (
        <button 
            onClick={handleScreenShare}
            className={`screen-share-btn ${isSharing ? 'active' : ''}`}
        >
            {isSharing ? 'Stop Sharing' : 'Share Screen'}
        </button>
    );
};

export default ScreenShare;