const normalizeTranslationPart = (value) => (
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
);

export const getExerciseTranslationKey = (exerciseName, muscleGroup) => {
    const normalizedName = normalizeTranslationPart(exerciseName);
    const normalizedGroup = normalizeTranslationPart(muscleGroup || "general");

    if (!normalizedName) {
        return "";
    }

    return `${normalizedGroup}::${normalizedName}`;
};

export const translateExerciseName = ({
    exerciseName,
    muscleGroup,
    t,
    fallback = "",
}) => {
    const originalName = String(exerciseName || "").trim();

    if (!originalName) {
        return fallback;
    }

    const translationKey = getExerciseTranslationKey(originalName, muscleGroup);
    if (!translationKey) {
        return originalName;
    }

    return t(`exercises.exerciseNames.${translationKey}`, {
        defaultValue: originalName,
        nsSeparator: false,
    });
};
