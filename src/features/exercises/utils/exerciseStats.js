export const HISTORY_LIMIT = 60;

const getSetWeight = (set) => Number(set?.weightKg ?? set?.weight_kg ?? 0) || 0;

const getSetReps = (set) => Number(set?.reps ?? 0) || 0;

export const formatChartDate = (dateValue) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
};

export const getRecentWorkouts = (workouts = [], historyLimit = HISTORY_LIMIT) => (
    workouts
        .filter((workout) => workout?.startTime)
        .sort((left, right) => new Date(right.startTime || 0) - new Date(left.startTime || 0))
        .slice(0, historyLimit)
);

export const buildExerciseStats = ({
    exerciseId,
    workouts = [],
    workoutDetails = []
} = {}) => {
    const points = [];
    let maxWeight = 0;
    let maxReps = 0;
    let maxVolume = 0;

    workoutDetails.forEach((detail, index) => {
        const workout = workouts[index];
        if (!workout) {
            return;
        }

        const exerciseEntry = Array.isArray(detail?.exercisesWithSets)
            ? detail.exercisesWithSets.find((item) => item?.exerciseId === exerciseId)
            : null;

        if (!exerciseEntry) {
            return;
        }

        const sets = Array.isArray(exerciseEntry.sets) ? exerciseEntry.sets : [];
        const workoutWeight = sets.reduce((peak, set) => Math.max(peak, getSetWeight(set)), 0);
        const workoutReps = sets.reduce((peak, set) => Math.max(peak, getSetReps(set)), 0);
        const workoutVolume = Number(exerciseEntry.exerciseTonnage ?? 0)
            || sets.reduce((sum, set) => sum + (getSetWeight(set) * getSetReps(set)), 0);
        const workoutDate = workout?.startTime;

        points.push({
            workoutId: workout.workoutId,
            workoutName: workout.workoutName || workout.name || "Workout",
            dateValue: workoutDate,
            label: formatChartDate(workoutDate),
            weightKg: workoutWeight,
            reps: workoutReps,
            volumeKg: workoutVolume
        });

        maxWeight = Math.max(maxWeight, workoutWeight);
        maxReps = Math.max(maxReps, workoutReps);
        maxVolume = Math.max(maxVolume, workoutVolume);
    });

    points.sort((left, right) => new Date(left.dateValue) - new Date(right.dateValue));

    return {
        chartData: points,
        trackedWorkouts: points.length,
        maxWeight,
        maxReps,
        maxVolume
    };
};
