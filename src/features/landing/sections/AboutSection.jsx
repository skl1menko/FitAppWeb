import './AboutSection.scss'
import { IoArrowForwardOutline, RiFireLine, GoPulse, IoFootstepsOutline, FaArrowTrendUp } from "../../../assets/icons";
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import AppleWatch from '../../../assets/AppleWatch.jpeg'
const AboutSection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return(
        <div className="about-section">
            <div className="left-container">
                <div className="apple-span-block">
                    <span className="circle"></span>
                    <span>{t('landing.about.integrationBadge')}</span>
                </div>
                <h1>{t('landing.about.titleLine1')}<br/><span className="highlight">{t('landing.about.titleHighlight')}</span></h1>
                <p>{t('landing.about.descriptionLine1')}<br/>
                {t('landing.about.descriptionLine2')}<br/>
                {t('landing.about.descriptionLine3')}</p>
                <div className="button-get-started-block">
                    <button className='get-started-button' onClick={() => navigate('/auth/signup')}>{t('landing.about.cta')} <IoArrowForwardOutline /></button>
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
                            <p>{t('landing.about.stats.move')}</p>
                            <div> <span className='number'>487</span> <span className='minnumber'>kcal</span></div>
                        </div>
                    </div>
                    <div className="stat-card step">
                        <div className="stat-card-icon step">
                            <IoFootstepsOutline size={24} color="#33C1FF" />
                        </div>
                        <div className="stat-card-info step">
                            <p>{t('landing.about.stats.steps')}</p>
                            <div><span className='number'>8,432</span></div>
                        </div>
                    </div>
                    <div className="stat-card exercise">
                        <div className="stat-card-icon exercise">
                            <GoPulse size={24} color="#22C55E" />
                        </div>
                        <div className="stat-card-info exercise">
                            <p>{t('landing.about.stats.exercise')}</p>
                            <div><span className="number">42</span><span className='minnumber'>{t('landing.about.stats.minutes')}</span></div>
                        </div>
                    </div>
                    <div className="stat-card progress">
                        <div className="stat-card-icon progress">
                            <FaArrowTrendUp size={24} color="#60A5FA" />
                        </div>
                        <div className="stat-card-info progress">
                            <p>{t('landing.about.stats.progress')}</p>
                            <span className="number progress">+15%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutSection;
