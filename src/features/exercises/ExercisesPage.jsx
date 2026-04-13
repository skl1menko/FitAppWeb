import "./ExercisesPage.scss"
import {FaPlus} from "../../assets/icons"
import CustomBtn from "../../components/CustomBtn";
import ExerciseCard from "./components/ExerciseCard.jsx";
import MuscleSort from "./components/MuscleSort.jsx";
import useBodyClass from "../../hooks/useBodyClass";
import { useEffect, useMemo, useState } from "react";
import exerciseService from "../../services/exercisesService";
import { MUSCLE_GROUPS } from "./constants/muscleGroups";

const ExercisesPage = () => {
    const [exercises, setExercises] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("all");

    
    useBodyClass("exercise-page-body");

    useEffect(() => {
        exerciseService.getAll().then((response) => {
            setExercises(response?.data?.data ?? []);
        }).catch(() => {
            setExercises([]);
        });

    }, []);

    const filteredExercises = useMemo(() => {
        if (selectedGroup === "all") return exercises;

        return exercises.filter((exercise) => {
            const group = (exercise?.muscleGroup || "").toLowerCase();
            return group.includes(selectedGroup);
        });
    }, [exercises, selectedGroup]);

    return(
        <div className="exercise-page-cont">
            <div className="exercise-page-content">
                <div className="create-exercise-cont">
                    <CustomBtn icon={<FaPlus />} text="Create New Exercise" />
                </div>
                <MuscleSort
                    groups={MUSCLE_GROUPS}
                    selectedGroup={selectedGroup}
                    onChange={setSelectedGroup}
                />
                <div className="exercise-list-cont">
                    <ExerciseCard exercises={filteredExercises} />
                </div>
            </div>
        </div>
    )
}

export default ExercisesPage;