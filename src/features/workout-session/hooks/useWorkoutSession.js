import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import useWorkoutExercises from "./useWorkoutExercises";
import {
    clearStoredTimerStartAt,
    clearStoredWorkoutSession,
    getStoredTimerStartAt,
    getStoredWorkoutSession,
    notifyWorkoutStatusChanged,
    setStoredTimerStartAt,
    setStoredWorkoutSession
} from "../utils/workoutSessionStorage";
import { getElapsedSeconds } from "../utils/sessionTime";
import { normalizeWorkouts } from "../../workout/utils/normalizeWorkout";
import { isWorkoutActive } from "../../workout/utils/workoutStatus";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";

// Orchestrates workout session lifecycle: active workout resolution, timer state,
// modal visibility, finish/cancel actions, and summary refresh.
const useWorkoutSession = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const shouldStartNew = searchParams.get("new") === "1";
    const requestedWorkoutId = Number(searchParams.get("workoutId"));
    const isPlannedMode = searchParams.get("mode") === "planned" && Number.isFinite(requestedWorkoutId) && requestedWorkoutId > 0;
    const plannedReturnPath = isPlannedMode && typeof location.state?.returnTo === "string"
        ? location.state.returnTo
        : "/workouts";
    const isSessionReady = isPlannedMode || !shouldStartNew;
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
    const [activeWorkoutId, setActiveWorkoutId] = useState(() => {
        if (isPlannedMode) {
            return requestedWorkoutId;
        }

        return getStoredWorkoutSession().activeWorkoutId;
    });
    const [workoutName, setWorkoutName] = useState("");
    const [workoutNameError, setWorkoutNameError] = useState("");
    const [isWorkoutNameDirty, setIsWorkoutNameDirty] = useState(false);
    const [scheduledStartAt, setScheduledStartAt] = useState(null);
    const [timerStartAt, setTimerStartAt] = useState(() => {
        return getStoredTimerStartAt();
    });
    const [summaryStats, setSummaryStats] = useState({
        timeSeconds: 0,
        tonnage: 0,
        setsCount: 0
    });
    const lastLoadedWorkoutIdRef = useRef(null);

    const {
        workoutExercises,
        loadWorkoutExercises,
        clearWorkoutExercises,
        confirmAddExercise,
        removeExerciseFromWorkout
    } = useWorkoutExercises(activeWorkoutId);

    // Loads workout aggregates (sets/tonnage) and prefills workout name.
    const loadWorkoutSummary = useCallback(async (workoutId) => {
        if (!workoutId) {
            return null;
        }

        try {
            const workoutData = await loadWorkoutExercises(workoutId);
            const workout = workoutData?.workout;
            if (!workoutData || !workout) {
                return null;
            }

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
    }, [isPlannedMode, isWorkoutNameDirty, loadWorkoutExercises]);

    // Resolves the currently active workout from state or API and syncs localStorage.
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

            // Stale local id (e.g. from another device/session): clear and resolve from API list.
            setActiveWorkoutId(null);
            clearStoredWorkoutSession();
        }

        try {
            const workoutsResponse = await workoutService.getAll();
            const workouts = normalizeWorkouts(workoutsResponse?.data?.data);
            const activeWorkout = workouts.find((workout) => isWorkoutActive(workout));

            if (!activeWorkout?.workoutId) {
                clearWorkoutExercises();
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
        clearWorkoutExercises,
        isPlannedMode,
        loadWorkoutSummary,
        navigate,
        requestedWorkoutId
    ]);

    // Opens finish modal and captures current elapsed time for summary.
    const openFinishModal = () => {
        setSummaryStats((prev) => ({
            ...prev,
            timeSeconds: getElapsedSeconds(timerStartAt)
        }));
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(false);
        setIsFinishModalOpen(true);
    };

    // Closes finish modal and clears name validation error.
    const closeFinishModal = () => {
        setWorkoutNameError("");
        setIsFinishModalOpen(false);
    };

    // Switches from finish modal to cancel confirmation modal.
    const openCancelConfirmModal = () => {
        setIsFinishModalOpen(false);
        setIsAddExerciseModalOpen(false);
        setIsCancelConfirmOpen(true);
    };

    // Closes cancel confirmation modal.
    const closeCancelConfirmModal = () => {
        setIsCancelConfirmOpen(false);
    };

    // Opens add exercise modal and ensures other modals are closed.
    const openAddExerciseModal = () => {
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(true);
    }

    // Closes add exercise modal.
    const closeAddExerciseModal = () => {
        setIsAddExerciseModalOpen(false);
    };

    // Updates workout name field and resets its validation error.
    const handleWorkoutNameChange = (value) => {
        setWorkoutName(value);
        setIsWorkoutNameDirty(true);
        if (workoutNameError) {
            setWorkoutNameError("");
        }
    };

    // Clears workout session state in localStorage and in-memory UI state.
    const resetSessionState = () => {
        clearStoredWorkoutSession();

        setActiveWorkoutId(null);
        setWorkoutName("");
        setWorkoutNameError("");
        setIsWorkoutNameDirty(false);
        setScheduledStartAt(null);
        lastLoadedWorkoutIdRef.current = null;
        clearWorkoutExercises();
        setTimerStartAt(null);
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(false);
    };

    // Validates and finalizes workout by saving end time and redirecting.
    const confirmFinishWorkout = async () => {
        const trimmedName = workoutName.trim();
        if (!isPlannedMode && !trimmedName) {
            setWorkoutNameError("Please enter workout name");
            return;
        }

        if (activeWorkoutId) {
            try {
                if (isPlannedMode) {
                    if (trimmedName) {
                        await workoutService.update(activeWorkoutId, { name: trimmedName });
                    }
                } else {
                    await workoutService.update(activeWorkoutId, {
                        name: trimmedName,
                        end_time: new Date().toISOString()
                    });
                }
            } catch (error) {
                const message = error?.response?.data?.message || (isPlannedMode ? "Failed to save workout" : "Failed to finish workout");
                console.error(isPlannedMode ? "Save planned workout failed:" : "Finish workout failed:", error?.response?.data || error);
                showWorkoutAlert(message);
                return;
            }
        }

        if (!isPlannedMode) {
            resetSessionState();
        }
        navigate(isPlannedMode ? plannedReturnPath : "/workouts");
    };

    // Cancels active workout by deleting it and resetting session state.
    const cancelWorkout = async () => {
        if (activeWorkoutId) {
            try {
                await workoutService.delete(activeWorkoutId);
            } catch (error) {
                const message = error?.response?.data?.message || "Failed to cancel workout";
                console.error("Cancel workout failed:", error?.response?.data || error);
                showWorkoutAlert(message);
                return;
            }
        }

        resetSessionState();
        navigate(isPlannedMode ? plannedReturnPath : "/workouts");
    };

    const startPlannedWorkoutNow = async () => {
        if (!isPlannedMode || !activeWorkoutId) {
            return;
        }

        try {
            const nowIso = new Date().toISOString();
            await workoutService.update(activeWorkoutId, {
                start_time: nowIso,
                is_started: true
            });

            const startedAt = Date.parse(nowIso);
            setStoredWorkoutSession({
                activeWorkoutId,
                timerStartAt: startedAt
            });
            navigate("/workout/session");
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to start planned workout";
            console.error("Start planned workout failed:", error?.response?.data || error);
            showWorkoutAlert(message);
        }
    };

    // Wraps exercise actions to keep session summary in sync.
    const handleConfirmAddExercise = async (selectedExercises = []) => {
        const success = await confirmAddExercise(selectedExercises);
        if (success && activeWorkoutId) {
            await loadWorkoutSummary(activeWorkoutId);
        }
        return success;
    };

    const handleRemoveExerciseFromWorkout = async (exerciseId) => {
        const success = await removeExerciseFromWorkout(exerciseId);
        if (success && activeWorkoutId) {
            await loadWorkoutSummary(activeWorkoutId);
        }
        return success;
    };

    const refreshSummaryStats = async () => {
        if (!activeWorkoutId) {
            return;
        }

        await loadWorkoutSummary(activeWorkoutId);
    };

    // Handles "new=1" query param to start a fresh session and clean timer state.
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

    // Keeps active workout data synchronized when workout id changes.
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
                syncActiveWorkout();
            }
        };

        const handleFocusSync = () => {
            syncActiveWorkout();
        };

        document.addEventListener("visibilitychange", handleVisibilitySync);
        window.addEventListener("focus", handleFocusSync);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilitySync);
            window.removeEventListener("focus", handleFocusSync);
        };
    }, [syncActiveWorkout]);

    return {
        isSessionReady,
        isFinishModalOpen,
        isCancelConfirmOpen,
        isAddExerciseModalOpen,
        activeWorkoutId,
        timerStartAt,
        workoutExercises,
        workoutName,
        workoutNameError,
        scheduledStartAt,
        summaryStats,
        isPlannedMode,
        openFinishModal,
        closeFinishModal,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        handleWorkoutNameChange,
        confirmFinishWorkout,
        cancelWorkout,
        startPlannedWorkoutNow,
        confirmAddExercise: handleConfirmAddExercise,
        removeExerciseFromWorkout: handleRemoveExerciseFromWorkout,
        refreshSummaryStats
    };
};

export default useWorkoutSession;
