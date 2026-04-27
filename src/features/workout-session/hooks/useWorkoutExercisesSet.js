import { useCallback, useEffect, useState } from "react";
import workoutSetService from "../../../services/WorkoutServices/workoutSetService";

// Manages sets inside workout exercises: preload sets for visible exercises,
// add/update/delete sets, and provide local set cache by workout exercise id.
const useWorkoutExercisesSet = (activeWorkoutId = null, workoutExercises = []) => {
    const [setsByExerciseId, setSetsByExerciseId] = useState({});

    // Loads sets for one workout_exercises.id into local cache.
    const fetchExerciseSets = useCallback(async (workoutId, exerciseId) => {
        if (!workoutId || !exerciseId) {
            return;
        }

        try {
            const response = await workoutSetService.getSets(workoutId, exerciseId);
            setSetsByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: response?.data?.data || []
            }));
        } catch (error) {
            console.error("Failed to fetch exercise sets:", error);
            setSetsByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: []
            }));
        }
    }, []);

    const addSet = useCallback(async (workoutId, exerciseId, setData) => {
        if (!workoutId || !exerciseId) {
            return;
        }

        try {
            const response = await workoutSetService.addSet(workoutId, exerciseId, setData);
            const newSet = response?.data?.data;
            if (newSet) {
                const preparedNewSet = {
                    ...newSet,
                    isJustAdded: true
                };
                setSetsByExerciseId((prev) => ({
                    ...prev,
                    [exerciseId]: [...(prev[exerciseId] || []), preparedNewSet]
                }));
                return preparedNewSet;
            }
        } catch (error) {
            console.error("Failed to add set:", error);
        }
    }, []);

    // Adds UI default set values used by "Add Set" action.
    const addDefaultSet = useCallback(async (workoutId, exerciseId) => {
        if (!workoutId || !exerciseId) {
            return;
        }

        const newSetData = {
            weight_kg: 0,
            reps: 0,
            rpe: 0
        };

        return addSet(workoutId, exerciseId, newSetData);
    }, [addSet]);

    const updateSet = useCallback(async (workoutId, exerciseId, setId, setData) => {
        if (!workoutId || !exerciseId || !setId) {
            return;
        }

        try {
            const response = await workoutSetService.updateSet(workoutId, exerciseId, setId, setData);
            const updatedSet = response?.data?.data;
            if (updatedSet) {
                setSetsByExerciseId((prev) => ({
                    ...prev,
                    [exerciseId]: (prev[exerciseId] || []).map((set) =>
                        set.setId === setId ? updatedSet : set
                    )
                }));
                return updatedSet;
            }

            return null;
        } catch (error) {
            console.error("Failed to update set:", error);
            return null;
        }
    }, []);

    const deleteSet = useCallback(async (workoutId, exerciseId, setId) => {
        if (!workoutId || !exerciseId || !setId) {
            return;
        }

        try {
            await workoutSetService.deleteSet(workoutId, exerciseId, setId);
            setSetsByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: (prev[exerciseId] || []).filter((set) => set.setId !== setId)
            }));
        } catch (error) {
            console.error("Failed to delete set:", error);
        }
    }, []);

    const getExerciseSets = useCallback(
        (exerciseId) => setsByExerciseId[exerciseId] || [],
        [setsByExerciseId]
    );

    useEffect(() => {
        if (!activeWorkoutId || !Array.isArray(workoutExercises) || workoutExercises.length === 0) {
            return;
        }

        workoutExercises.forEach((exercise) => {
            const workoutExerciseId = Number(exercise?.id);
            if (Number.isFinite(workoutExerciseId) && workoutExerciseId > 0) {
                fetchExerciseSets(activeWorkoutId, workoutExerciseId);
            }
        });
    }, [activeWorkoutId, workoutExercises, fetchExerciseSets]);

    return {
        setsByExerciseId,
        getExerciseSets,
        fetchExerciseSets,
        addSet,
        addDefaultSet,
        updateSet,
        deleteSet
    };
};

export default useWorkoutExercisesSet;
