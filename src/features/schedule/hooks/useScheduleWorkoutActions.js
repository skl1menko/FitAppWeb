import { useNavigate } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";
import { setStoredWorkoutSession } from "../../workout-session/utils/workoutSessionStorage";

const useScheduleWorkoutActions = () => {
    const navigate = useNavigate();

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
            showWorkoutAlert(error?.response?.data?.message || "Failed to start workout");
        }
    };

    return {
        editPlannedWorkout,
        startPlannedWorkout
    };
};

export default useScheduleWorkoutActions;
