import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import workoutExerciseService from "../../../services/WorkoutServices/workoutExerciseService";
import {
    ACTIVE_WORKOUT_ID_KEY,
    TIMER_START_AT_KEY,
    WORKOUT_STATUS_CHANGED_EVENT
} from "../constants";
import { getElapsedSeconds } from "../utils/sessionTime";

const useWorkoutSession = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const shouldStartNew = searchParams.get("new") === "1";

    const [isSessionReady, setIsSessionReady] = useState(!shouldStartNew);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
    const [activeWorkoutId, setActiveWorkoutId] = useState(() => {
        const savedWorkoutId = Number(localStorage.getItem(ACTIVE_WORKOUT_ID_KEY));
        return Number.isFinite(savedWorkoutId) && savedWorkoutId > 0 ? savedWorkoutId : null;
    });
    const [workoutName, setWorkoutName] = useState("");
    const [workoutNameError, setWorkoutNameError] = useState("");
    const [workoutExercises, setWorkoutExercises] = useState([]);
    const [timerStartAt, setTimerStartAt] = useState(() => {
        const savedStartAt = Number(localStorage.getItem(TIMER_START_AT_KEY));
        return Number.isFinite(savedStartAt) && savedStartAt > 0 ? savedStartAt : null;
    });
    const [summaryStats, setSummaryStats] = useState({
        timeSeconds: 0,
        tonnage: 0,
        setsCount: 0
    });

    // Loads workout aggregates (sets/tonnage) and prefills workout name.
    const loadWorkoutSummary = async (workoutId) => {
        if (!workoutId) {
            return null;
        }

        try {
            const detailResponse = await workoutService.getById(workoutId);
            const workout = detailResponse?.data?.data;
            if (!workout) {
                return null;
            }

            const serverStartAt = Date.parse(workout.startTime || workout.start_time || "");
            if (Number.isFinite(serverStartAt) && serverStartAt > 0) {
                setTimerStartAt(serverStartAt);
                localStorage.setItem(TIMER_START_AT_KEY, String(serverStartAt));
                window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));
            }

            const exercisesWithSets = Array.isArray(workout.exercisesWithSets)
                ? workout.exercisesWithSets
                : [];

            setWorkoutExercises(exercisesWithSets);

            const setsCount = exercisesWithSets.reduce((acc, exercise) => {
                return acc + (exercise?.sets?.length || 0);
            }, 0);

            const tonnageValue = Number(workout.totalTonnage) || 0;

            setSummaryStats((prev) => ({
                ...prev,
                tonnage: tonnageValue,
                setsCount
            }));
            setWorkoutName((prev) => prev || workout.workoutName || "");
            return workout;
        } catch (error) {
            console.error("Failed to load workout summary:", error?.response?.data || error);
            return null;
        }
    };

    // Resolves the currently active workout from state or API and syncs localStorage.
    const syncActiveWorkout = async () => {
        if (activeWorkoutId) {
            const workout = await loadWorkoutSummary(activeWorkoutId);
            if (workout) {
                return;
            }

            // Stale local id (e.g. from another device/session): clear and resolve from API list.
            setActiveWorkoutId(null);
            localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
        }

        try {
            const workoutsResponse = await workoutService.getAll();
            const workouts = workoutsResponse?.data?.data || [];
            const activeWorkout = workouts.find((workout) => !workout.endTime && !workout.end_time);

            if (!activeWorkout?.workoutId) {
                setWorkoutExercises([]);
                setTimerStartAt(null);
                localStorage.removeItem(TIMER_START_AT_KEY);
                window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));
                return;
            }

            const resolvedWorkoutId = Number(activeWorkout.workoutId);
            setActiveWorkoutId(resolvedWorkoutId);
            localStorage.setItem(ACTIVE_WORKOUT_ID_KEY, String(resolvedWorkoutId));
            await loadWorkoutSummary(resolvedWorkoutId);
        } catch (error) {
            console.error("Failed to resolve active workout:", error?.response?.data || error);
        }
    };

    // Opens finish modal and captures current elapsed time for summary.
    const openFinishModal = () => {
        setSummaryStats((prev) => ({
            ...prev,
            timeSeconds: getElapsedSeconds()
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
        if (workoutNameError) {
            setWorkoutNameError("");
        }
    };

    // Clears workout session state in localStorage and in-memory UI state.
    const resetSessionState = () => {
        localStorage.removeItem(TIMER_START_AT_KEY);
        localStorage.removeItem(ACTIVE_WORKOUT_ID_KEY);
        window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));

        setActiveWorkoutId(null);
        setWorkoutName("");
        setWorkoutNameError("");
        setWorkoutExercises([]);
        setTimerStartAt(null);
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(false);
    };

    // Validates and finalizes workout by saving end time and redirecting.
    const confirmFinishWorkout = async () => {
        const trimmedName = workoutName.trim();
        if (!trimmedName) {
            setWorkoutNameError("Please enter workout name");
            return;
        }

        if (activeWorkoutId) {
            try {
                await workoutService.update(activeWorkoutId, {
                    name: trimmedName,
                    end_time: new Date().toISOString()
                });
            } catch (error) {
                const message = error?.response?.data?.message || "Failed to finish workout";
                console.error("Finish workout failed:", error?.response?.data || error);
                alert(message);
                return;
            }
        }

        resetSessionState();
        navigate("/workouts");
    };

    // Cancels active workout by deleting it and resetting session state.
    const cancelWorkout = async () => {
        if (activeWorkoutId) {
            try {
                await workoutService.delete(activeWorkoutId);
            } catch (error) {
                const message = error?.response?.data?.message || "Failed to cancel workout";
                console.error("Cancel workout failed:", error?.response?.data || error);
                alert(message);
                return;
            }
        }

        resetSessionState();
        navigate("/workouts");
    };

    const confirmAddExercise = async (selectedExercises = []) => {
        if (!activeWorkoutId) {
            return false;
        }

        const normalizedExercises = Array.isArray(selectedExercises) ? selectedExercises : [selectedExercises];
        const exerciseIds = normalizedExercises
            .map((exercise) => Number(exercise?.exerciseId || exercise?.id || exercise?.exercise_id))
            .filter((exerciseId) => Number.isFinite(exerciseId) && exerciseId > 0);

        if (exerciseIds.length === 0) {
            return false;
        }

        try {
            for (const exerciseId of exerciseIds) {
                await workoutExerciseService.addExercise(activeWorkoutId, {
                    exercise_id: exerciseId
                });
            }

            await loadWorkoutSummary(activeWorkoutId);
            return true;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to add exercise";
            console.error("Add exercise failed:", error?.response?.data || error);
            alert(message);
            return false;
        }
    };

    // Handles "new=1" query param to start a fresh session and clean timer state.
    useEffect(() => {
        if (!shouldStartNew) {
            setIsSessionReady(true);
            return;
        }

        localStorage.removeItem(TIMER_START_AT_KEY);
        window.dispatchEvent(new Event(WORKOUT_STATUS_CHANGED_EVENT));

        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("new");
        setSearchParams(nextParams, { replace: true });
        setIsSessionReady(true);
    }, [searchParams, setSearchParams, shouldStartNew]);

    // Keeps active workout data synchronized when workout id changes.
    useEffect(() => {
        syncActiveWorkout();
    }, [activeWorkoutId]);

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
    }, [activeWorkoutId]);

    return {
        isSessionReady,
        isFinishModalOpen,
        isCancelConfirmOpen,
        isAddExerciseModalOpen,
        timerStartAt,
        workoutExercises,
        workoutName,
        workoutNameError,
        summaryStats,
        openFinishModal,
        closeFinishModal,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        handleWorkoutNameChange,
        confirmFinishWorkout,
        cancelWorkout,
        confirmAddExercise
    };
};

export default useWorkoutSession;
