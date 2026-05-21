const normalizeWorkoutSet = (set = {}) => ({
    ...set,
    setId: set?.setId ?? set?.set_id ?? null,
    weightKg: set?.weightKg ?? set?.weight_kg ?? 0,
    reps: set?.reps ?? 0,
    rpe: set?.rpe ?? null
});

const normalizeWorkoutExercise = (exercise = {}) => ({
    ...exercise,
    id: exercise?.id ?? exercise?.workoutExerciseId ?? exercise?.workout_exercise_id ?? null,
    exerciseId: exercise?.exerciseId ?? exercise?.exercise_id ?? null,
    exerciseName: exercise?.exerciseName ?? exercise?.exercise_name ?? "",
    imageUrl: exercise?.imageUrl ?? exercise?.image_url ?? "",
    muscleGroup: exercise?.muscleGroup ?? exercise?.muscle_group ?? "",
    exerciseTonnage: Number(exercise?.exerciseTonnage ?? exercise?.exercise_tonnage ?? 0) || 0,
    sets: Array.isArray(exercise?.sets) ? exercise.sets.map(normalizeWorkoutSet) : []
});

export const normalizeWorkout = (workout = {}) => ({
    ...workout,
    workoutId: workout?.workoutId ?? workout?.workout_id ?? null,
    workoutName: workout?.workoutName ?? workout?.workout_name ?? workout?.name ?? "",
    startTime: workout?.startTime ?? workout?.start_time ?? null,
    endTime: workout?.endTime ?? workout?.end_time ?? null,
    isStarted: typeof workout?.isStarted === "boolean"
        ? workout.isStarted
        : typeof workout?.is_started === "boolean"
            ? workout.is_started
            : null,
    totalTonnage: Number(workout?.totalTonnage ?? workout?.total_tonnage ?? 0) || 0,
    caloriesBurned: Number(workout?.caloriesBurned ?? workout?.calories_burned ?? 0) || 0,
    notes: workout?.notes ?? "",
    programId: workout?.programId ?? workout?.program_id ?? null,
    exercisesWithSets: Array.isArray(workout?.exercisesWithSets)
        ? workout.exercisesWithSets.map(normalizeWorkoutExercise)
        : Array.isArray(workout?.exercises_with_sets)
            ? workout.exercises_with_sets.map(normalizeWorkoutExercise)
            : []
});

export const normalizeWorkouts = (workouts = []) => (
    Array.isArray(workouts) ? workouts.map(normalizeWorkout) : []
);
