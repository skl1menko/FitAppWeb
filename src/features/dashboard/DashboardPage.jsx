import { useEffect, useState } from "react"
import "./DashboardPage.scss"
import DashboardStat from "./components/DashboardStat"
import DatePickerCustom from "../../components/DatePickerCustom";
import { IoFootstepsOutline, RiFireLine, FaRegClock, CiHeart } from "../../assets/icons";
import healthMetricsService from "../../services/healthMetricsService";
import workoutService from "../../services/WorkoutServices/workoutService";
import ActivityOverview from "./components/ActivityOverview/ActivityOverview";
import GoalCard from "./components/GoalCard/GoalCard";
import WorkoutCalendarCard from "./components/WorkoutCalendarCard/WorkoutCalendarCard";
import RecentWorkoutsCard from "./components/RecentWorkoutsCard";
import useBodyClass from "../../hooks/useBodyClass";

const DashboardPage = () => {

    useBodyClass("dashboard-body");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [metrics, setMetrics] = useState({ today: null, yesterday: null });
    const [activeMinutes, setActiveMinutes] = useState({ today: 0, yesterday: 0 });

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const calcTrend = (today, yesterday) => {
        if (!today || !yesterday || yesterday === 0) return '+0%';
        const diff = ((today - yesterday) / yesterday) * 100;
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${diff.toFixed(0)}%`;
    };

    const getWorkoutDurationMinutes = (workout) => {
        const startValue = workout?.startTime || workout?.start_time;
        const endValue = workout?.endTime || workout?.end_time;

        if (!startValue || !endValue) {
            return 0;
        }

        const start = new Date(startValue).getTime();
        const end = new Date(endValue).getTime();

        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
            return 0;
        }

        return Math.round((end - start) / 60000);
    };

    const getTotalActiveMinutes = (workouts = []) => {
        return workouts.reduce((total, workout) => total + getWorkoutDurationMinutes(workout), 0);
    };

    const getWorkoutRangeParams = (date) => {
        const start = new Date(date);
        const end = new Date(date);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    };

    useEffect(() => {
        const today = new Date(selectedDate);
        const yesterday = new Date(selectedDate);
        yesterday.setDate(today.getDate() - 1);

        const todayMetricsDate = formatLocalDate(today);
        const yesterdayMetricsDate = formatLocalDate(yesterday);
        const todayWorkoutRange = getWorkoutRangeParams(today);
        const yesterdayWorkoutRange = getWorkoutRangeParams(yesterday);

        Promise.all([
            healthMetricsService.getByPeriod('daily', todayMetricsDate, todayMetricsDate),
            healthMetricsService.getByPeriod('daily', yesterdayMetricsDate, yesterdayMetricsDate),
            workoutService.getByPeriod(todayWorkoutRange.start, todayWorkoutRange.end),
            workoutService.getByPeriod(yesterdayWorkoutRange.start, yesterdayWorkoutRange.end)
        ]).then(([todayRes, yesterdayRes, todayWorkoutsRes, yesterdayWorkoutsRes]) => {
            const todayData = todayRes.data.data.detailedMetrics?.[0];
            const yesterdayData = yesterdayRes.data.data.detailedMetrics?.[0];
            
            setMetrics({ 
                today: todayData, 
                yesterday: yesterdayData 
            });
            setActiveMinutes({
                today: getTotalActiveMinutes(todayWorkoutsRes?.data?.data || []),
                yesterday: getTotalActiveMinutes(yesterdayWorkoutsRes?.data?.data || [])
            });
        }).catch((error) => {
            console.error('Ошибка при загрузке метрик:', error);
        });
    }, [selectedDate]);


    const t = metrics?.today;
    const y = metrics?.yesterday;

    return (
        <div className="dashboard-main-cont">
            <div className="dashboard-main-content">
                <div className="dashboard-top-bar">
                    <DatePickerCustom value={selectedDate} onChange={setSelectedDate} />
                </div>
                <div className="dashboard-stats-cont">
                    <DashboardStat color="#577BFF" icon={<IoFootstepsOutline color="#fff" size={24} />} trend={calcTrend(t?.totalStepCount, y?.totalStepCount)} label="Steps Today" num={t?.totalStepCount || 0} text="steps" />

                    <DashboardStat color="#FF8700" icon={<RiFireLine color="#fff" size={24} />} trend={calcTrend(t?.totalEnergyBurned, y?.totalEnergyBurned)} label="Calories Burned" num={t?.totalEnergyBurned || 0} text="kcal" />

                    <DashboardStat color="#11BC94" icon={<FaRegClock color="#fff" size={24} />} trend={calcTrend(activeMinutes.today, activeMinutes.yesterday)} label="Active Minutes" num={activeMinutes.today} text="min" />

                    <DashboardStat color="#fd5e61eb" icon={<CiHeart color="#fff" size={24} />} trend={calcTrend(t?.avgHeartRate, y?.avgHeartRate)} label="AVG Heart Rate" num={t?.avgHeartRate || 0} text="bpm" />
                </div>
                <div className="dashboard-overview-cont">
                    <div className="dashboard-charts-cont">
                        <ActivityOverview />
                        <RecentWorkoutsCard />
                    </div>
                    <div className="dashboard-goals-cont">
                        <GoalCard
                            steps={t?.totalStepCount || 0}
                            calories={t?.totalEnergyBurned || 0}
                            activeMin={activeMinutes.today}
                        />
                        <WorkoutCalendarCard
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;
