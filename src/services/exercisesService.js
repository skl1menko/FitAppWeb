
import api from './api';

const exercisesService = {
    create: (exerciseData) => {
        return api.post('/exercises', exerciseData);
    },

    getAll: () => {
        return api.get('/exercises');
    },

    getByMuscleGroup: (muscleGroup) => {
        return api.get(`/exercises/muscle/${muscleGroup}`);
    },

    getMyCustomExercise: () => {
        return api.get('/exercises/my');
    },

    getExerciseById: (exerciseId) => {
        return api.get(`/exercises/${exerciseId}`);
    },

    updateExercise: (exerciseId, name, muscleGroup, description, imageUrl) => {
        return api.put(`/exercises/${exerciseId}`, {name, muscle_group: muscleGroup, description, image_url: imageUrl});
    },
    
    deleteExercise: (exerciseId) => {
        return api.delete(`/exercises/${exerciseId}`);
    }
}

export default exercisesService;