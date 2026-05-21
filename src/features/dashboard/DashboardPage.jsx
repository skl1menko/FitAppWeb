import { useMemo, useState } from "react";
import "./DashboardPage.scss"
import DashboardStat from "./components/DashboardStat"
import DatePickerCustom from "../../components/DatePickerCustom";
import { IoFootstepsOutline, RiFireLine, FaRegClock, CiHeart } from "../../assets/icons";
import ActivityOverview from "./components/ActivityOverview/ActivityOverview";
import GoalCard from "./components/GoalCard/GoalCard";
import WorkoutCalendarCard from "./components/WorkoutCalendarCard/WorkoutCalendarCard";
import RecentWorkoutsCard from "./components/RecentWorkoutsCard";
import useBodyClass from "../../hooks/useBodyClass";
import useDashboardMetrics, { getTrendLabel } from "./hooks/useDashboardMetrics";

const DashboardPage = () => {
    useBodyClass("dashboard-body");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const { metrics, activeMinutes, isLoading, error } = useDashboardMetrics(selectedDate);
    const todayMetrics = metrics.today;
    const yesterdayMetrics = metrics.yesterday;

    const statCards = useMemo(() => ([
        {
            label: "Steps Today",
            value: todayMetrics?.totalStepCount ?? 0,
            unit: "steps",
            color: "#577BFF",
            icon: <IoFootstepsOutline color="#fff" size={24} />,
            trendLabel: getTrendLabel(todayMetrics?.totalStepCount, yesterdayMetrics?.totalStepCount),
            trendDirection: (todayMetrics?.totalStepCount ?? 0) < (yesterdayMetrics?.totalStepCount ?? 0) ? "down" : "up"
        },
        {
            label: "Calories Burned",
            value: todayMetrics?.totalEnergyBurned ?? 0,
            unit: "kcal",
            color: "#FF8700",
            icon: <RiFireLine color="#fff" size={24} />,
            trendLabel: getTrendLabel(todayMetrics?.totalEnergyBurned, yesterdayMetrics?.totalEnergyBurned),
            trendDirection: Number(todayMetrics?.totalEnergyBurned ?? 0) < Number(yesterdayMetrics?.totalEnergyBurned ?? 0) ? "down" : "up"
        },
        {
            label: "Active Minutes",
            value: activeMinutes.today,
            unit: "min",
            color: "#11BC94",
            icon: <FaRegClock color="#fff" size={24} />,
            trendLabel: getTrendLabel(activeMinutes.today, activeMinutes.yesterday),
            trendDirection: activeMinutes.today < activeMinutes.yesterday ? "down" : "up"
        },
        {
            label: "AVG Heart Rate",
            value: todayMetrics?.avgHeartRate ?? 0,
            unit: "bpm",
            color: "#fd5e61eb",
            icon: <CiHeart color="#fff" size={24} />,
            trendLabel: getTrendLabel(todayMetrics?.avgHeartRate, yesterdayMetrics?.avgHeartRate),
            trendDirection: (todayMetrics?.avgHeartRate ?? 0) < (yesterdayMetrics?.avgHeartRate ?? 0) ? "down" : "up"
        }
    ]), [activeMinutes.today, activeMinutes.yesterday, todayMetrics, yesterdayMetrics]);

    return (
        <div className="dashboard-main-cont">
            <div className="dashboard-main-content">
                <div className="dashboard-top-bar">
                    <DatePickerCustom value={selectedDate} onChange={setSelectedDate} />
                </div>
                {error && (
                    <div className="dashboard-feedback dashboard-feedback-error">
                        {error}
                    </div>
                )}
                {isLoading && (
                    <div className="dashboard-feedback">
                        Loading dashboard data...
                    </div>
                )}
                <div className="dashboard-stats-cont">
                    {statCards.map((card) => (
                        <DashboardStat
                            key={card.label}
                            color={card.color}
                            icon={card.icon}
                            trendLabel={card.trendLabel}
                            trendDirection={card.trendDirection}
                            label={card.label}
                            value={card.value}
                            unit={card.unit}
                        />
                    ))}
                </div>
                <div className="dashboard-overview-cont">
                    <div className="dashboard-activity">
                        <ActivityOverview />
                    </div>
                    <div className="dashboard-goal-card">
                        <GoalCard
                            steps={todayMetrics?.totalStepCount ?? 0}
                            calories={todayMetrics?.totalEnergyBurned ?? 0}
                            activeMin={activeMinutes.today}
                        />
                    </div>
                    <div className="dashboard-calendar-card">
                        <WorkoutCalendarCard />
                    </div>
                    <div className="dashboard-recent-workouts">
                        <RecentWorkoutsCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
