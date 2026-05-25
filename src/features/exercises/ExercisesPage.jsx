import "./ExercisesPage.scss"
import { FaPlus } from "../../assets/icons"
import CustomBtn from "../../components/CustomBtn";
import ExerciseCard from "./components/ExerciseCard.jsx";
import MuscleSort from "./components/MuscleSort.jsx";
import CreateExerciseModal from "./components/CreateExerciseModal.jsx";
import ExerciseStatsModal from "./components/ExerciseStatsModal.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import { useState } from "react";
import { MUSCLE_GROUPS } from "./constants/muscleGroups";
import useExercisesPageData from "./hooks/useExercisesPageData";
import useExerciseStats from "./hooks/useExerciseStats";
import { useTranslation } from "react-i18next";

const getListState = ({
    selectedGroup,
    filteredExercises,
    isExercisesLoading,
    exercisesError,
    isCustomLoading,
    customError
}, t) => {
    if (selectedGroup === "custom") {
        if (isCustomLoading) {
            return {
                type: "loading",
                title: t('exercises.page.loadingCustomTitle'),
                message: t('exercises.page.loadingCustomMessage')
            };
        }

        if (customError) {
            return {
                type: "error",
                title: t('exercises.page.customErrorTitle'),
                message: customError
            };
        }

        if (filteredExercises.length === 0) {
            return {
                type: "empty",
                title: t('exercises.page.customEmptyTitle'),
                message: t('exercises.page.customEmptyMessage')
            };
        }

        return null;
    }

    if (isExercisesLoading) {
        return {
            type: "loading",
            title: t('exercises.page.loadingTitle'),
            message: t('exercises.page.loadingMessage')
        };
    }

    if (exercisesError) {
        return {
            type: "error",
            title: t('exercises.page.errorTitle'),
            message: exercisesError
        };
    }

    if (filteredExercises.length === 0) {
        return selectedGroup === "all"
            ? {
                type: "empty",
                title: t('exercises.page.emptyTitle'),
                message: t('exercises.page.emptyMessage')
            }
            : {
                type: "empty",
                title: t('exercises.page.emptyGroupTitle'),
                message: t('exercises.page.emptyGroupMessage')
            };
    }

    return null;
};

const ExercisesPage = () => {
    const { t } = useTranslation();
    const [selectedExercise, setSelectedExercise] = useState(null);
    const {
        filteredExercises,
        selectedGroup,
        isCreateOpen,
        isExercisesLoading,
        exercisesError,
        isCustomLoading,
        customError,
        handleGroupChange,
        handleOpenCreateModal,
        handleCloseCreateModal,
        handleCreatedExercise,
        handleDeleteCustomExercise
    } = useExercisesPageData();
    const {
        exerciseStats,
        isStatsLoading,
        statsError
    } = useExerciseStats(selectedExercise?.id);
    const listState = getListState({
        selectedGroup,
        filteredExercises,
        isExercisesLoading,
        exercisesError,
        isCustomLoading,
        customError
    }, t);

    
    useBodyClass("exercise-page-body");

    const handleOpenExerciseStats = (exercise) => {
        if (!exercise) {
            return;
        }

        setSelectedExercise(exercise);
    };

    const handleCloseExerciseStats = () => {
        setSelectedExercise(null);
    };

    return(
        <div className="exercise-page-cont">
            <div className="exercise-page-content">
                <div className="create-exercise-cont">
                    <CustomBtn
                        className="create-exercise-btn"
                        icon={<FaPlus />}
                        text={t('exercises.page.createNew')}
                        onClick={handleOpenCreateModal}
                    />
                </div>
                <MuscleSort
                    groups={MUSCLE_GROUPS}
                    selectedGroup={selectedGroup}
                    onChange={handleGroupChange}
                />
                <div className="exercise-list-cont">
                    {listState ? (
                        <div className={`exercise-list-state ${listState.type}`} role={listState.type === "error" ? "alert" : "status"}>
                            <h2>{listState.title}</h2>
                            <p>{listState.message}</p>
                        </div>
                    ) : (
                        <ExerciseCard
                            exercises={filteredExercises}
                            showDelete={selectedGroup === "custom"}
                            onDelete={handleDeleteCustomExercise}
                            onSelect={handleOpenExerciseStats}
                        />
                    )}
                </div>
            </div>
            <CreateExerciseModal
                isOpen={isCreateOpen}
                onClose={handleCloseCreateModal}
                onCreated={handleCreatedExercise}
                muscleGroups={MUSCLE_GROUPS}
            />
            <ExerciseStatsModal
                isOpen={Boolean(selectedExercise)}
                exercise={selectedExercise}
                stats={exerciseStats}
                isLoading={isStatsLoading}
                error={statsError}
                onClose={handleCloseExerciseStats}
            />
        </div>
    )
}

export default ExercisesPage;
