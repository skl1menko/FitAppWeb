const getStorageKey = (workoutId) => `workout-session:exercise-card:${workoutId}`;

const getEmptyDraftState = () => ({
    checkedBySetKey: {},
    draftBySetKey: {}
});

export const readWorkoutSessionDraftState = (workoutId) => {
    if (!workoutId) {
        return getEmptyDraftState();
    }

    try {
        const rawState = localStorage.getItem(getStorageKey(workoutId));
        if (!rawState) {
            return getEmptyDraftState();
        }

        const parsedState = JSON.parse(rawState);
        return {
            checkedBySetKey: parsedState?.checkedBySetKey || {},
            draftBySetKey: parsedState?.draftBySetKey || {}
        };
    } catch (error) {
        console.error("Failed to restore exercise card state:", error);
        return getEmptyDraftState();
    }
};

export const writeWorkoutSessionDraftState = (workoutId, state) => {
    if (!workoutId) {
        return;
    }

    try {
        localStorage.setItem(
            getStorageKey(workoutId),
            JSON.stringify({
                checkedBySetKey: state?.checkedBySetKey || {},
                draftBySetKey: state?.draftBySetKey || {}
            })
        );
    } catch (error) {
        console.error("Failed to persist exercise card state:", error);
    }
};
