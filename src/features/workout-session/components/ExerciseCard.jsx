import "./ExerciseCard.scss";
import useWorkoutExercisesSet from "../hooks/useWorkoutExercisesSet";
import {useEffect, useState } from "react";
import CustomBtn from "../../../components/CustomBtn";
import { GoPlus, MdOutlineCancel, GiWeight } from "../../../assets/icons";

const ExerciseCard = ({ workoutExercises = [], activeWorkoutId = null, onDeleteExercise = null, onSetUpdated = null }) => {
    const { getExerciseSets, addDefaultSet, updateSet } = useWorkoutExercisesSet(activeWorkoutId, workoutExercises);
    const [draftBySetKey, setDraftBySetKey] = useState({});
    const [checkedBySetKey, setCheckedBySetKey] = useState({});
    const [isLocalStateHydrated, setIsLocalStateHydrated] = useState(false);

    const getSetKey = (exerciseId, setId) => `${exerciseId}-${setId}`;
    const getStorageKey = (workoutId) => `workout-session:exercise-card:${workoutId}`;

    useEffect(() => {
        if (!activeWorkoutId) {
            setDraftBySetKey({});
            setCheckedBySetKey({});
            setIsLocalStateHydrated(false);
            return;
        }

        try {
            const rawState = localStorage.getItem(getStorageKey(activeWorkoutId));
            if (!rawState) {
                setDraftBySetKey({});
                setCheckedBySetKey({});
                setIsLocalStateHydrated(true);
                return;
            }

            const parsedState = JSON.parse(rawState);
            setDraftBySetKey(parsedState?.draftBySetKey || {});
            setCheckedBySetKey(parsedState?.checkedBySetKey || {});
        } catch (error) {
            console.error("Failed to restore exercise card state:", error);
            setDraftBySetKey({});
            setCheckedBySetKey({});
        } finally {
            setIsLocalStateHydrated(true);
        }
    }, [activeWorkoutId]);

    useEffect(() => {
        if (!activeWorkoutId || !isLocalStateHydrated) {
            return;
        }

        try {
            localStorage.setItem(
                getStorageKey(activeWorkoutId),
                JSON.stringify({
                    draftBySetKey,
                    checkedBySetKey
                })
            );
        } catch (error) {
            console.error("Failed to persist exercise card state:", error);
        }
    }, [activeWorkoutId, isLocalStateHydrated, draftBySetKey, checkedBySetKey]);

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
            alert(error?.response?.data?.message || "Failed to delete exercise");
        }
    };

    

    const handleAddSet = async (exerciseId) => {
        if (!activeWorkoutId || !exerciseId) {
            return;
        }

        
        
        await addDefaultSet(activeWorkoutId, exerciseId);
    };

    const getInputValue = (exerciseId, setObj, field) => {
        const key = getSetKey(exerciseId, setObj?.setId);
        const draftValue = draftBySetKey[key]?.[field];
        if (draftValue !== undefined) return draftValue;


        if (field === "weight_kg") return (setObj?.weight_kg === 0 || setObj?.weight_kg == null) ? "" : setObj?.weight_kg;
        if (field === "reps") return (setObj?.reps === 0 || setObj?.reps == null) ? "" : setObj?.reps;
        if (field === "rpe") return (setObj?.rpe === 0 || setObj?.rpe == null) ? "" : setObj?.rpe ?? "";

        return "";
    };

    const handleInputChange = (exerciseId, setObj, field, nextValue) => {
        const key = getSetKey(exerciseId, setObj?.setId);
        setDraftBySetKey((prev) => ({
            ...prev,
            [key]: {
                ...(prev[key] || {}),
                [field]: nextValue
            }
        }));
        setCheckedBySetKey((prev) => ({
            ...prev,
            [key]: false
        }));
    };

    const toNonNegativeNumberOrFallback = (value, fallback) => {
        if (value === "" || value == null) {
            return 0;
        }

        const normalized = Number(value);
        if (Number.isFinite(normalized) && normalized >= 0) {
            return normalized;
        }

        return fallback;
    };

    const handleCheckboxChange = async (workoutExerciseId, setObj, checked) => {
        if (!activeWorkoutId || !workoutExerciseId || !setObj?.setId) {
            return;
        }

        const key = getSetKey(workoutExerciseId, setObj.setId);

        if (checked === false) {
            const emptiedSet = await updateSet(activeWorkoutId, workoutExerciseId, setObj.setId, {
                weight_kg: 0,
                reps:0,
                rpe: null
            });

            if (!emptiedSet) {
                return;
            }

            if (typeof onSetUpdated === "function") {
                await onSetUpdated();
            }

            setCheckedBySetKey((prev) => ({
                ...prev,
                [key]: false
            }));
            return;
        }


        const nextWeight = toNonNegativeNumberOrFallback(
            getInputValue(workoutExerciseId, setObj, "weight_kg"),
            Number(setObj?.weight_kg) || 0
        );
        const nextReps = toNonNegativeNumberOrFallback(
            getInputValue(workoutExerciseId, setObj, "reps"),
            Number(setObj?.reps) || 0
        );

        const rawRpe = getInputValue(workoutExerciseId, setObj, "rpe");
        let nextRpe = null;
        if (rawRpe !== "" && rawRpe != null) {
            const normalizedRpe = Number(rawRpe);
            if (Number.isFinite(normalizedRpe)) {
                nextRpe = normalizedRpe;
            }
        }

        const updatedSet = await updateSet(activeWorkoutId, workoutExerciseId, setObj.setId, {
            weight_kg: nextWeight,
            reps: nextReps,
            rpe: nextRpe
        });

        if (!updatedSet) {
            return;
        }

        if (typeof onSetUpdated === "function") {
            await onSetUpdated();
        }

        setCheckedBySetKey((prev) => ({
            ...prev,
            [key]: true
        }));
    };


    return (
        <>{(workoutExercises || []).map((exercise) => {
            const workoutExerciseId = Number(exercise?.id);
            const exerciseId = Number(exercise?.exerciseId || exercise?.exercise_id);
            const sets = Number.isFinite(workoutExerciseId) && workoutExerciseId > 0
                ? getExerciseSets(workoutExerciseId)
                : [];

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
                                    <span className="exercise-list-tonnage"><GiWeight size={18} /> {exercise?.exerciseTonnage} kg</span>
                                </div>
                            </div>
                        </div>
                        <div className="delete-exercise-btn-cont">
                            <CustomBtn icon={<MdOutlineCancel size={22} />} onClick={() => handleDeleteExercise(workoutExerciseId)} className="delete-exercise-btn" />
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="exercise-card-body">
                        {sets.map((set, index) => (
                            <div className="set-cont" key={set?.setId || `${exerciseId}-set-${index + 1}`}>
                                <span className="id-set-cont">{index + 1}</span>
                                <div className="set-value-cont">
                                    <span className="set-label">WEIGHT KG</span>
                                    <input
                                        className="set-value"
                                        type="text"
                                        placeholder="KG"
                                        value={getInputValue(workoutExerciseId, set, "weight_kg")}
                                        onChange={(event) => handleInputChange(workoutExerciseId, set, "weight_kg", event.target.value)}
                                    />
                                </div>
                                <div className="set-value-cont">
                                    <span className="set-label">REPS</span>
                                    <input
                                        className="set-value"
                                        type="text"
                                        placeholder="REPS"
                                        value={getInputValue(workoutExerciseId, set, "reps")}
                                        onChange={(event) => handleInputChange(workoutExerciseId, set, "reps", event.target.value)}
                                    />
                                </div>
                                <div className="set-value-cont">
                                    <span className="set-label">RPE</span>
                                    <input
                                        className="set-value"
                                        type="text"
                                        placeholder="RPE"
                                        value={getInputValue(workoutExerciseId, set, "rpe")}
                                        onChange={(event) => handleInputChange(workoutExerciseId, set, "rpe", event.target.value)}
                                    />
                                </div>
                                <div className="check-box-cont">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(checkedBySetKey[getSetKey(workoutExerciseId, set?.setId)])}
                                        onChange={(event) => handleCheckboxChange(workoutExerciseId, set , event.target.checked)}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="add-set-cont">
                            <CustomBtn icon={<GoPlus size={22} />} text="Add Set" onClick={() => handleAddSet(workoutExerciseId)} className="add-set-btn" />
                        </div>
                    </div>
                </div>
            );
        })}



        </>
    )
    
}

export default ExerciseCard;