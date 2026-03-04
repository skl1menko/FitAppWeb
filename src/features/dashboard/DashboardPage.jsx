import { useEffect, useState } from "react"
import "./DashboardPage.scss"
import DashboardStat from "./components/DashboardStat"
import { IoFootstepsOutline, RiFireLine, FaRegClock, CiHeart } from "../../assets/icons";
import healthMetricsService from "../../services/healthMetricsService";

const DashboardPage = () => {

    const [metrics, setMetrics] = useState({ today: null, yesterday: null });

    const calcTrend = (today, yesterday) => {
        if (!yesterday || yesterday === 0) return '0%';
        const diff = ((today - yesterday) / yesterday) * 100;
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${diff.toFixed(0)}%`;
    };

    useEffect(() => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const fmt = (d) => d.toISOString().split('T')[0];

        Promise.all([
            healthMetricsService.getByPeriod('daily', fmt(today), fmt(today)),
            healthMetricsService.getByPeriod('daily', fmt(yesterday), fmt(yesterday)),
        ]).then(([todayRes, yesterdayRes]) => {
            const todayData = todayRes.data.data.detailedMetrics?.[0];
            const yesterdayData = yesterdayRes.data.data.detailedMetrics?.[0];
            setMetrics({ today: todayData, yesterday: yesterdayData });
        }).catch(console.error);
    }, [])


    const t = metrics?.today;
    const y = metrics?.yesterday;

    return (
        <div className="dashboard-main-cont">
            <div className="dashboard-main-content">
                {t && (
                    <div className="dashboard-stats-cont">
                        <DashboardStat color="#577BFF" icon={<IoFootstepsOutline color="#fff" size={24} />} trend={calcTrend(t.totalStepCount, y?.totalStepCount)} label="Steps Today" num={t.totalStepCount} text="steps" />

                        <DashboardStat color="#FF8700" icon={<RiFireLine color="#fff" size={24} />} trend={calcTrend(t.totalEnergyBurned, y?.totalEnergyBurned)} label="Calories Burned" num={t.totalEnergyBurned} text="kcal" />

                        <DashboardStat color="#11BC94" icon={<FaRegClock color="#fff" size={24} />} trend="0%" label="Active Minutes" num={12} text="min" />

                        <DashboardStat color="#fd5e61eb" icon={<CiHeart color="#fff" size={24} />} trend={calcTrend(t.avgHeartRate, y?.avgHeartRate)} label="AVG Heart Rate" num={t.avgHeartRate} text="bpm" />
                    </div>
                )}
                
            </div>

        </div>
    )
}

export default DashboardPage;