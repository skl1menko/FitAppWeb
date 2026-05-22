import { useCallback, useEffect, useState } from "react";
import workoutSetService from "../../../services/WorkoutServices/workoutSetService";

const buildSetsMap = (workoutExercises = []) => {
    return (Array.isArray(workoutExercises) ? workoutExercises : []).reduce((acc, exercise) => {
        const workoutExerciseId = Number(exercise?.id);
        if (!Number.isFinite(workoutExerciseId) || workoutExerciseId <= 0) {
            return acc;
        }

        acc[workoutExerciseId] = Array.isArray(exercise?.sets) ? exercise.sets : [];
        return acc;
    }, {});
};

// Manages sets inside workout exercises using workout detail payload as the
// single source of truth, plus local optimistic updates between refreshes.
const useWorkoutExercisesSet = (workoutExercises = []) => {
    const [setsByExerciseId, setSetsByExerciseId] = useState(() => buildSetsMap(workoutExercises));

    useEffect(() => {
        setSetsByExerciseId(buildSetsMap(workoutExercises));
    }, [workoutExercises]);

    const addSet = useCallback(async (workoutId, exerciseId, setData) => {
        if (!workoutId || !exerciseId) {
            return;
        }

        const tempSetId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const optimisticSet = {
            setId: tempSetId,
            workoutExerciseId: exerciseId,
            weight_kg: setData?.weight_kg ?? 0,
            reps: setData?.reps ?? 0,
            rpe: setData?.rpe ?? null,
            isPendingCreate: true
        };

        setSetsByExerciseId((prev) => ({
            ...prev,
            [exerciseId]: [...(prev[exerciseId] || []), optimisticSet]
        }));

        try {
            const response = await workoutSetService.addSet(workoutId, exerciseId, setData);
            const newSet = response?.data?.data;
            if (newSet) {
                setSetsByExerciseId((prev) => ({
                    ...prev,
                    [exerciseId]: (prev[exerciseId] || []).map((set) =>
                        set.setId === tempSetId ? newSet : set
                    )
                }));
                return newSet;
            }

            setSetsByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: (prev[exerciseId] || []).filter((set) => set.setId !== tempSetId)
            }));
        } catch (error) {
            console.error("Failed to add set:", error);
            setSetsByExerciseId((prev) => ({
                ...prev,
                [exerciseId]: (prev[exerciseId] || []).filter((set) => set.setId !== tempSetId)
            }));
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

    return {
        getExerciseSets,
        addSet,
        addDefaultSet,
        updateSet,
        deleteSet
    };
};

export default useWorkoutExercisesSet;
