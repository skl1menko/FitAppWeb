export const ACTIVE_WORKOUT_EXISTS_MESSAGE = "You have an active workout session. Please finish or cancel it before starting a new one.";

export const showWorkoutAlert = (message) => {
    if (!message) {
        return;
    }

    window.alert(message);
};

export const showActiveWorkoutExistsAlert = () => {
    showWorkoutAlert(ACTIVE_WORKOUT_EXISTS_MESSAGE);
};
