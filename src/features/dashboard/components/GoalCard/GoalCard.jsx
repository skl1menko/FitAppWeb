import './GoalCard.scss';
import GoalRing from './GoalRing';
import { RiFireLine, IoFootstepsOutline, FaRegClock } from '../../../../assets/icons';

const getPercent = (value, goal) => {
    if (!goal || goal <= 0) {
        return 0;
    }

    return Math.min(Math.round((value / goal) * 100), 100);
};

const GoalProgressBar = ({ label, value, goal, unit, color }) => {
    const pct = getPercent(value, goal);
    const fmtVal = typeof value === 'number' ? value.toLocaleString() : value;
    const fmtGoal = typeof goal === 'number' ? goal.toLocaleString() : goal;
    return (
        <div className="goal-progress-item">
            <div className="goal-progress-header">
                <span className="goal-progress-label">{label}</span>
                <span className="goal-progress-values">{fmtVal} / {fmtGoal}{unit}</span>
            </div>
            <div className="goal-progress-track">
                <div className="goal-progress-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
        </div>
    );
};

const GoalCard = ({ steps = 0, stepsGoal = 10000, calories = 0, caloriesGoal = 500, activeMin = 0, activeMinGoal = 60 }) => {
    return (
        <div className="goal-card-cont">
            <div className="goal-header">
                <h2>Today&#39;s Goals</h2>
            </div>
            <div className="goal-list">
                <GoalRing
                    icon={<IoFootstepsOutline size={16} />}
                    label="Steps"
                    percent={getPercent(steps, stepsGoal)}
                    color="#3B82F6"
                    size={80}
                />
                <GoalRing
                    icon={<RiFireLine size={16} />}
                    label="Calories"
                    percent={getPercent(calories, caloriesGoal)}
                    color="#FF8700"
                    size={80}
                />
                <GoalRing
                    icon={<FaRegClock size={14} />}
                    label="Active Min"
                    percent={getPercent(activeMin, activeMinGoal)}
                    color="#2ECC71"
                    size={80}
                />
            </div>
            <div className="goal-bars">
                <GoalProgressBar label="Steps" value={steps} goal={stepsGoal} unit="" color="#3B82F6" />
                <GoalProgressBar label="Calories" value={calories} goal={caloriesGoal} unit=" kcal" color="#FF8700" />
                <GoalProgressBar label="Active Min" value={activeMin} goal={activeMinGoal} unit=" min" color="#2ECC71" />
            </div>
        </div>
    );
};

export default GoalCard;
