import "./ExerciseCard.scss";
import useWorkoutExercisesSet from "../hooks/useWorkoutExercisesSet";
import { useEffect, useState } from "react";
import ExerciseSetRow from "./ExerciseSetRow";
import CustomBtn from "../../../components/CustomBtn";
import { GoPlus, GiWeight, LuX } from "../../../assets/icons";
import { formatGroupedNumber } from "../../../utils/formatNumber";

const EMPTY_SET_VALUES = {
    weight_kg: 0,
    reps: 0,
    rpe: null
};

const ExerciseCard = ({ workoutExercises = [], activeWorkoutId = null, isPlannedMode = false, onDeleteExercise = null, onSetUpdated = null }) => {
    const { getExerciseSets, addDefaultSet, updateSet, deleteSet } = useWorkoutExercisesSet(activeWorkoutId, workoutExercises);
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

    const removeStateBySetKey = (key) => {
        setDraftBySetKey((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setCheckedBySetKey((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const setCheckedState = (key, value) => {
        setCheckedBySetKey((prev) => ({
            ...prev,
            [key]: value
        }));
    };

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

    const getInputValue = (exerciseId, setObj, field) => {
        const key = getSetKey(exerciseId, setObj?.setId);
        const draftValue = draftBySetKey[key]?.[field];
        if (draftValue !== undefined) {
            return draftValue;
        }

        if (field === "weight_kg") {
            return setObj?.weight_kg === 0 || setObj?.weight_kg == null ? "" : setObj?.weight_kg;
        }
        if (field === "reps") {
            return setObj?.reps === 0 || setObj?.reps == null ? "" : setObj?.reps;
        }
        if (field === "rpe") {
            return setObj?.rpe === 0 || setObj?.rpe == null ? "" : setObj?.rpe ?? "";
        }

        return "";
    };

    const getSetValues = (exerciseId, setObj) => ({
        weight_kg: getInputValue(exerciseId, setObj, "weight_kg"),
        reps: getInputValue(exerciseId, setObj, "reps"),
        rpe: getInputValue(exerciseId, setObj, "rpe")
    });

    const handleInputChange = (exerciseId, setObj, field, nextValue) => {
        const key = getSetKey(exerciseId, setObj?.setId);

        if (field === "weight_kg" || field === "reps") {
            setDraftBySetKey((prev) => ({
                ...prev,
                [key]: {
                    ...(prev[key] || {}),
                    [field]: nextValue.replace(/[^0-9]/g, "")
                }
            }));
        } else if (field === "rpe") {
            const result = nextValue.replace(/[^0-9]/g, "");
            if (result === "") {
                setDraftBySetKey((prev) => ({
                    ...prev,
                    [key]: {
                        ...(prev[key] || {}),
                        [field]: ""
                    }
                }));
                return;
            }

            const normalizedValue = Math.min(Number(result), 10);
            setDraftBySetKey((prev) => ({
                ...prev,
                [key]: {
                    ...(prev[key] || {}),
                    [field]: normalizedValue
                }
            }));
        }

        setCheckedState(key, false);
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

    const getSetUpdatePayload = (workoutExerciseId, setObj, checked) => {
        if (!checked) {
            return EMPTY_SET_VALUES;
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

        return {
            weight_kg: nextWeight,
            reps: nextReps,
            rpe: nextRpe
        };
    };

    const handleCheckboxChange = async (workoutExerciseId, setObj, checked) => {
        if (!activeWorkoutId || !workoutExerciseId || !setObj?.setId) {
            return;
        }

        const key = getSetKey(workoutExerciseId, setObj.setId);
        const previousChecked = Boolean(checkedBySetKey[key]);
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
                                checked={Boolean(checkedBySetKey[getSetKey(workoutExerciseId, set?.setId)])}
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
