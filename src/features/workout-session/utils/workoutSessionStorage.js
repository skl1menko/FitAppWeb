import { ACTIVE_WORKOUT_ID_KEY, TIMER_START_AT_KEY, WORKOUT_STATUS_CHANGED_EVENT } from "../constants";
import { clearActiveWorkoutId, getActiveWorkoutId, setActiveWorkoutId } from "../../workout/utils/activeWorkoutStorage";

export const getStoredTimerStartAt = () => {
    const startAt = Number(localStorage.getItem(TIMER_START_AT_KEY));
    return Number.isFinite(startAt) && startAt > 0 ? startAt : null;
};

export const setStoredTimerStartAt = (startAt) => {
    const normalizedStartAt = Number(startAt);

    if (!Number.isFinite(normalizedStartAt) || normalizedStartAt <= 0) {
        return;
    }

    localStorage.setItem(TIMER_START_AT_KEY, String(normalizedStartAt));
};

export const clearStoredTimerStartAt = () => {
    localStorage.removeItem(TIMER_START_AT_KEY);
};

export const notifyWorkoutStatusChanged = () => {
    window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));
};

export const getStoredWorkoutSession = () => ({
    activeWorkoutId: getActiveWorkoutId(),
    timerStartAt: getStoredTimerStartAt()
});

export const setStoredWorkoutSession = ({ activeWorkoutId = null, timerStartAt = null }) => {
    if (activeWorkoutId) {
        setActiveWorkoutId(activeWorkoutId);
    }

    if (timerStartAt) {
        setStoredTimerStartAt(timerStartAt);
    }

    notifyWorkoutStatusChanged();
};

export const clearStoredWorkoutSession = () => {
    clearActiveWorkoutId();
    clearStoredTimerStartAt();
    notifyWorkoutStatusChanged();
};

export { ACTIVE_WORKOUT_ID_KEY, TIMER_START_AT_KEY, WORKOUT_STATUS_CHANGED_EVENT };
