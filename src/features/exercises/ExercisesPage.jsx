import "./ExercisesPage.scss"
import { FaPlus } from "../../assets/icons"
import CustomBtn from "../../components/CustomBtn";
import ExerciseCard from "./components/ExerciseCard.jsx";
import MuscleSort from "./components/MuscleSort.jsx";
import CreateExerciseModal from "./components/CreateExerciseModal.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import { useEffect, useMemo, useState } from "react";
import exerciseService from "../../services/exercisesService";
import { MUSCLE_GROUPS } from "./constants/muscleGroups";

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [customExercises, setCustomExercises] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    
    useBodyClass("exercise-page-body");

    useEffect(() => {
        exerciseService.getAll().then((response) => {
            setExercises(response?.data?.data ?? []);
        }).catch(() => {
            setExercises([]);
        });

    }, []);

    const handleGroupChange = (group) => {
        setSelectedGroup(group);

        if (group === "custom") {
            exerciseService.getMyCustomExercise().then((response) => {
                setCustomExercises(response?.data?.data ?? []);
            }).catch(() => {
                setCustomExercises([]);
            });
        }
    };

    const handleCreatedExercise = (created) => {
        setExercises((prev) => [created, ...prev]);
        setCustomExercises((prev) => [created, ...prev]);
        setSelectedGroup("custom");
        setIsCreateOpen(false);
    };

    const handleDeleteCustomExercise = (exercise) => {
        const exerciseId = exercise?.exerciseId;
        if (!exerciseId) return;

        exerciseService.deleteExercise(exerciseId).then(() => {
            setCustomExercises((prev) => prev.filter((item) => item?.exerciseId !== exerciseId));
            setExercises((prev) => prev.filter((item) => item?.exerciseId !== exerciseId));
        })
    };

    const filteredExercises = useMemo(() => {
        if (selectedGroup === "all") return exercises;
        if (selectedGroup === "custom") return customExercises;

        return exercises.filter((exercise) => {
            const group = (exercise?.muscleGroup || "").toLowerCase();
            return group.includes(selectedGroup);
        });
    }, [customExercises, exercises, selectedGroup]);

    return(
        <div className="exercise-page-cont">
            <div className="exercise-page-content">
                <div className="create-exercise-cont">
                    <CustomBtn
                        icon={<FaPlus />}
                        text="Create New Exercise"
                        onClick={() => {
                            setIsCreateOpen(true);
                        }}
                    />
                </div>
                <MuscleSort
                    groups={MUSCLE_GROUPS}
                    selectedGroup={selectedGroup}
                    onChange={handleGroupChange}
                />
                <div className="exercise-list-cont">
                    <ExerciseCard
                        exercises={filteredExercises}
                        showDelete={selectedGroup === "custom"}
                        onDelete={handleDeleteCustomExercise}
                    />
                </div>
            </div>
            <CreateExerciseModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreated={handleCreatedExercise}
                muscleGroups={MUSCLE_GROUPS}
            />
        </div>
    )
}

export default ExercisesPage;