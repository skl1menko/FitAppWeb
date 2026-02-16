import './AboutSection.scss'
import { IoArrowForwardOutline } from "react-icons/io5";
import { RiFireLine } from "react-icons/ri";
import { GoPulse } from "react-icons/go";
import { IoFootstepsOutline } from "react-icons/io5";
import { IoIosTrendingUp } from "react-icons/io";
import { useNavigate } from 'react-router';

import AppleWatch from '../../../assets/AppleWatch.jpeg'
const AboutSection = () => {
    const navigate = useNavigate();

    return(
        <div className="about-section">
            <div className="left-container">
                <div className="apple-span-block">
                    <span className="circle"></span>
                    <span>Now with Apple Health Integration</span>
                </div>
                <h1>Track Every Rep<br/><span className="highlight">Master Your Fitness</span></h1>
                <p>The ultimate workout tracker for serious lifters. Monitor exercises,<br/>
                sets, weights, and duration with precision analytics to optimize your<br/>
                training volume.</p>
                <div className="button-get-started-block">
                    <button className='get-started-button' onClick={() => navigate('/auth/signup')}>Start Tracking Free <IoArrowForwardOutline /></button>
                </div>
            </div>
            <div className="right-container">
                <div className="img-block">
                    <img src={AppleWatch} alt="Apple Watch" />
                    <div className="stat-card kcal">
                        <div className="stat-card-icon">
                            <RiFireLine size={24} color="#FF5733" />
                        </div>  
                        <div className="stat-card-info">
                            <p>MOVE</p>
                            <div> <span className='number'>487</span> <span className='minnumber'>kcal</span></div>
                        </div>
                    </div>
                    <div className="stat-card step">
                        <div className="stat-card-icon step">
                            <IoFootstepsOutline size={24} color="#33C1FF" />
                        </div>
                        <div className="stat-card-info step">
                            <p>STEPS</p>
                            <div><span className='number'>8,432</span></div>
                        </div>
                    </div>
                    <div className="stat-card exercise">
                        <div className="stat-card-icon exercise">
                            <GoPulse size={24} color="#22C55E" />
                        </div>
                        <div className="stat-card-info exercise">
                            <p>EXERCISE</p>
                            <div><span className="number">42</span><span className='minnumber'>min</span></div>
                        </div>
                    </div>
                    <div className="stat-card progress">
                        <div className="stat-card-icon progress">
                            <IoIosTrendingUp size={24} color="#60A5FA" />
                        </div>
                        <div className="stat-card-info progress">
                            <p>PROGRESS</p>
                            <span className="number progress">+15%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutSection;