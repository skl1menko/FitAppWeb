import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
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
    const [summaryStats, setSummaryStats] = useState({
        timeSeconds: 0,
        tonnage: 0,
        setsCount: 0
    });

    // Loads workout aggregates (sets/tonnage) and prefills workout name.
    const loadWorkoutSummary = async (workoutId) => {
        if (!workoutId) {
            return;
        }

        try {
            const detailResponse = await workoutService.getById(workoutId);
            const workout = detailResponse?.data?.data;
            if (!workout) {
                return;
            }

            const setsCount = (workout.exercisesWithSets || []).reduce((acc, exercise) => {
                return acc + (exercise?.sets?.length || 0);
            }, 0);

            const tonnageValue = Number(workout.totalTonnage) || 0;

            setSummaryStats((prev) => ({
                ...prev,
                tonnage: tonnageValue,
                setsCount
            }));
            setWorkoutName((prev) => prev || workout.workoutName || "");
        } catch (error) {
            console.error("Failed to load workout summary:", error?.response?.data || error);
        }
    };

    // Resolves the currently active workout from state or API and syncs localStorage.
    const syncActiveWorkout = async () => {
        if (activeWorkoutId) {
            await loadWorkoutSummary(activeWorkoutId);
            return;
        }

        try {
            const workoutsResponse = await workoutService.getAll();
            const workouts = workoutsResponse?.data?.data || [];
            const activeWorkout = workouts.find((workout) => !workout.endTime);

            if (!activeWorkout?.workoutId) {
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
        setIsCancelConfirmOpen(true);
    };

    // Closes cancel confirmation modal.
    const closeCancelConfirmModal = () => {
        setIsCancelConfirmOpen(false);
    };

    const openAddExerciseModal = () => {
        setIsFinishModalOpen(false);
        setIsCancelConfirmOpen(false);
        setIsAddExerciseModalOpen(true);
    }

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

    return {
        isSessionReady,
        isFinishModalOpen,
        isCancelConfirmOpen,
        isAddExerciseModalOpen,
        workoutName,
        workoutNameError,
        summaryStats,
        openFinishModal,
        closeFinishModal,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        openAddExerciseModal,
        handleWorkoutNameChange,
        confirmFinishWorkout,
        cancelWorkout,
    };
};

export default useWorkoutSession;
