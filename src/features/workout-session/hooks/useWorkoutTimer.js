import { useEffect, useMemo, useState } from "react";
import { formatDuration } from "../utils/sessionTime";
import {
    getStoredTimerStartAt,
    notifyWorkoutStatusChanged,
    setStoredTimerStartAt
} from "../utils/workoutSessionStorage";

const getInitialStartAt = (externalStartAt) => {
    const fromProp = Number(externalStartAt);
    if (Number.isFinite(fromProp) && fromProp > 0) {
        return fromProp;
    }

    const savedStartAt = getStoredTimerStartAt();
    if (savedStartAt) {
        return savedStartAt;
    }

    return Date.now();
};

const useWorkoutTimer = (externalStartAt = null) => {
    const [fallbackStartAt] = useState(() => getInitialStartAt(externalStartAt));
    const [now, setNow] = useState(() => Date.now());
    const normalizedExternalStartAt = Number(externalStartAt);
    const startAt = Number.isFinite(normalizedExternalStartAt) && normalizedExternalStartAt > 0
        ? normalizedExternalStartAt
        : fallbackStartAt;

    useEffect(() => {
        const savedStartAt = getStoredTimerStartAt();

        if (savedStartAt === startAt) {
            return;
        }

        setStoredTimerStartAt(startAt);
        notifyWorkoutStatusChanged();
    }, [startAt]);

    useEffect(() => {
        const tick = () => setNow(Date.now());

        const id = setInterval(tick, 1000);
        document.addEventListener("visibilitychange", tick);
        window.addEventListener("focus", tick);

        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", tick);
            window.removeEventListener("focus", tick);
        };
    }, []);

    const totalSeconds = Math.max(0, Math.floor((now - startAt) / 1000));

    const timeText = useMemo(() => formatDuration(totalSeconds), [totalSeconds]);

    return {
        startAt,
        totalSeconds,
        timeText
    };
};

export default useWorkoutTimer;
