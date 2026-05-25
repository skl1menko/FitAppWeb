const workout_session = {
    common: {
        cancel: 'Скасувати',
        save: 'Зберегти',
        kg: 'кг',
    },
    page: {
        addExercise: 'Додати вправу',
    },
    workoutSessionActions: {
        saveWorkout: 'ЗБЕРЕГТИ ТРЕНУВАННЯ',
        finishWorkout: 'ЗАВЕРШИТИ ТРЕНУВАННЯ',
        startWorkout: 'ПОЧАТИ ЗАРАЗ',
        deleteWorkout: 'ВИДАЛИТИ',
        cancelWorkout: 'СКАСУВАТИ',
    },
    workoutSessionInfo: {
        scheduled: 'ЗАПЛАНОВАНО',
        time: 'ЧАС',
        tonnage: 'ТОННАЖ',
    },
    info: {
        startsWhenLaunched: 'Почнеться після запуску',
    },
    exerciseCard: {
        addSet: 'Додати сет',
        unnamedExercise: 'Без назви',
        generalGroup: 'Загальна',
        errors: {
            deleteExercise: 'Не вдалося видалити вправу',
        }
    },
    exerciseSetRow: {
        weightKg: 'ВАГА',
        reps: 'ПОВТОРЕННЯ',
        rpe: 'RPE',
        placeholders: {
            kg: 'КГ',
            reps: 'REP',
            rpe: 'RPE',
        }
    },
    addExerciseModal: {
        title: 'Додати вправу',
        closeAria: 'Закрити модалку додавання вправи',
        searchPlaceholder: 'Знайти вправу',
        allMuscleGroups: "Усі м'язові групи",
        loading: 'Завантаження вправ...',
        empty: 'За вибраними фільтрами вправ не знайдено',
        imageFallback: 'IMG',
        noGroup: 'Без групи',
        adding: 'Додавання...',
        addSelected: 'Додати вибрані ({{count}})',
        errors: {
            loadExercises: 'Не вдалося завантажити вправи',
        }
    },
    cancelModal: {
        closeAria: 'Закрити підтвердження скасування тренування',
        title: 'Скасувати тренування?',
        description: 'Поточна сесія тренування та весь незбережений прогрес будуть видалені. Ви впевнені?',
        keep: 'Ні, залишити тренування',
        confirm: 'Так, скасувати тренування',
    },
    finishModal: {
        closeAria: 'Закрити підтвердження завершення тренування',
        title: 'Завершити тренування',
        description: 'Назвіть тренування та перевірте підсумок перед збереженням.',
        workoutName: 'Назва тренування',
        placeholder: 'Наприклад: День ніг',
        sets: 'Сети',
    },
    errors: {
        enterWorkoutName: 'Будь ласка, введіть назву тренування',
        saveWorkout: 'Не вдалося зберегти тренування',
        finishWorkout: 'Не вдалося завершити тренування',
        cancelWorkout: 'Не вдалося скасувати тренування',
        startPlannedWorkout: 'Не вдалося почати заплановане тренування',
    }
};

export default workout_session;
