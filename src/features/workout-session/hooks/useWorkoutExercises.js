import { useCallback } from "react";
import workoutService from "../../../services/WorkoutServices/workoutService";
import workoutExerciseService from "../../../services/WorkoutServices/workoutExerciseService";
import { normalizeWorkout } from "../../workout/utils/normalizeWorkout";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";

export const loadWorkoutExercisesSummary = async (workoutId) => {
    if (!workoutId) {
        return null;
    }

    const detailResponse = await workoutService.getById(workoutId);
    const workout = normalizeWorkout(detailResponse?.data?.data);
    if (!workout?.workoutId) {
        return null;
    }

    const exercisesWithSets = Array.isArray(workout.exercisesWithSets)
        ? workout.exercisesWithSets
        : [];

    const setsCount = exercisesWithSets.reduce((acc, exercise) => {
        return acc + (exercise?.sets?.length || 0);
    }, 0);

    const tonnage = Number(workout.totalTonnage) || 0;

    return {
        exercisesWithSets,
        workout,
        tonnage,
        setsCount
    };
};

// Manages workout exercise collection: load list with summary data,
// add exercise to active workout, remove exercise from active workout.
const useWorkoutExercises = (activeWorkoutId) => {
    // Adds one or many catalog exercises to current active workout.
    const confirmAddExercise = useCallback(async (selectedExercises = []) => {
        if (!activeWorkoutId) {
            return false;
        }

        const normalizedExercises = Array.isArray(selectedExercises) ? selectedExercises : [selectedExercises];
        const exerciseIds = normalizedExercises
            .map((exercise) => Number(exercise?.exerciseId || exercise?.id || exercise?.exercise_id))
            .filter((exerciseId) => Number.isFinite(exerciseId) && exerciseId > 0);

        if (exerciseIds.length === 0) {
            return false;
        }

        try {
            for (const exerciseId of exerciseIds) {
                await workoutExerciseService.addExercise(activeWorkoutId, {
                    exercise_id: exerciseId
                });
            }
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to add exercise";
            console.error("Add exercise failed:", error?.response?.data || error);
            showWorkoutAlert(message);
            return false;
        }
    }, [activeWorkoutId]);

    // Removes workout exercise by workout_exercises.id.
    const removeExerciseFromWorkout = useCallback(async (exerciseId) => {
        if (!activeWorkoutId || !exerciseId) {
            return false;
        }

        try {
            await workoutExerciseService.deleteExercise(activeWorkoutId, exerciseId);
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to delete exercise";
            console.error("Delete exercise failed:", error?.response?.data || error);
            showWorkoutAlert(message);
            return false;
        }
    }, [activeWorkoutId]);

    return {
        confirmAddExercise,
        removeExerciseFromWorkout
    };
};

export default useWorkoutExercises;
