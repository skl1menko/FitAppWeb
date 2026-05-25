import { getMuscleGroupTranslationKey } from "../constants/muscleGroups";

export const translateMuscleGroup = ({ muscleGroup, t, fallback = "" }) => {
    if (!muscleGroup) {
        return fallback;
    }

    return t(`exercises.muscleGroups.${getMuscleGroupTranslationKey(muscleGroup)}`, {
        defaultValue: muscleGroup,
    });
};
