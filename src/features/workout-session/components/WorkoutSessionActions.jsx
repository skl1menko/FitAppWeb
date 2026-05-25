import CustomBtn from "../../../components/CustomBtn";
import { useTranslation } from "react-i18next";

const WorkoutSessionActions = ({
    isPlannedMode = false,
    onCancel = null,
    onFinish = null,
    onOpenCancelConfirm = null,
    onStartNow = null
}) => {
    const { t } = useTranslation();

    return (
        <div className="end-workout-btn">
            <CustomBtn
                text={isPlannedMode ? t('workout_session.workoutSessionActions.saveWorkout') : t('workout_session.workoutSessionActions.finishWorkout')}
                onClick={onFinish}
            />
            {isPlannedMode ? (
                <CustomBtn
                    text={t('workout_session.workoutSessionActions.startWorkout')}
                    onClick={onStartNow}
                    className="start-now-btn"
                />
            ) : null}
            <CustomBtn
                text={isPlannedMode ? t('workout_session.workoutSessionActions.deleteWorkout') : t('workout_session.workoutSessionActions.cancelWorkout')}
                onClick={isPlannedMode ? onCancel : onOpenCancelConfirm}
                className="cancel-btn"
            />
        </div>
    );
};

export default WorkoutSessionActions;
