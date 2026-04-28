import "./WorkoutSessionPage.scss";
import useBodyClass from "../../hooks/useBodyClass";
import { FaRegClock, GiWeight, FaPlus } from "../../assets/icons";
import Timer from "./components/Timer";
import FinishWorkoutModal from "./components/modals/FinishWorkoutModal";
import CancelWorkoutConfirmModal from "./components/modals/CancelWorkoutConfirmModal";
import CustomBtn from "../../components/CustomBtn";
import useWorkoutSession from "./hooks/useWorkoutSession";
import { formatDuration } from "./utils/sessionTime";
import AddExerciseModal from "./components/modals/AddExerciseModal";
import { MUSCLE_GROUPS } from "../exercises/constants/muscleGroups";
import ExerciseCard from "./components/ExerciseCard";
import { formatGroupedNumber } from "../../utils/formatNumber";

const formatPlannedStart = (dateValue) => {
    if (!dateValue) {
        return "Starts when launched";
    }

    return new Date(dateValue).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const WorkoutSessionPage = () => {
    const {
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
        confirmAddExercise,
        removeExerciseFromWorkout,
        refreshSummaryStats
    } = useWorkoutSession();

    useBodyClass("workout-session-page-body");

    

    

    return (
        <div className="workout-session-cont">
            <div className="workout-session-content">
                <div className="end-workout-btn">
                    <CustomBtn text={isPlannedMode ? "SAVE WORKOUT" : "FINISH WORKOUT"} onClick={openFinishModal} />
                    {isPlannedMode ? (
                        <CustomBtn text="START NOW" onClick={startPlannedWorkoutNow} className="start-now-btn" />
                    ) : null}
                    <CustomBtn text={isPlannedMode ? "DELETE" : "CANCEL"} onClick={isPlannedMode ? cancelWorkout : openCancelConfirmModal} className="cancel-btn" />
                </div>
                <div className="workout-info-cont">
                    {!isPlannedMode ? (
                        <>
                            <div className="info-block">
                                <div className="info-icon timer">
                                    <FaRegClock size={28} />
                                </div>
                                <div className="info-cont timer">
                                    <span className="info-label timer">{isPlannedMode ? "SCHEDULED" : "TIME"}</span>
                                    {isPlannedMode ? (
                                        <span className="tonnage-value">{formatPlannedStart(scheduledStartAt)}</span>
                                    ) : (
                                        isSessionReady && <Timer startAt={timerStartAt} />
                                    )}
                                </div>
                            </div>
                            <div className="info-block">
                                <div className="info-icon tonnage">
                                    <GiWeight size={28} />
                                </div>
                                <div className="info-cont tonnage">
                                    <span className="info-label tonnage">TONNAGE</span>
                                    <span className="tonnage-value">{formatGroupedNumber(summaryStats.tonnage)} KG</span>

                                </div>
                            </div>
                        </>
                    ): <div className="divider"></div>

                    }
                    
                </div>
                <div className="exercise-cont">
                    <div className="exercise-list">
                        <ExerciseCard
                            workoutExercises={workoutExercises}
                            activeWorkoutId={activeWorkoutId}
                            isPlannedMode={isPlannedMode}
                            onDeleteExercise={removeExerciseFromWorkout}
                            onSetUpdated={refreshSummaryStats}
                        />
                    </div>
                    <div className="add-exercise">
                        <CustomBtn icon={<FaPlus />} text="Add exercise" onClick={openAddExerciseModal} className="add-exercise-btn"/>
                    </div>
                </div>
            </div>
            <AddExerciseModal
                isOpen={isAddExerciseModalOpen}
                onClose={closeAddExerciseModal}
                onConfirm={confirmAddExercise}
                muscleGroups={MUSCLE_GROUPS}
            />
            <FinishWorkoutModal
                isOpen={isFinishModalOpen}
                workoutName={workoutName}
                workoutNameError={workoutNameError}
                timeText={formatDuration(summaryStats.timeSeconds)}
                tonnage={summaryStats.tonnage}
                setsCount={summaryStats.setsCount}
                onClose={closeFinishModal}
                onCancel={openCancelConfirmModal}
                onSave={confirmFinishWorkout}
                onWorkoutNameChange={handleWorkoutNameChange}
            />
            <CancelWorkoutConfirmModal
                isOpen={isCancelConfirmOpen}
                onClose={closeCancelConfirmModal}
                onConfirm={cancelWorkout}
            />
        </div>
    )
}

export default WorkoutSessionPage;
