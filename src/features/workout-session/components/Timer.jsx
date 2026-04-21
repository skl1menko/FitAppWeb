import { useEffect, useMemo, useState } from "react";

const TIMER_START_AT_KEY = "workoutSessionStartAt";
const WORKOUT_STATUS_CHANGED_EVENT = "workoutSessionStatusChanged";

function Timer({ startAt: externalStartAt = null }) {
    const [startAt, setStartAt] = useState(() => {
        const fromProp = Number(externalStartAt);
        if (Number.isFinite(fromProp) && fromProp > 0) {
            localStorage.setItem(TIMER_START_AT_KEY, String(fromProp));
            return fromProp;
        }

        const savedStartAt = Number(localStorage.getItem(TIMER_START_AT_KEY));

        if (Number.isFinite(savedStartAt) && savedStartAt > 0) {
            return savedStartAt;
        }

        const startedNow = Date.now();
        localStorage.setItem(TIMER_START_AT_KEY, String(startedNow));
        window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));
        return startedNow;
    });
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const fromProp = Number(externalStartAt);
        if (!Number.isFinite(fromProp) || fromProp <= 0) {
            return;
        }

        setStartAt(fromProp);
        localStorage.setItem(TIMER_START_AT_KEY, String(fromProp));
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