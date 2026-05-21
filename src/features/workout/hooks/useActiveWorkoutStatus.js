import { useEffect, useState } from "react";
import { ACTIVE_WORKOUT_ID_KEY, TIMER_START_AT_KEY } from "../../workout-session/constants";
import { syncActiveWorkoutState } from "../services/workoutSessionManager";

const useActiveWorkoutStatus = () => {
    const [hasActiveWorkout, setHasActiveWorkout] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const syncStatus = async () => {
            const { hasActiveWorkout: nextHasActiveWorkout } = await syncActiveWorkoutState();

            if (isMounted) {
                setHasActiveWorkout(nextHasActiveWorkout);
            }
        };

        const handleVisibilitySync = () => {
            if (!document.hidden) {
                syncStatus();
            }
        };

        const handleStorageSync = (event) => {
            if (!event.key || event.key === ACTIVE_WORKOUT_ID_KEY || event.key === TIMER_START_AT_KEY) {
                syncStatus();
            }
        };

        syncStatus();
        window.addEventListener("focus", syncStatus);
        window.addEventListener("storage", handleStorageSync);
        document.addEventListener("visibilitychange", handleVisibilitySync);

        return () => {
            isMounted = false;
            window.removeEventListener("focus", syncStatus);
            window.removeEventListener("storage", handleStorageSync);
            document.removeEventListener("visibilitychange", handleVisibilitySync);
        };
    }, []);

    return {
        hasActiveWorkout
    };
};

export default useActiveWorkoutStatus;
