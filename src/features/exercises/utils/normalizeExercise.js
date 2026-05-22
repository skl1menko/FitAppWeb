const toOptionalNumber = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const toOptionalBoolean = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (value === 1 || value === "1") {
        return true;
    }

    if (value === 0 || value === "0") {
        return false;
    }

    return null;
};

export const normalizeExercise = (exercise = {}) => ({
    ...exercise,
    id: toOptionalNumber(exercise?.id ?? exercise?.exerciseId ?? exercise?.exercise_id),
    name: exercise?.name ?? exercise?.exerciseName ?? exercise?.exercise_name ?? "",
    muscleGroup: exercise?.muscleGroup ?? exercise?.muscle_group ?? "",
    description: exercise?.description ?? "",
    imageUrl: exercise?.imageUrl ?? exercise?.image_url ?? "",
    isCustom: toOptionalBoolean(exercise?.isCustom ?? exercise?.is_custom)
});

export const normalizeExercises = (exercises = []) => (
    Array.isArray(exercises) ? exercises.map(normalizeExercise) : []
);
