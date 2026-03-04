import './DashboardStat.scss'
import { FaArrowTrendUp, FaArrowTrendDown } from "../../../assets/icons";

const DashboardStat = ({ color, icon, trend, label, num, text }) => {

    return (
        <div className="stat-card-cont" style={{ backgroundColor: color }}>
            <div className="stat-card-content">
                <div className="top-stat-cont">
                    <div className="icon-cont">
                        {icon}
                    </div>
                    <div className="mini-stat-cont">
                        {trend.startsWith('+') ? <FaArrowTrendUp color='#fff' size={16} /> : <FaArrowTrendDown color='#fff' size={16} />}
                        <span>{trend}</span>
                    </div>
                </div>
                <div className="mid-stat-cont">
                    <span>{label}</span>
                </div>
                <div className="bot-stat-cont">
                    <h1>{num===null?'0': num}</h1>
                    <span>{text}</span>
                </div>
            </div>

        </div>
    )
}
export default DashboardStat;