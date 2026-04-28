import api from '../api';

const workoutService = {

    // ── Workouts ───────────────────────────────────────────────

    create: (data = {}) => {
        return api.post('/workouts', data);
    },

    getAll: () => {
        return api.get('/workouts');
    },

    getById: (workoutId) => {
        return api.get(`/workouts/${workoutId}`);
    },

    getByPeriod: (startDate, endDate) => {
        return api.get(`/workouts/range?start=${startDate}&end=${endDate}`);
    },

    update: (workoutId, data) => {
        return api.put(`/workouts/${workoutId}`, data);
    },

    delete: (workoutId) => {
        return api.delete(`/workouts/${workoutId}`);
    },

    calculateTonnage: (workoutId) => {
        return api.post(`/workouts/${workoutId}/calculate`);
    }
};

export default workoutService;