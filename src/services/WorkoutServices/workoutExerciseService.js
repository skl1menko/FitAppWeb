import api from '../api';

const workoutExerciseService = {
    addExercise: (workoutId, data) => {
        return api.post(`/workouts/${workoutId}/exercises`, data);
    },

    getExercises: (workoutId) => {
        return api.get(`/workouts/${workoutId}/exercises`);
    },

    updateExerciseTonnage: (workoutId, exerciseId) => {
        return api.put(`/workouts/${workoutId}/exercises/${exerciseId}/tonnage`);
    },
    
    deleteExercise: (workoutId, exerciseId) => {
        return api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
    }
}

export default workoutExerciseService;