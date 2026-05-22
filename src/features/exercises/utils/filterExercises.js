export const filterExercises = ({
    exercises = [],
    customExercises = [],
    selectedGroup = "all"
} = {}) => {
    if (selectedGroup === "all") {
        return exercises;
    }

    if (selectedGroup === "custom") {
        return customExercises;
    }

    return exercises.filter((exercise) => {
        const group = (exercise?.muscleGroup || "").toLowerCase();
        return group.includes(selectedGroup);
    });
};
