import { useEffect, useState } from "react";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { normalizeWorkouts } from "../utils/normalizeWorkout";
import { showWorkoutAlert } from "../utils/workoutFeedback";

const useWorkoutList = () => {
    const [workouts, setWorkouts] = useState([]);
    const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
    const [workoutsError, setWorkoutsError] = useState("");
    const [isCreatingScheduledWorkout, setIsCreatingScheduledWorkout] = useState(false);

    const loadWorkouts = async () => {
        setIsLoadingWorkouts(true);
        setWorkoutsError("");

        try {
            const response = await workoutService.getAll();
            setWorkouts(normalizeWorkouts(response?.data?.data));
        } catch (error) {
            console.error("Failed to load workouts:", error?.response?.data || error);
            setWorkoutsError("Failed to load workouts.");
        } finally {
            setIsLoadingWorkouts(false);
        }
    };

    useEffect(() => {
        loadWorkouts();
    }, []);

    const createScheduledWorkout = async ({ hasActiveWorkout = false } = {}) => {
        if (hasActiveWorkout) {
            return null;
        }

        setIsCreatingScheduledWorkout(true);

        try {
            const response = await workoutService.create({
                is_started: false
            });
            const createdWorkoutId = response?.data?.data?.workoutId ?? null;
            await loadWorkouts();
            return createdWorkoutId;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create scheduled workout";
            console.error("Create scheduled workout failed:", error?.response?.data || error);
            showWorkoutAlert(message);
            return null;
        } finally {
            setIsCreatingScheduledWorkout(false);
        }
    };

    const deleteWorkout = async (event, workoutId) => {
        event.stopPropagation();

        if (!workoutId) {
            return false;
        }

        try {
            await workoutService.delete(workoutId);
            setWorkouts((prev) => prev.filter((workout) => workout.workoutId !== workoutId));
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete workout";
            showWorkoutAlert(message);
            return false;
        }
    };

    return {
        workouts,
        isLoadingWorkouts,
        workoutsError,
        isCreatingScheduledWorkout,
        loadWorkouts,
        createScheduledWorkout,
        deleteWorkout
    };
};

export default useWorkoutList;
