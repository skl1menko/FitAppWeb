const normalizeWorkout = (workout = {}) => ({
    workoutId: workout.workoutId || workout.id || null,
    workoutName: workout.workoutName || workout.name || "Workout",
    startTime: workout.startTime || workout.start_time || null,
    endTime: workout.endTime || workout.end_time || null,
    isStarted: Boolean(workout.isStarted ?? workout.is_started)
});

export const normalizeProgram = (program = {}) => ({
    programId: program.programId || program.id || null,
    programName: program.programName || program.name || "Plan",
    description: program.description || "",
    workouts: Array.isArray(program.workouts) ? program.workouts.map(normalizeWorkout) : [],
    isAssigned: Boolean(program.isAssigned),
    assignedByName: program.assignedByName || "",
    assignedAthletesCount: Number(program.assignedAthletesCount) || 0,
    createdAt: program.createdAt || program.created_at || null
});
