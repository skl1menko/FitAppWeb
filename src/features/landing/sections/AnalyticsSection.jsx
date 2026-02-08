import "./AnalyticsSection.scss"
import { IoStatsChart } from "react-icons/io5";
import { RiFireLine } from "react-icons/ri";
import { FiCalendar } from "react-icons/fi";
import AnalyticsSectionCards from "../components/AnalyticsSectionCards";

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
    return(
        <div className="stat-card-cont">
            <div className="stat-card first">
                <span>Weekly Workouts</span>
                <p>4</p>
            </div>
            <div className="stat-card second">
                <span>Total Time</span>
                <p>5h 20m</p>
            </div>
            <div className="stat-card third">
                <span>Personal Records</span>
                <p style={{ color: '#FACC15' }}>3 New!</p>
            </div>
        </div>
    )
}

const AnalyticsSection = () => {
    return(
        <div className="analytics-section-container">
            <div className="analytics-content-cont">
                <div className="analytics-heading-cont">
                    <h2>Data-Driven Progress</h2>
                    <p>Visualize your improvements with professional-grade analytics.</p>
                </div>
                <div className="analytics-cards-cont">
                    <AnalyticsSectionCards bgColor="rgba(59, 130, 246, 0.3)" icon={<IoStatsChart size={24} color="#60A5FA"/>} title="Training Volume" mainContent={<AnalyticsCard1 />} pText={<>Track total tonnage lifted over time to ensure<br/>progressive overload.</>}/>
                    <AnalyticsSectionCards bgColor="rgba(249, 115, 22, 0.2)" icon={<RiFireLine size={24} color="#FB923C"/>} title="Calories Burned" mainContent={<AnalyticsCard2/>} pText={<>Automatic calorie calculations based on workout<br/>intensity and duration.</>}/>
                    <AnalyticsSectionCards bgColor="rgba(168, 85, 247, 0.2)" icon={<FiCalendar size={24} color="#C084FC"/>} title="Aggregated Stats" mainContent={<AnalyticsCard3/>} pText={<>View your performance by day, week, or month to<br/>spot trends.</>}/>
                </div>
        </div>
    </div>
    )
}

export default AnalyticsSection;