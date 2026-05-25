import './GoalCard.scss';
import GoalRing from './GoalRing';
import { RiFireLine, IoFootstepsOutline, FaRegClock } from '../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import dashboard from '../../../../i18n/locales/en/dashboard';

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
    const {t} = useTranslation();
    return (
        <div className="goal-card-cont">
            <div className="goal-header">
                <h2>{t('dashboard.goalCard.goalHeader')}</h2>
            </div>
            <div className="goal-list">
                <GoalRing
                    icon={<IoFootstepsOutline size={16} />}
                    label={t('dashboard.goalCard.label.steps')}
                    percent={getPercent(steps, stepsGoal)}
                    color="#3B82F6"
                    size={80}
                />
                <GoalRing
                    icon={<RiFireLine size={16} />}
                    label={t('dashboard.goalCard.label.calories')}
                    percent={getPercent(calories, caloriesGoal)}
                    color="#FF8700"
                    size={80}
                />
                <GoalRing
                    icon={<FaRegClock size={14} />}
                    label={t('dashboard.goalCard.label.activeMin')}
                    percent={getPercent(activeMin, activeMinGoal)}
                    color="#2ECC71"
                    size={80}
                />
            </div>
            <div className="goal-bars">
                <GoalProgressBar label={t('dashboard.goalCard.label.steps')} value={steps} goal={stepsGoal} unit="" color="#3B82F6" />
                <GoalProgressBar label={t('dashboard.goalCard.label.calories')} value={calories} goal={caloriesGoal} unit={t('dashboard.goalCard.unit.calories')} color="#FF8700" />
                <GoalProgressBar label={t('dashboard.goalCard.label.activeMin')} value={activeMin} goal={activeMinGoal} unit={t('dashboard.goalCard.unit.activeMin')} color="#2ECC71" />
            </div>
        </div>
    );
};

export default GoalCard;
