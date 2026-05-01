import api from './api';

const trainingProgramService = {
    // ── Training Programs ───────────────────────────────────────────────
    create: (data ={}) => {
        return api.post('/programs', data);
    },

    createWithWorkouts: (data = {}) => {
        return api.post('/programs/with-workouts', data);
    },

    getAll: () => {
        return api.get('/programs');
    },

    getById: (programId) => {
        return api.get(`/programs/${programId}`);
    },

    getMy: () => {
        return api.get('/programs/my');
    },

    getMyCreated: () => {
        return api.get('/programs/my-created');
    },
    
    getMyAssigned: () => {
        return api.get('/programs/my-assigned');
    },

    update: (programId, data) => {
        return api.put(`/programs/${programId}`, data);
    },

    delete: (programId) => {
        return api.delete(`/programs/${programId}`);
    
    }

};

export default trainingProgramService;
