import api from './api';

const trainerService = {
    getClients: () => {
        return api.get('/trainers/clients');
    },

    addClientByEmail: (email) => {
        return api.post('/trainers/clients', {email});
    },

    addClientById: (athleteId) => {
        return api.post('/trainers/clients', {athleteId});
    },

    getClientsWorkouts: (clientId) => {
        return api.get(`/trainers/clients/${clientId}/workouts`);
    },

    getClientBodyMeasurements: (clientId) => {
        return api.get(`/trainers/clients/${clientId}/body-measurements`);
    },

    getClientBodyMeasurementProgress: (clientId, field, startDate, endDate) => {
        return api.get(`/trainers/clients/${clientId}/body-measurements/progress`, {
            params: {field, startDate, endDate}
        });
    },

    getClientDailyHealthMetrics: (clientId, date) => {
        return api.get(`/trainers/clients/${clientId}/health-metrics/daily`, {params: {date}});
    },

    getClientHealthMetricsRange: (clientId, start_date, end_date) => {
        return api.get(`/trainers/clients/${clientId}/health-metrics/range`, {
            params: {start_date, end_date}
        });
    },

    assignProgramToAthlete: (programId, athleteId) => {
        return api.post(`/trainers/programs/${programId}/assign`, {athleteId});
    },

    unassignProgramFromAthlete: (programId, athleteId) => {
        return api.delete(`/trainers/programs/${programId}/assign/${athleteId}`);
    },

    unassignAllProgramsFromAthlete: (athleteId) => {
        return api.delete(`/trainers/programs/assign/${athleteId}/all`);
    },

    removeClientById: (clientId) => {
        return api.delete(`/trainers/clients/${clientId}`);
    },

    searchAthletes: (query = '') => {
        return api.get('/trainers/athletes/search', {params: {q: query}});
    },

    searchTrainers: (query = '') => {
        return api.get('/trainers/search', {params: {q: query}});
    },

    getMyTrainer: () => {
        return api.get('/trainers/my-trainer');
    },

    unlinkMyTrainer: () => {
        return api.delete('/trainers/my-trainer');
    },

    selectTrainer: (trainerId) => {
        return api.post('/trainers/select', {trainerId});
    },

    getIncomingRequests: () => {
        return api.get('/trainers/requests/incoming');
    },

    getOutgoingRequests: () => {
        return api.get('/trainers/requests/outgoing');
    },

    approveRequest: (athleteId, trainerId) => {
        return api.post(`/trainers/requests/${athleteId}/${trainerId}/approve`);
    },

    rejectRequest: (athleteId, trainerId) => {
        return api.post(`/trainers/requests/${athleteId}/${trainerId}/reject`);
    }
};

export default trainerService;
