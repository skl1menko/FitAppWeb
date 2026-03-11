import { useEffect, useState } from 'react';
import './RecentWorkouts.scss';
import workoutService from '../../../services/WorkoutServices/workoutService';
import {
    GoPulse,
    LuDumbbell,
    IoFootstepsOutline,
    RiFireLine,
    BsChevronRight,
} from '../../../assets/icons';

const ICON_STYLES = [
    { bg: '#d1fae5', color: '#10b981', Icon: GoPulse },
    { bg: '#dbeafe', color: '#60a5fa', Icon: LuDumbbell },
    { bg: '#ede9fe', color: '#a78bfa', Icon: IoFootstepsOutline },
    { bg: '#f3e8ff', color: '#c084fc', Icon: RiFireLine },
];

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (date.toDateString() === today.toDateString()) return `Today, ${timeStr}`;
    if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
};

const getDuration = (start, end) => {
    if (!start || !end) return null;
    const mins = Math.round((new Date(end) - new Date(start)) / 60000);
    return mins > 0 ? mins : null;
};

const RecentWorkoutsCard = () => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        workoutService.getAll().then(res => {
            setWorkouts(res.data.data);
        });
    }, []);

    return (
        <div className="recent-workout-cont">
            <div className="recent-workout-header">
                <h2>Recent Workouts</h2>
                <a href="/workouts" className="rw-view-all">
                    View All <BsChevronRight />
                </a>
            </div>

            <div className="recent-workout-list">
                {workouts.slice(0, 5).map((w, i) => {
                    const { bg, color, Icon } = ICON_STYLES[i % ICON_STYLES.length];
                    const duration = getDuration(w.startTime, w.endTime);
                    const metric = w.programName || (w.totalTonnage ? `${w.totalTonnage} kg` : null);
                    const subStats = [
                        duration ? `${duration} min` : null,
                        w.caloriesBurned != null ? `${Math.round(w.caloriesBurned)} kcal` : null,
                    ]
                        .filter(Boolean)
                        .join(' · ');

                    return (
                        <div className="rw-item" key={w.workoutId}>
                            <div className="rw-icon-badge" style={{ background: bg }}>
                                <Icon style={{ color }} />
                            </div>
                            <div className="rw-info">
                                <span className="rw-name">{w.workoutName || 'Workout'}</span>
                                <span className="rw-date">{formatDate(w.startTime)}</span>
                            </div>
                            <div className="rw-meta">
                                {metric && <span className="rw-metric">{metric}</span>}
                                {subStats && <span className="rw-stats">{subStats}</span>}
                            </div>
                            <BsChevronRight className="rw-chevron" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentWorkoutsCard;