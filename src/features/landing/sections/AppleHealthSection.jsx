import './AppleHealthSection.scss'
import { FaHeart, CiHeart } from "../../../assets/icons";
import { useTranslation } from 'react-i18next';

const AHList = ({ text }) => {
    return(
        <div className="ah-list-item">
            <div className="ah-list-icon"><CiHeart size={12} color='#DC2626'/></div>
            <p>{text}</p>
        </div>
    )
}

const ActivityRings = () => {
    const rings = [
        {radius: 195, progress: 100, color: 'rgba(115, 115, 115, 0.1)', bgColor: 'rgba(115, 115, 115, 0.1)', strokeWidth: 10},
        {radius: 140, progress: 75, color: '#FA114F', bgColor: '#2C0E15', strokeWidth: 30},
        {radius: 100, progress: 60, color: '#92E82A', bgColor: '#182808', strokeWidth: 30},
        {radius: 62, progress: 85, color: '#00D9F8', bgColor: '#001D23', strokeWidth: 30}
    ];

    return(
        <div className="activity-rings">
           <svg viewBox='0 0 510 510'>
                {rings.map((ring, index) => {
                    const circumference = 2 * Math.PI * ring.radius;
                    const strokeDasharray = `${(ring.progress / 100) * circumference} ${circumference}`;
                    return(
                        <g key={index}>
                            <circle
                                cx={255}
                                cy={255}
                                r={ring.radius}
                                fill="none"
                                stroke={ring.bgColor}
                                strokeWidth={ring.strokeWidth}
                            />
                            <circle
                                cx={255}
                                cy={255}
                                r={ring.radius}
                                fill="none"
                                stroke={ring.color}
                                strokeWidth={ring.strokeWidth}
                                strokeLinecap='round'
                                strokeDasharray={strokeDasharray}
                                transform="rotate(-90 255 255)"
                            />
                        </g>
                    )
                })}
           </svg>
        </div>
    )
        
}

const AppleHealthSection = () => {
    const { t } = useTranslation();
    return(
        <div className="ah-section-container">
            <div className="ah-content-cont">
                <div className="ah-left-cont">
                    <div className="ah-integ-cont">
                       <FaHeart size={16} color='#DC2626'/>
                       <span>{t('landing.appleHealth.badge')}</span> 
                    </div>
                    <div className="ah-heading-cont">
                        <h2>{t('landing.appleHealth.titleLine1')}<br/> {t('landing.appleHealth.titleLine2')}</h2>
                        <p>{t('landing.appleHealth.descriptionLine1')}
                            <br/> {t('landing.appleHealth.descriptionLine2')}
                        </p>
                    </div>
                    <div className="ah-list-cont">
                        <AHList text={t('landing.appleHealth.list.calories')}/>
                        <AHList text={t('landing.appleHealth.list.duration')}/>
                        <AHList text={t('landing.appleHealth.list.heartRate')}/>
                        <AHList text={t('landing.appleHealth.list.rings')}/>

                    </div>
                </div>
                <div className="ah-right-cont">
                    <ActivityRings/>
                </div>
            </div>
        </div>
    )
}

export default AppleHealthSection;
