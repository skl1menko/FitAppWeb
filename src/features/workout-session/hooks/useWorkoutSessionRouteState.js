import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router";
import {
    clearStoredTimerStartAt,
    notifyWorkoutStatusChanged
} from "../utils/workoutSessionStorage";

const useWorkoutSessionRouteState = () => {
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const shouldStartNew = searchParams.get("new") === "1";
    const requestedWorkoutId = Number(searchParams.get("workoutId"));
    const isPlannedMode = searchParams.get("mode") === "planned"
        && Number.isFinite(requestedWorkoutId)
        && requestedWorkoutId > 0;

    const plannedReturnPath = useMemo(() => {
        if (isPlannedMode && typeof location.state?.returnTo === "string") {
            return location.state.returnTo;
        }

        return "/workouts";
    }, [isPlannedMode, location.state]);

    const isSessionReady = isPlannedMode || !shouldStartNew;

    useEffect(() => {
        if (isPlannedMode || !shouldStartNew) {
            return;
        }

        clearStoredTimerStartAt();
        notifyWorkoutStatusChanged();

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("new");
        setSearchParams(nextParams, { replace: true });
    }, [isPlannedMode, searchParams, setSearchParams, shouldStartNew]);

    return {
        isPlannedMode,
        isSessionReady,
        plannedReturnPath,
        requestedWorkoutId
    };
};

export default useWorkoutSessionRouteState;
