import { useState } from "react";
import { useNavigate } from "react-router";
import workoutService from "../../../services/WorkoutServices/workoutService";
import useWorkoutExercises from "./useWorkoutExercises";
import { setStoredWorkoutSession } from "../utils/workoutSessionStorage";
import { getElapsedSeconds } from "../utils/sessionTime";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";
import useWorkoutSessionLifecycle from "./useWorkoutSessionLifecycle";
import useWorkoutSessionModals from "./useWorkoutSessionModals";
import useWorkoutSessionRouteState from "./useWorkoutSessionRouteState";

// Orchestrates workout session lifecycle: active workout resolution, timer state,
// modal visibility, finish/cancel actions, and summary refresh.
const useWorkoutSession = () => {
    const navigate = useNavigate();
    const {
        isPlannedMode,
        isSessionReady,
        plannedReturnPath,
        requestedWorkoutId
    } = useWorkoutSessionRouteState();
    const {
        isFinishModalOpen,
        isCancelConfirmOpen,
        isAddExerciseModalOpen,
        openFinishModal: openFinishModalBase,
        closeFinishModal: closeFinishModalBase,
        openCancelConfirmModal,
        closeCancelConfirmModal,
        openAddExerciseModal,
        closeAddExerciseModal,
        resetModals
    } = useWorkoutSessionModals();
    const [workoutNameError, setWorkoutNameError] = useState("");

    const {
        activeWorkoutId,
        loadWorkoutSummary,
        resetSessionState,
        scheduledStartAt,
        setSummaryStats,
        timerStartAt,
        workoutExercises,
        summaryStats,
        workoutName,
        setWorkoutName,
        setIsWorkoutNameDirty
    } = useWorkoutSessionLifecycle({
        isPlannedMode,
        requestedWorkoutId
    });
    const {
        confirmAddExercise,
        removeExerciseFromWorkout
    } = useWorkoutExercises(activeWorkoutId);

    // Opens finish modal and captures current elapsed time for summary.
    const openFinishModal = () => {
        setSummaryStats((prev) => ({
            ...prev,
            timeSeconds: getElapsedSeconds(timerStartAt)
        }));
        setWorkoutNameError("");
        openFinishModalBase();
    };

    // Closes finish modal and clears name validation error.
    const closeFinishModal = () => {
        setWorkoutNameError("");
        closeFinishModalBase();
    };

    // Updates workout name field and resets its validation error.
    const handleWorkoutNameChange = (value) => {
        setWorkoutName(value);
        setIsWorkoutNameDirty(true);
        if (workoutNameError) {
            setWorkoutNameError("");
        }
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
        resetModals();
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
        resetModals();
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
