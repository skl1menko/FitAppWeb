const getStartedFlag = (workout) => {
    if (typeof workout?.isStarted === "boolean") {
        return workout.isStarted;
    }

    if (typeof workout?.is_started === "boolean") {
        return workout.is_started;
    }

    return null;
};

export const isWorkoutStarted = (workout) => {
    const startedFlag = getStartedFlag(workout);
    if (startedFlag !== null) {
        return startedFlag;
    }

    return Boolean(workout?.startTime || workout?.start_time || workout?.endTime || workout?.end_time);
};

export const isWorkoutCompleted = (workout) => Boolean(workout?.endTime || workout?.end_time);

export const isWorkoutActive = (workout) => isWorkoutStarted(workout) && !isWorkoutCompleted(workout);

export const isWorkoutScheduled = (workout) => !isWorkoutStarted(workout) && !isWorkoutCompleted(workout);
