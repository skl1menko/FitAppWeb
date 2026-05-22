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

const getListState = ({
    selectedGroup,
    filteredExercises,
    isExercisesLoading,
    exercisesError,
    isCustomLoading,
    customError
}) => {
    if (selectedGroup === "custom") {
        if (isCustomLoading) {
            return {
                type: "loading",
                title: "Loading custom exercises...",
                message: "Fetching your saved custom exercises."
            };
        }

        if (customError) {
            return {
                type: "error",
                title: "Could not load custom exercises",
                message: customError
            };
        }

        if (filteredExercises.length === 0) {
            return {
                type: "empty",
                title: "No custom exercises yet",
                message: "Create your first custom exercise to see it here."
            };
        }

        return null;
    }

    if (isExercisesLoading) {
        return {
            type: "loading",
            title: "Loading exercises...",
            message: "Building your exercise library."
        };
    }

    if (exercisesError) {
        return {
            type: "error",
            title: "Could not load exercises",
            message: exercisesError
        };
    }

    if (filteredExercises.length === 0) {
        return selectedGroup === "all"
            ? {
                type: "empty",
                title: "No exercises found",
                message: "The exercise library is currently empty."
            }
            : {
                type: "empty",
                title: "No exercises in this group",
                message: "Try another muscle group or create a custom exercise."
            };
    }

    return null;
};

const ExercisesPage = () => {
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
    });

    
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
                        text="Create New Exercise"
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
