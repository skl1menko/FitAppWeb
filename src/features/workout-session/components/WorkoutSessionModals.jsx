import AddExerciseModal from "./modals/AddExerciseModal";
import FinishWorkoutModal from "./modals/FinishWorkoutModal";
import CancelWorkoutConfirmModal from "./modals/CancelWorkoutConfirmModal";
import { formatDuration } from "../utils/sessionTime";

const WorkoutSessionModals = ({
    isAddExerciseModalOpen = false,
    isCancelConfirmOpen = false,
    isFinishModalOpen = false,
    muscleGroups = [],
    onAddExerciseClose = null,
    onAddExerciseConfirm = null,
    onCancelClose = null,
    onCancelConfirm = null,
    onFinishCancel = null,
    onFinishClose = null,
    onFinishSave = null,
    onWorkoutNameChange = null,
    summaryStats = null,
    workoutName = "",
    workoutNameError = ""
}) => {
    const safeSummaryStats = summaryStats || {
        setsCount: 0,
        timeSeconds: 0,
        tonnage: 0
    };

    return (
        <>
            <AddExerciseModal
                isOpen={isAddExerciseModalOpen}
                onClose={onAddExerciseClose}
                onConfirm={onAddExerciseConfirm}
                muscleGroups={muscleGroups}
            />
            <FinishWorkoutModal
                isOpen={isFinishModalOpen}
                workoutName={workoutName}
                workoutNameError={workoutNameError}
                timeText={formatDuration(safeSummaryStats.timeSeconds)}
                tonnage={safeSummaryStats.tonnage}
                setsCount={safeSummaryStats.setsCount}
                onClose={onFinishClose}
                onCancel={onFinishCancel}
                onSave={onFinishSave}
                onWorkoutNameChange={onWorkoutNameChange}
            />
            <CancelWorkoutConfirmModal
                isOpen={isCancelConfirmOpen}
                onClose={onCancelClose}
                onConfirm={onCancelConfirm}
            />
        </>
    );
};

export default WorkoutSessionModals;
