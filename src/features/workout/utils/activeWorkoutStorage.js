import { ACTIVE_WORKOUT_ID_KEY } from "../../workout-session/constants";

export const getActiveWorkoutId = () => {
    const rawValue = Number(localStorage.getItem(ACTIVE_WORKOUT_ID_KEY));
    return Number.isFinite(rawValue) && rawValue > 0 ? rawValue : null;
};

export const setActiveWorkoutId = (workoutId) => {
    const normalizedId = Number(workoutId);

    if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
        return;
    }

    localStorage.setItem(ACTIVE_WORKOUT_ID_KEY, String(normalizedId));
};

export const clearActiveWorkoutId = () => {
    localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
};

export const hasStoredActiveWorkoutId = () => getActiveWorkoutId() !== null;
