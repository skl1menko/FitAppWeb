const workout_session = {
    common: {
        cancel: 'Cancel',
        save: 'Save',
        kg: 'kg',
    },
    page: {
        addExercise: 'Add exercise',
    },
    workoutSessionActions: {
        saveWorkout: 'SAVE WORKOUT',
        finishWorkout: 'FINISH WORKOUT',
        startWorkout: 'START NOW',
        deleteWorkout: 'DELETE',
        cancelWorkout: 'CANCEL',
    },
    workoutSessionInfo: {
        scheduled: 'SCHEDULED',
        time: 'TIME',
        tonnage: 'TONNAGE'
    },
    info: {
        startsWhenLaunched: 'Starts when launched',
    },
    exerciseCard: {
        addSet: 'Add Set',
        unnamedExercise: 'Unnamed exercise',
        generalGroup: 'General',
        errors: {
            deleteExercise: 'Failed to delete exercise',
        }
    },
    exerciseSetRow: {
        weightKg: 'WEIGHT KG',
        reps: 'REPS',
        rpe: 'RPE',
        placeholders: {
            kg: 'KG',
            reps: 'REPS',
            rpe: 'RPE',
        }
    },
    addExerciseModal: {
        title: 'Add exercise',
        closeAria: 'Close add exercise modal',
        searchPlaceholder: 'Find exercise',
        allMuscleGroups: 'All muscle groups',
        loading: 'Loading exercises...',
        empty: 'No exercises found for selected filters',
        imageFallback: 'IMG',
        noGroup: 'No group',
        adding: 'Adding...',
        addSelected: 'Add selected ({{count}})',
        errors: {
            loadExercises: 'Could not load exercises',
        }
    },
    cancelModal: {
        closeAria: 'Close cancel workout confirmation',
        title: 'Cancel Workout?',
        description: 'This will delete the current workout session and all unsaved progress. Are you sure?',
        keep: 'No, keep workout',
        confirm: 'Yes, cancel workout',
    },
    finishModal: {
        closeAria: 'Close finish workout confirmation',
        title: 'Finish Workout',
        description: 'Name your workout and review summary before saving.',
        workoutName: 'Workout name',
        placeholder: 'For example: Leg Day',
        sets: 'Sets',
    },
    errors: {
        enterWorkoutName: 'Please enter workout name',
        saveWorkout: 'Failed to save workout',
        finishWorkout: 'Failed to finish workout',
        cancelWorkout: 'Failed to cancel workout',
        startPlannedWorkout: 'Failed to start planned workout',
    }
};
export default workout_session;
