import workoutService from "../../../services/WorkoutServices/workoutService";
import {
    clearActiveWorkoutId,
    getActiveWorkoutId,
    hasStoredActiveWorkoutId,
    setActiveWorkoutId
} from "../utils/activeWorkoutStorage";
import { normalizeWorkout, normalizeWorkouts } from "../utils/normalizeWorkout";
import { isWorkoutActive } from "../utils/workoutStatus";

const findActiveWorkout = (workouts = []) => workouts.find((workout) => isWorkoutActive(workout)) || null;

export const syncActiveWorkoutState = async () => {
    const hasLocalActiveWorkout = hasStoredActiveWorkoutId();

    try {
        const allResponse = await workoutService.getAll();
        const activeWorkout = findActiveWorkout(normalizeWorkouts(allResponse?.data?.data));
        const hasServerActiveWorkout = Boolean(activeWorkout?.workoutId);

        if (hasServerActiveWorkout) {
            setActiveWorkoutId(activeWorkout.workoutId);
        } else if (!hasLocalActiveWorkout) {
            clearActiveWorkoutId();
        }

        return {
            activeWorkout,
            hasActiveWorkout: hasLocalActiveWorkout || hasServerActiveWorkout
        };
    } catch {
        return {
            activeWorkout: null,
            hasActiveWorkout: hasLocalActiveWorkout
        };
    }
};

export const resolveCurrentActiveWorkout = async () => {
    const savedId = getActiveWorkoutId();

    if (savedId) {
        try {
            const existing = await workoutService.getById(savedId);
            const savedWorkout = normalizeWorkout(existing?.data?.data);

            if (isWorkoutActive(savedWorkout)) {
                return savedWorkout;
            }

            clearActiveWorkoutId();
        } catch {
            clearActiveWorkoutId();
        }
    }

    const { activeWorkout } = await syncActiveWorkoutState();
    return activeWorkout;
};

export const startNewWorkoutSession = async () => {
    const activeWorkout = await resolveCurrentActiveWorkout();

    if (activeWorkout?.workoutId) {
        setActiveWorkoutId(activeWorkout.workoutId);
        return {
            status: "active_exists",
            workoutId: activeWorkout.workoutId
        };
    }

    const response = await workoutService.create();
    const createdWorkoutId = normalizeWorkout(response?.data?.data)?.workoutId ?? null;

    if (createdWorkoutId) {
        setActiveWorkoutId(createdWorkoutId);
    }

    return {
        status: "created",
        workoutId: createdWorkoutId
    };
};
