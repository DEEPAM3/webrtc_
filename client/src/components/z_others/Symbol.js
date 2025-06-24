import { useNavigate } from 'react-router-dom';

const Symbol = () =>
{
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return(
        <div 
            className='symbol'
            onClick={() => token && navigate(-1)}
            style={{ cursor: token? 'pointer':'default' }}
        >
            <div className='symbol-circle'>
                <div className='symbol-inner'>
                    <span className='symbol-text'>RTC</span>
                </div>
            </div>

        </div>
    );
};

export default Symbol;