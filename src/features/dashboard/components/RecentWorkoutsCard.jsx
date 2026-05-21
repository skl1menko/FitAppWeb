import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import './RecentWorkouts.scss';
import {
    GoPulse,
    LuDumbbell,
    IoFootstepsOutline,
    RiFireLine,
    BsChevronRight,
} from '../../../assets/icons';
import { formatGroupedNumber } from '../../../utils/formatNumber';
import { isWorkoutCompleted } from '../../workout/utils/workoutStatus';
import useDashboardWorkouts from '../hooks/useDashboardWorkouts';
import { formatRelativeWorkoutDate, getWorkoutDurationMinutes } from '../utils/dashboardWorkoutUtils';

const ICON_STYLES = [
    { bg: '#d1fae5', color: '#10b981', Icon: GoPulse },
    { bg: '#dbeafe', color: '#60a5fa', Icon: LuDumbbell },
    { bg: '#ede9fe', color: '#a78bfa', Icon: IoFootstepsOutline },
    { bg: '#f3e8ff', color: '#c084fc', Icon: RiFireLine },
];

const RecentWorkoutsCard = () => {
    const navigate = useNavigate();
    const { workouts, isLoading, error } = useDashboardWorkouts();

    const completedWorkouts = useMemo(() => {
        return workouts.filter((workout) => isWorkoutCompleted(workout));
    }, [workouts]);

    return (
        <div className="recent-workout-cont">
            <div className="recent-workout-header">
                <h2>Recent Workouts</h2>
                <Link to="/workouts" className="rw-view-all">
                    View All <BsChevronRight />
                </Link>
            </div>

            <div className="recent-workout-list">
                {error && <span className="rw-stats">{error}</span>}
                {!error && isLoading && <span className="rw-stats">Loading workouts...</span>}
                {completedWorkouts.slice(0, 5).map((w, i) => {
                    const { bg, color, Icon } = ICON_STYLES[i % ICON_STYLES.length];
                    const duration = getWorkoutDurationMinutes(w);
                    const metric = w.programName || (w.totalTonnage ? `${formatGroupedNumber(w.totalTonnage)} kg` : null);
                    const subStats = [
                        duration ? `${duration} min` : null,
                        w.caloriesBurned != null ? `${Math.round(w.caloriesBurned)} kcal` : null,
                    ]
                        .filter(Boolean)
                        .join(' · ');

                    return (
                        <div className="rw-item" key={w.workoutId} onClick={() => navigate(`/workout/${w.workoutId}`)}>
                            <div className="rw-icon-badge" style={{ background: bg }}>
                                <Icon style={{ color }} />
                            </div>
                            <div className="rw-info">
                                <span className="rw-name">{w.workoutName || 'Workout'}</span>
                                <span className="rw-date">{formatRelativeWorkoutDate(w)}</span>
                            </div>
                            <div className="rw-meta">
                                {metric && <span className="rw-metric">{metric}</span>}
                                {subStats && <span className="rw-stats">{subStats}</span>}
                            </div>
                            <BsChevronRight className="rw-chevron" />
                        </div>
                    );
                })}
                {!error && !isLoading && completedWorkouts.length === 0 && (
                    <span className="rw-stats">No completed workouts yet.</span>
                )}
            </div>
        </div>
    );
};

export default RecentWorkoutsCard;
