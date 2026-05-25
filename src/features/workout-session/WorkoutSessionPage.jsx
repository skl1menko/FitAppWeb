import "./WorkoutSessionPage.scss";
import useBodyClass from "../../hooks/useBodyClass";
import { FaPlus } from "../../assets/icons";
import CustomBtn from "../../components/CustomBtn";
import useWorkoutSession from "./hooks/useWorkoutSession";
import { MUSCLE_GROUPS } from "../exercises/constants/muscleGroups";
import ExerciseCard from "./components/ExerciseCard";
import WorkoutSessionActions from "./components/WorkoutSessionActions";
import WorkoutSessionInfo from "./components/WorkoutSessionInfo";
import WorkoutSessionModals from "./components/WorkoutSessionModals";
import {useTranslation} from "react-i18next";
import { useMemo } from "react";
import { getMuscleGroupTranslationKey } from "../exercises/constants/muscleGroups";

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
    const { t } = useTranslation();
    const translatedMuscleGroups = useMemo(() => (
        MUSCLE_GROUPS.map((group) => ({
            ...group,
            label: t(`exercises.muscleGroups.${getMuscleGroupTranslationKey(group.value)}`),
        }))
    ), [t]);

    useBodyClass("workout-session-page-body");
    return (
        <div className="workout-session-cont">
            <div className="workout-session-content">
                <WorkoutSessionActions
                    isPlannedMode={isPlannedMode}
                    onCancel={cancelWorkout}
                    onFinish={openFinishModal}
                    onOpenCancelConfirm={openCancelConfirmModal}
                    onStartNow={startPlannedWorkoutNow}
                />
                <WorkoutSessionInfo
                    isPlannedMode={isPlannedMode}
                    isSessionReady={isSessionReady}
                    scheduledStartAt={scheduledStartAt}
                    timerStartAt={timerStartAt}
                    tonnage={summaryStats.tonnage}
                />
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
                        <CustomBtn
                            icon={<FaPlus />}
                            text={t('workout_session.page.addExercise')}
                            onClick={openAddExerciseModal}
                            className="add-exercise-btn"
                        />
                    </div>
                </div>
            </div>
            <WorkoutSessionModals
                isAddExerciseModalOpen={isAddExerciseModalOpen}
                isCancelConfirmOpen={isCancelConfirmOpen}
                isFinishModalOpen={isFinishModalOpen}
                muscleGroups={translatedMuscleGroups}
                onAddExerciseClose={closeAddExerciseModal}
                onAddExerciseConfirm={confirmAddExercise}
                onCancelClose={closeCancelConfirmModal}
                onCancelConfirm={cancelWorkout}
                onFinishCancel={openCancelConfirmModal}
                onFinishClose={closeFinishModal}
                onFinishSave={confirmFinishWorkout}
                onWorkoutNameChange={handleWorkoutNameChange}
                summaryStats={summaryStats}
                workoutName={workoutName}
                workoutNameError={workoutNameError}
            />
        </div>
    )
}

export default WorkoutSessionPage;
