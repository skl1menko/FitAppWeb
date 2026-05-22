import { useEffect, useState } from "react";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { normalizeWorkout, normalizeWorkouts } from "../../workout/utils/normalizeWorkout";
import {
    buildExerciseStats,
    getRecentWorkouts
} from "../utils/exerciseStats";

const INITIAL_STATS = { chartData: [] };

const useExerciseStats = (exerciseId) => {
    const [exerciseStats, setExerciseStats] = useState(INITIAL_STATS);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState("");

    useEffect(() => {
        if (!exerciseId) {
            setExerciseStats(INITIAL_STATS);
            setStatsError("");
            setIsStatsLoading(false);
            return;
        }

        let isMounted = true;

        const loadExerciseStats = async () => {
            setIsStatsLoading(true);
            setStatsError("");

            try {
                const workoutsResponse = await workoutService.getAll();
                const workouts = normalizeWorkouts(workoutsResponse?.data?.data);
                const recentWorkouts = getRecentWorkouts(workouts);

                const workoutDetails = await Promise.allSettled(
                    recentWorkouts.map((workout) => workoutService.getById(workout.workoutId))
                );
                const fulfilledDetails = workoutDetails.map((result) => (
                    result.status === "fulfilled"
                        ? normalizeWorkout(result.value?.data?.data)
                        : null
                ));

                if (!isMounted) {
                    return;
                }

                setExerciseStats(buildExerciseStats({
                    exerciseId,
                    workouts: recentWorkouts,
                    workoutDetails: fulfilledDetails
                }));
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setStatsError(error?.message || "Failed to load exercise stats");
                setExerciseStats(INITIAL_STATS);
            } finally {
                if (isMounted) {
                    setIsStatsLoading(false);
                }
            }
        };

        loadExerciseStats();

        return () => {
            isMounted = false;
        };
    }, [exerciseId]);

    return {
        exerciseStats,
        isStatsLoading,
        statsError
    };
};

export default useExerciseStats;
