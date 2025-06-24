import { useNavigate } from  'react-router-dom';
import './css/Video_or_Voice.css';

const Video_or_Voice = () => {
    const navigate = useNavigate();

    return(
        <div className='video-or-voice-container'>
            <div className='video-bg'>
                <h1 className='title'>Video Call</h1>
                <p className='subtitle'>🗹 Web-Cam</p>
                <p className='subtitle'>🗹 Voice-Chatting</p>
                <p className='subtitle'>🗹 Screen-Sharing</p>
                <p className='subtitle'>🗹 Text-Chatting</p>
                <button className='video-btn' onClick={() => {navigate('/video-room')}}> Video Call </button>
            </div>
            <div className='voice-bg'>
                <h1 className='title'>Voice Call</h1>
                <p className='subtitle'>🗹 Voice-Chatting</p>
                <p className='subtitle'>🗹 Text-Chatting</p>
                <button className='voice-btn' onClick={() => {navigate('/voice-room')}}> Voice Call </button>
            </div>
        </div>
    )
}

export default Video_or_Voice;