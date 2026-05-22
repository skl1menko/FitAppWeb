import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import { normalizeWorkouts } from "../../workout/utils/normalizeWorkout";
import { isWorkoutActive } from "../../workout/utils/workoutStatus";
import { loadWorkoutExercisesSummary } from "./useWorkoutExercises";
import {
    clearStoredTimerStartAt,
    clearStoredWorkoutSession,
    getStoredTimerStartAt,
    getStoredWorkoutSession,
    notifyWorkoutStatusChanged,
    setStoredTimerStartAt,
    setStoredWorkoutSession
} from "../utils/workoutSessionStorage";

const createEmptySummaryStats = () => ({
    timeSeconds: 0,
    tonnage: 0,
    setsCount: 0
});

const useWorkoutSessionLifecycle = ({
    isPlannedMode,
    requestedWorkoutId
}) => {
    const navigate = useNavigate();
    const [activeWorkoutId, setActiveWorkoutId] = useState(() => {
        if (isPlannedMode) {
            return requestedWorkoutId;
        }

        return getStoredWorkoutSession().activeWorkoutId;
    });
    const [workoutName, setWorkoutName] = useState("");
    const [isWorkoutNameDirty, setIsWorkoutNameDirty] = useState(false);
    const [scheduledStartAt, setScheduledStartAt] = useState(null);
    const [timerStartAt, setTimerStartAt] = useState(() => getStoredTimerStartAt());
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [summaryStats, setSummaryStats] = useState(createEmptySummaryStats);
    const lastLoadedWorkoutIdRef = useRef(null);

    const loadWorkoutSummary = useCallback(async (workoutId) => {
        if (!workoutId) {
            return null;
        }

        try {
            const workoutData = await loadWorkoutExercisesSummary(workoutId);
            const workout = workoutData?.workout;
            if (!workoutData || !workout) {
                return null;
            }

            setWorkoutExercises(workoutData.exercisesWithSets || []);

            const serverStartAt = Date.parse(workout.startTime || "");
            setScheduledStartAt(workout.startTime || null);
            if (!isPlannedMode && Number.isFinite(serverStartAt) && serverStartAt > 0) {
                setTimerStartAt(serverStartAt);
                setStoredTimerStartAt(serverStartAt);
                notifyWorkoutStatusChanged();
            } else if (isPlannedMode) {
                setTimerStartAt(null);
            }

            setSummaryStats((prev) => ({
                ...prev,
                tonnage: workoutData.tonnage,
                setsCount: workoutData.setsCount
            }));

            const isNewWorkoutContext = lastLoadedWorkoutIdRef.current !== workoutId;
            if (isNewWorkoutContext || !isWorkoutNameDirty) {
                setWorkoutName(workout.workoutName || "");
                if (isNewWorkoutContext) {
                    setIsWorkoutNameDirty(false);
                }
            }

            lastLoadedWorkoutIdRef.current = workoutId;
            return workout;
        } catch (error) {
            console.error("Failed to load workout summary:", error?.response?.data || error);
            return null;
        }
    }, [isPlannedMode, isWorkoutNameDirty]);

    const clearSessionData = useCallback(() => {
        setActiveWorkoutId(null);
        setWorkoutName("");
        setIsWorkoutNameDirty(false);
        setScheduledStartAt(null);
        setTimerStartAt(null);
        setWorkoutExercises([]);
        setSummaryStats(createEmptySummaryStats());
        lastLoadedWorkoutIdRef.current = null;
    }, []);

    const resetSessionState = useCallback(() => {
        clearStoredWorkoutSession();
        clearSessionData();
    }, [clearSessionData]);

    const syncActiveWorkout = useCallback(async () => {
        if (isPlannedMode) {
            if (!requestedWorkoutId) {
                navigate("/workouts");
                return;
            }

            const workout = await loadWorkoutSummary(requestedWorkoutId);
            if (!workout) {
                navigate("/workouts");
            }
            return;
        }

        if (activeWorkoutId) {
            const workout = await loadWorkoutSummary(activeWorkoutId);
            if (workout) {
                return;
            }

            setActiveWorkoutId(null);
            clearStoredWorkoutSession();
        }

        try {
            const workoutsResponse = await workoutService.getAll();
            const workouts = normalizeWorkouts(workoutsResponse?.data?.data);
            const activeWorkout = workouts.find((workout) => isWorkoutActive(workout));

            if (!activeWorkout?.workoutId) {
                setWorkoutExercises([]);
                setSummaryStats((prev) => ({
                    ...prev,
                    tonnage: 0,
                    setsCount: 0
                }));
                setTimerStartAt(null);
                clearStoredTimerStartAt();
                notifyWorkoutStatusChanged();
                return;
            }

            const resolvedWorkoutId = Number(activeWorkout.workoutId);
            setActiveWorkoutId(resolvedWorkoutId);
            setStoredWorkoutSession({ activeWorkoutId: resolvedWorkoutId });
            await loadWorkoutSummary(resolvedWorkoutId);
        } catch (error) {
            console.error("Failed to resolve active workout:", error?.response?.data || error);
        }
    }, [
        activeWorkoutId,
        isPlannedMode,
        loadWorkoutSummary,
        navigate,
        requestedWorkoutId
    ]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void syncActiveWorkout();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [syncActiveWorkout]);

    useEffect(() => {
        const handleVisibilitySync = () => {
            if (!document.hidden) {
                void syncActiveWorkout();
            }
        };

        const handleFocusSync = () => {
            void syncActiveWorkout();
        };

        document.addEventListener("visibilitychange", handleVisibilitySync);
        window.addEventListener("focus", handleFocusSync);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilitySync);
            window.removeEventListener("focus", handleFocusSync);
        };
    }, [syncActiveWorkout]);

    return {
        activeWorkoutId,
        loadWorkoutSummary,
        resetSessionState,
        scheduledStartAt,
        setSummaryStats,
        setWorkoutName,
        setIsWorkoutNameDirty,
        summaryStats,
        timerStartAt,
        workoutExercises,
        workoutName
    };
};

export default useWorkoutSessionLifecycle;
