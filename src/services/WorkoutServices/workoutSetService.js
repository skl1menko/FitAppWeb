import api from './api';

const workoutSetService = {
    addSet: (workoutId, exerciseId, data) => {
        return api.post(`/workouts/${workoutId}/exercises/${exerciseId}/sets`, data);
    },

    getSets: (workoutId, exerciseId) => {
        return api.get(`/workouts/${workoutId}/exercises/${exerciseId}/sets`);
    },

    updateSet: (workoutId, exerciseId, setId, data) => {
        return api.put(`/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`, data);
    },

    deleteSet: (workoutId, exerciseId, setId) => {
        return api.delete(`/workouts/${workoutId}/exercises/${exerciseId}/sets/${setId}`);
    }
}

export default workoutSetService;