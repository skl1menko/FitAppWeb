import './DashboardStat.scss'
import { FaArrowTrendUp, FaArrowTrendDown } from "../../../assets/icons";

const DashboardStat = ({ color, icon, trendLabel, trendDirection = "up", label, value, unit }) => {
    const TrendIcon = trendDirection === "down" ? FaArrowTrendDown : FaArrowTrendUp;

    return (
        <div className="stat-card-cont" style={{ backgroundColor: color }}>
            <div className="stat-card-content">
                <div className="top-stat-cont">
                    <div className="icon-cont">
                        {icon}
                    </div>
                    <div className="mini-stat-cont">
                        <TrendIcon color='#fff' size={16} />
                        <span>{trendLabel}</span>
                    </div>
                </div>
                <div className="mid-stat-cont">
                    <span>{label}</span>
                </div>
                <div className="bot-stat-cont">
                    <h1>{value == null ? '0' : value}</h1>
                    <span>{unit}</span>
                </div>
            </div>

        </div>
    )
}
export default DashboardStat;
