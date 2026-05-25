import { useNavigate } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";
import { setStoredWorkoutSession } from "../../workout-session/utils/workoutSessionStorage";
import { useTranslation } from "react-i18next";

const useScheduleWorkoutActions = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const editPlannedWorkout = (workoutId) => {
        navigate(`/workout/session?workoutId=${workoutId}&mode=planned`, {
            state: { returnTo: "/schedule" }
        });
    };

    const startPlannedWorkout = async (workoutId) => {
        if (!workoutId) {
            return;
        }

        try {
            const nowIso = new Date().toISOString();
            await workoutService.update(workoutId, {
                start_time: nowIso,
                is_started: true
            });

            setStoredWorkoutSession({
                activeWorkoutId: workoutId,
                timerStartAt: Date.parse(nowIso)
            });
            navigate("/workout/session");
        } catch (error) {
            showWorkoutAlert(error?.response?.data?.message || t('schedule.programCard.errors.startWorkout'));
        }
    };

    return {
        editPlannedWorkout,
        startPlannedWorkout
    };
};

export default useScheduleWorkoutActions;
