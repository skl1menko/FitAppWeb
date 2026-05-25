import "./AnalyticsSection.scss"
import { IoStatsChart, RiFireLine, FiCalendar } from "../../../assets/icons";
import AnalyticsSectionCards from "../components/AnalyticsSectionCards";
import { useTranslation } from "react-i18next";

const AnalyticsCard1 = () => {
    const data = [40, 85, 60, 95, 70, 110, 90];
    return(
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            height: '150px',
            gap: '8px',
            width: '100%'
        }}>
            {data.map((value, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: `${(value/110) * 100}%`,
                    backgroundColor: '#2563EB',
                    borderRadius: '4px 4px 0 0'
                }}></div>
            ))}
        </div>
    )
}

const AnalyticsCard2 = () => {
    return(
        <div className="circular-progress">
            <div className="circular-progress-inner">
                <div className="progress-value">480</div>
                <div className="progress-label">kcal</div>
            </div>
        </div>
    )
}

const AnalyticsCard3 = () => {
    const { t } = useTranslation();
    return(
        <div className="stat-card-cont">
            <div className="stat-card first">
                <span>{t('landing.analytics.summary.weeklyWorkouts')}</span>
                <p>4</p>
            </div>
            <div className="stat-card second">
                <span>{t('landing.analytics.summary.totalTime')}</span>
                <p>5h 20m</p>
            </div>
            <div className="stat-card third">
                <span>{t('landing.analytics.summary.records')}</span>
                <p style={{ color: '#FACC15' }}>{t('landing.analytics.summary.new')}</p>
            </div>
        </div>
    )
}

const AnalyticsSection = () => {
    const { t } = useTranslation();
    return(
        <div className="analytics-section-container">
            <div className="analytics-content-cont">
                <div className="analytics-heading-cont">
                    <h2>{t('landing.analytics.title')}</h2>
                    <p>{t('landing.analytics.subtitle')}</p>
                </div>
                <div className="analytics-cards-cont">
                    <AnalyticsSectionCards bgColor="rgba(59, 130, 246, 0.3)" icon={<IoStatsChart size={24} color="#60A5FA"/>} title={t('landing.analytics.cards.volume.title')} mainContent={<AnalyticsCard1 />} pText={<>{t('landing.analytics.cards.volume.textLine1')}<br/>{t('landing.analytics.cards.volume.textLine2')}</>}/>
                    <AnalyticsSectionCards bgColor="rgba(249, 115, 22, 0.2)" icon={<RiFireLine size={24} color="#FB923C"/>} title={t('landing.analytics.cards.calories.title')} mainContent={<AnalyticsCard2/>} pText={<>{t('landing.analytics.cards.calories.textLine1')}<br/>{t('landing.analytics.cards.calories.textLine2')}</>}/>
                    <AnalyticsSectionCards bgColor="rgba(168, 85, 247, 0.2)" icon={<FiCalendar size={24} color="#C084FC"/>} title={t('landing.analytics.cards.stats.title')} mainContent={<AnalyticsCard3/>} pText={<>{t('landing.analytics.cards.stats.textLine1')}<br/>{t('landing.analytics.cards.stats.textLine2')}</>}/>
                </div>
        </div>
    </div>
    )
}

export default AnalyticsSection;
