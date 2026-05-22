import "./ExerciseCard.scss";
import useWorkoutExercisesSet from "../hooks/useWorkoutExercisesSet";
import useExerciseSetDrafts from "../hooks/useExerciseSetDrafts";
import ExerciseSetRow from "./ExerciseSetRow";
import CustomBtn from "../../../components/CustomBtn";
import { GoPlus, GiWeight, LuX } from "../../../assets/icons";
import { formatGroupedNumber } from "../../../utils/formatNumber";
import { showWorkoutAlert } from "../../workout/utils/workoutFeedback";

const ExerciseCard = ({ workoutExercises = [], activeWorkoutId = null, isPlannedMode = false, onDeleteExercise = null, onSetUpdated = null }) => {
    const { getExerciseSets, addDefaultSet, updateSet, deleteSet } = useWorkoutExercisesSet(workoutExercises);
    const {
        getSetKey,
        getSetUpdatePayload,
        getSetValues,
        handleInputChange,
        isSetChecked,
        removeStateBySetKey,
        setCheckedState
    } = useExerciseSetDrafts(activeWorkoutId);

    const handleDeleteExercise = async (exerciseId) => {
        if (!activeWorkoutId || !exerciseId) {
            return;
        }

        try {
            if (typeof onDeleteExercise === "function") {
                await onDeleteExercise(exerciseId);
            }
        } catch (error) {
            console.error("Failed to delete exercise from workout:", error?.response?.data || error);
            showWorkoutAlert(error?.response?.data?.message || "Failed to delete exercise");
        }
    };

    const handleAddSet = async (exerciseId) => {
        if (!activeWorkoutId || !exerciseId) {
            return;
        }

        await addDefaultSet(activeWorkoutId, exerciseId);
    };

    const handleDeleteSet = async (workoutExerciseId, setObj) => {
        if (!activeWorkoutId || !workoutExerciseId || !setObj?.setId) {
            return;
        }

        await deleteSet(activeWorkoutId, workoutExerciseId, setObj.setId);

        const key = getSetKey(workoutExerciseId, setObj.setId);
        removeStateBySetKey(key);

        if (typeof onSetUpdated === "function") {
            await onSetUpdated();
        }
    };

    const handleCheckboxChange = async (workoutExerciseId, setObj, checked) => {
        if (!activeWorkoutId || !workoutExerciseId || !setObj?.setId) {
            return;
        }

        const key = getSetKey(workoutExerciseId, setObj.setId);
        const previousChecked = isSetChecked(workoutExerciseId, setObj.setId);
        const nextPayload = getSetUpdatePayload(workoutExerciseId, setObj, checked);

        setCheckedState(key, checked);

        try {
            const updatedSet = await updateSet(
                activeWorkoutId,
                workoutExerciseId,
                setObj.setId,
                nextPayload
            );

            if (!updatedSet) {
                throw new Error("Failed to update set");
            }

            if (typeof onSetUpdated === "function") {
                await onSetUpdated();
            }
        } catch (error) {
            console.error("Failed to toggle set completion:", error);
            setCheckedState(key, previousChecked);
        }
    };

    return (
        <>
            {(workoutExercises || []).map((exercise) => {
                const workoutExerciseId = Number(exercise?.id);
                const exerciseId = Number(exercise?.exerciseId || exercise?.exercise_id);
                const sets = Number.isFinite(workoutExerciseId) && workoutExerciseId > 0
                    ? getExerciseSets(workoutExerciseId)
                    : (Array.isArray(exercise?.sets) ? exercise.sets : []);

                return (
                    <div className="exercise-list-item" key={exercise?.id || exercise?.exerciseId}>
                        <div className="exercise-card-header">
                            <div className="exercise-card-info-cont">
                                <div className="exercise-icon-cont">
                                    <img src={exercise?.imageUrl} alt="" />
                                </div>
                                <div className="exercise-info-cont">
                                    <p className="exercise-list-name">{exercise?.exerciseName || "Unnamed exercise"}</p>
                                    <div className="exercise-info">
                                        <span className="exercise-list-group">{exercise?.muscleGroup || "General"}</span>
                                        <div className="divider"></div>
                                        <span className="exercise-list-tonnage"><GiWeight size={18} /> {formatGroupedNumber(exercise?.exerciseTonnage || 0)} kg</span>
                                    </div>
                                </div>
                            </div>
                            <div className="delete-exercise-btn-cont">
                                <CustomBtn
                                    icon={<LuX size={22} />}
                                    onClick={() => handleDeleteExercise(workoutExerciseId)}
                                    className="delete-exercise-btn"
                                />
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="exercise-card-body">
                            {sets.map((set, index) => (
                                <ExerciseSetRow
                                    key={set?.setId || `${exerciseId}-set-${index + 1}`}
                                    index={index}
                                    set={set}
                                    isPlannedMode={isPlannedMode}
                                    values={getSetValues(workoutExerciseId, set)}
                                    checked={isSetChecked(workoutExerciseId, set?.setId)}
                                    onValueChange={(field, value) => handleInputChange(workoutExerciseId, set, field, value)}
                                    onCheckedChange={(nextChecked) => handleCheckboxChange(workoutExerciseId, set, nextChecked)}
                                    onDelete={() => handleDeleteSet(workoutExerciseId, set)}
                                />
                            ))}
                            <div className="add-set-cont">
                                <CustomBtn
                                    icon={<GoPlus size={22} />}
                                    text="Add Set"
                                    onClick={() => handleAddSet(workoutExerciseId)}
                                    className="add-set-btn"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ExerciseCard;
