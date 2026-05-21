import { getStoredTimerStartAt } from "./workoutSessionStorage";

export const formatDuration = (totalSeconds) => {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (safeSeconds < 60) return `${seconds}s`;
    if (safeSeconds < 3600) return `${minutes}min ${seconds}s`;
    return `${hours}h ${minutes}min ${seconds}s`;
};

export const getElapsedSeconds = () => {
    const startAt = getStoredTimerStartAt();
    if (!startAt) {
        return 0;
    }

    return Math.floor((Date.now() - startAt) / 1000);
};
