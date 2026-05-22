import { useEffect, useState } from "react";
import {
    readWorkoutSessionDraftState,
    writeWorkoutSessionDraftState
} from "../utils/workoutSessionDraftStorage";

const EMPTY_SET_VALUES = {
    reps: 0,
    rpe: null,
    weight_kg: 0
};

const getSetKey = (exerciseId, setId) => `${exerciseId}-${setId}`;

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

const useExerciseSetDrafts = (activeWorkoutId = null) => {
    const [draftBySetKey, setDraftBySetKey] = useState({});
    const [checkedBySetKey, setCheckedBySetKey] = useState({});
    const [isLocalStateHydrated, setIsLocalStateHydrated] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (!activeWorkoutId) {
                setDraftBySetKey({});
                setCheckedBySetKey({});
                setIsLocalStateHydrated(false);
                return;
            }

            const restoredState = readWorkoutSessionDraftState(activeWorkoutId);
            setDraftBySetKey(restoredState.draftBySetKey);
            setCheckedBySetKey(restoredState.checkedBySetKey);
            setIsLocalStateHydrated(true);
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [activeWorkoutId]);

    useEffect(() => {
        if (!activeWorkoutId || !isLocalStateHydrated) {
            return;
        }

        writeWorkoutSessionDraftState(activeWorkoutId, {
            checkedBySetKey,
            draftBySetKey
        });
    }, [activeWorkoutId, checkedBySetKey, draftBySetKey, isLocalStateHydrated]);

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

    const getSetUpdatePayload = (exerciseId, setObj, checked) => {
        if (!checked) {
            return EMPTY_SET_VALUES;
        }

        const nextWeight = toNonNegativeNumberOrFallback(
            getInputValue(exerciseId, setObj, "weight_kg"),
            Number(setObj?.weight_kg) || 0
        );
        const nextReps = toNonNegativeNumberOrFallback(
            getInputValue(exerciseId, setObj, "reps"),
            Number(setObj?.reps) || 0
        );

        const rawRpe = getInputValue(exerciseId, setObj, "rpe");
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

    const isSetChecked = (exerciseId, setId) => {
        return Boolean(checkedBySetKey[getSetKey(exerciseId, setId)]);
    };

    return {
        getSetKey,
        getSetUpdatePayload,
        getSetValues,
        handleInputChange,
        isSetChecked,
        removeStateBySetKey,
        setCheckedState
    };
};

export default useExerciseSetDrafts;
