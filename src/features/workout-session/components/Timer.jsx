import { useEffect, useMemo, useState } from "react";
import {
    getStoredTimerStartAt,
    notifyWorkoutStatusChanged,
    setStoredTimerStartAt
} from "../utils/workoutSessionStorage";

function Timer({ startAt: externalStartAt = null }) {
    const [startAt, setStartAt] = useState(() => {
        const fromProp = Number(externalStartAt);
        if (Number.isFinite(fromProp) && fromProp > 0) {
            setStoredTimerStartAt(fromProp);
            return fromProp;
        }

        const savedStartAt = getStoredTimerStartAt();
        if (savedStartAt) {
            return savedStartAt;
        }

        const startedNow = Date.now();
        setStoredTimerStartAt(startedNow);
        notifyWorkoutStatusChanged();
        return startedNow;
    });
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const fromProp = Number(externalStartAt);
        if (!Number.isFinite(fromProp) || fromProp <= 0) {
            return;
        }

        setStartAt(fromProp);
        setStoredTimerStartAt(fromProp);
    }, [externalStartAt]);

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

    const totalSeconds = Math.floor((now - startAt) / 1000);

    const timeText = useMemo(() => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (totalSeconds < 60) return `${seconds}s`;
        if (totalSeconds < 3600) return `${minutes}min ${seconds}s`;
        return `${hours}h ${minutes}min ${seconds}s`;
    }, [totalSeconds]);

    return <span className="timer-span">{timeText}</span>;
}

export default Timer;
